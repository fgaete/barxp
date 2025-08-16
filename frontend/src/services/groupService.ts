import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc,
  query, 
  where, 
  orderBy, 
  serverTimestamp,
  arrayUnion
} from 'firebase/firestore';
import { db } from './firebase';
import type { User } from '../types';
import { emailService } from './emailService';
import { drinkService } from './drinkService';

export interface GroupMember {
  id: string;
  name: string;
  email: string;
  level: number;
  xp: number;
  avatar: string | null;
  isOwner: boolean;
  joinedAt: Date;
}

export interface GroupActivity {
  id: string;
  userId: string;
  userName: string;
  action: string;
  timestamp: Date;
  details?: Record<string, unknown>;
}

export interface GroupEvent {
  id: string;
  name: string;
  description: string;
  date: Date;
  location?: string;
  attendees: string[]; // Array de user IDs
  createdBy: string;
  createdAt: Date;
}

export interface UserGroup {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  ownerName: string;
  members: GroupMember[];
  memberCount: number;
  inviteCode: string;
  isPrivate: boolean;
  createdAt: Date;
  updatedAt: Date;
  recentActivity: GroupActivity[];
  upcomingEvents: GroupEvent[];
}

class GroupService {
  private groupsCollection = collection(db, 'groups');
  private activitiesCollection = collection(db, 'groupActivities');
  private eventsCollection = collection(db, 'groupEvents');

  // Crear un nuevo grupo
  async createGroup(groupData: {
    name: string;
    description: string;
    isPrivate: boolean;
    owner: User;
  }): Promise<string> {
    try {
      const inviteCode = this.generateInviteCode();
      
      const newGroup = {
        name: groupData.name.trim(),
        description: groupData.description.trim(),
        ownerId: groupData.owner.id,
        ownerName: groupData.owner.displayName,
        members: [{
          id: groupData.owner.id,
          name: groupData.owner.displayName,
          email: groupData.owner.email,
          level: groupData.owner.level,
          xp: groupData.owner.currentXP,
          avatar: groupData.owner.photoURL || null,
          isOwner: true,
          joinedAt: new Date()
        }],
        memberCount: 1,
        inviteCode,
        isPrivate: groupData.isPrivate,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const docRef = await addDoc(this.groupsCollection, newGroup);
      
      // Registrar actividad de creación
      await this.addActivity(docRef.id, {
        userId: groupData.owner.id,
        userName: groupData.owner.displayName,
        action: 'creó el grupo',
        details: { groupName: groupData.name }
      });

      return docRef.id;
    } catch (error) {
      console.error('Error creating group:', error);
      throw new Error('No se pudo crear el grupo');
    }
  }

  // Obtener grupos del usuario
  async getUserGroups(userId: string): Promise<UserGroup[]> {
    try {
      // Buscar todos los grupos y filtrar en el cliente
      // Esto es menos eficiente pero más confiable para el desarrollo inicial
      const querySnapshot = await getDocs(this.groupsCollection);
      const groups: UserGroup[] = [];

      for (const docSnap of querySnapshot.docs) {
        const data = docSnap.data();
        
        // Filtrar grupos donde el usuario es owner o miembro
        const isOwner = data.ownerId === userId;
        const isMember = data.members?.some((member: GroupMember) => member.id === userId);
        
        if (!isOwner && !isMember) {
          continue; // Saltar este grupo si el usuario no es miembro
        }
        
        // Obtener actividades recientes
        const recentActivity = await this.getRecentActivity(docSnap.id);
        
        // Obtener eventos próximos
        const upcomingEvents = await this.getUpcomingEvents(docSnap.id);

        groups.push({
          id: docSnap.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
          recentActivity,
          upcomingEvents
        } as UserGroup);
      }

      return groups.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
    } catch (error) {
      console.error('Error fetching user groups:', error);
      throw new Error('No se pudieron cargar los grupos');
    }
  }

  // Unirse a un grupo por código de invitación
  async joinGroupByCode(inviteCode: string, user: User): Promise<string> {
    try {
      const q = query(
        this.groupsCollection,
        where('inviteCode', '==', inviteCode.toUpperCase())
      );
      
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        throw new Error('Código de invitación inválido');
      }

      const groupDoc = querySnapshot.docs[0];
      const groupData = groupDoc.data();
      
      // Verificar si el usuario ya es miembro
      const isMember = groupData.members.some((member: GroupMember) => member.id === user.id);
      if (isMember) {
        throw new Error('Ya eres miembro de este grupo');
      }

      // Agregar usuario al grupo
      const newMember: GroupMember = {
        id: user.id,
        name: user.displayName,
        email: user.email,
        level: user.level,
        xp: user.currentXP,
        avatar: user.photoURL || null,
        isOwner: false,
        joinedAt: new Date()
      };

      await updateDoc(doc(db, 'groups', groupDoc.id), {
        members: arrayUnion(newMember),
        memberCount: groupData.memberCount + 1,
        updatedAt: serverTimestamp()
      });

      // Registrar actividad
      await this.addActivity(groupDoc.id, {
        userId: user.id,
        userName: user.displayName,
        action: 'se unió al grupo'
      });

      // Enviar correo al dueño del grupo
      try {
        const ownerMember = groupData.members.find((member: GroupMember) => member.isOwner);
        if (ownerMember && ownerMember.email) {
          await emailService.sendGroupJoinNotification({
            recipientEmail: ownerMember.email,
            recipientName: ownerMember.name,
            newMemberName: user.displayName,
            groupName: groupData.name,
            memberCount: groupData.memberCount + 1,
            appUrl: window.location.origin
          });
          console.log('✅ Correo de notificación enviado al dueño del grupo');
        }
      } catch (emailError) {
        console.warn('⚠️ No se pudo enviar el correo de notificación:', emailError);
        // No lanzar error para no interrumpir el proceso de unión
      }

      // Otorgar XP al dueño del grupo
      try {
        const xpGranted = await drinkService.grantInvitationXP(groupData.ownerId, groupData.memberCount + 1);
        console.log(`🎉 ${xpGranted} XP otorgados al dueño del grupo por nueva invitación`);
      } catch (xpError) {
        console.warn('⚠️ No se pudo otorgar XP al dueño:', xpError);
        // No lanzar error para no interrumpir el proceso de unión
      }

      return groupDoc.id;
    } catch (error) {
      console.error('Error joining group:', error);
      throw error;
    }
  }

  // Agregar actividad al grupo
  private async addActivity(groupId: string, activity: {
    userId: string;
    userName: string;
    action: string;
    details?: Record<string, unknown>;
  }): Promise<void> {
    try {
      await addDoc(this.activitiesCollection, {
        groupId,
        ...activity,
        timestamp: serverTimestamp()
      });
    } catch (error) {
      console.error('Error adding activity:', error);
    }
  }

  // Obtener actividades recientes
  private async getRecentActivity(groupId: string): Promise<GroupActivity[]> {
    try {
      const q = query(
        this.activitiesCollection,
        where('groupId', '==', groupId),
        orderBy('timestamp', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.slice(0, 10).map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate() || new Date()
      })) as GroupActivity[];
    } catch (error) {
      console.error('Error fetching activities:', error);
      return [];
    }
  }

  // Obtener eventos próximos
  private async getUpcomingEvents(groupId: string): Promise<GroupEvent[]> {
    try {
      const q = query(
        this.eventsCollection,
        where('groupId', '==', groupId),
        where('date', '>=', new Date()),
        orderBy('date', 'asc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date?.toDate() || new Date(),
        createdAt: doc.data().createdAt?.toDate() || new Date()
      })) as GroupEvent[];
    } catch (error) {
      console.error('Error fetching events:', error);
      return [];
    }
  }

  // Generar código de invitación único
  private generateInviteCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  // Verificar si el usuario es owner del grupo
  async isGroupOwner(groupId: string, userId: string): Promise<boolean> {
    try {
      const groupDoc = await getDocs(query(
        this.groupsCollection,
        where('__name__', '==', groupId)
      ));
      
      if (groupDoc.empty) return false;
      
      const groupData = groupDoc.docs[0].data();
      return groupData.ownerId === userId;
    } catch (error) {
      console.error('Error checking group ownership:', error);
      return false;
    }
  }

  // Eliminar grupo (solo owner)
  async deleteGroup(groupId: string, userId: string): Promise<void> {
    try {
      // Verificar que el usuario sea el owner
      const isOwner = await this.isGroupOwner(groupId, userId);
      if (!isOwner) {
        throw new Error('Solo el creador del grupo puede eliminarlo');
      }

      // Eliminar el grupo
      await deleteDoc(doc(db, 'groups', groupId));
      
      // Eliminar actividades relacionadas
      const activitiesQuery = query(
        this.activitiesCollection,
        where('groupId', '==', groupId)
      );
      const activitiesSnapshot = await getDocs(activitiesQuery);
      const deleteActivitiesPromises = activitiesSnapshot.docs.map(doc => 
        deleteDoc(doc.ref)
      );
      
      // Eliminar eventos relacionados
      const eventsQuery = query(
        this.eventsCollection,
        where('groupId', '==', groupId)
      );
      const eventsSnapshot = await getDocs(eventsQuery);
      const deleteEventsPromises = eventsSnapshot.docs.map(doc => 
        deleteDoc(doc.ref)
      );
      
      await Promise.all([...deleteActivitiesPromises, ...deleteEventsPromises]);
    } catch (error) {
      console.error('Error deleting group:', error);
      throw error;
    }
  }

  // Remover miembro del grupo (solo owner)
  async removeMember(groupId: string, memberIdToRemove: string, requestingUserId: string): Promise<void> {
    try {
      // Verificar que el usuario sea el owner
      const isOwner = await this.isGroupOwner(groupId, requestingUserId);
      if (!isOwner) {
        throw new Error('Solo el creador del grupo puede remover miembros');
      }

      // No permitir que el owner se remueva a sí mismo
      if (memberIdToRemove === requestingUserId) {
        throw new Error('El creador del grupo no puede removerse a sí mismo');
      }

      // Obtener datos del grupo
      const groupQuery = query(
        this.groupsCollection,
        where('__name__', '==', groupId)
      );
      const groupSnapshot = await getDocs(groupQuery);
      
      if (groupSnapshot.empty) {
        throw new Error('Grupo no encontrado');
      }

      const groupDoc = groupSnapshot.docs[0];
      const groupData = groupDoc.data();
      
      // Encontrar y remover el miembro
      const memberToRemove = groupData.members.find((m: GroupMember) => m.id === memberIdToRemove);
      if (!memberToRemove) {
        throw new Error('Miembro no encontrado en el grupo');
      }

      const updatedMembers = groupData.members.filter((m: GroupMember) => m.id !== memberIdToRemove);
      
      await updateDoc(doc(db, 'groups', groupId), {
        members: updatedMembers,
        memberCount: groupData.memberCount - 1,
        updatedAt: serverTimestamp()
      });

      // Registrar actividad
      await this.addActivity(groupId, {
        userId: requestingUserId,
        userName: groupData.members.find((m: GroupMember) => m.id === requestingUserId)?.name || 'Usuario',
        action: `removió a ${memberToRemove.name} del grupo`
      });
    } catch (error) {
      console.error('Error removing member:', error);
      throw error;
    }
  }

  // Actualizar información del miembro en todos los grupos
  async updateMemberInfo(userId: string, updates: Partial<GroupMember>): Promise<void> {
    try {
      // Esta función se llamaría cuando el usuario actualice su perfil
      // Para mantener la información sincronizada en todos los grupos
      const userGroupsQuery = query(
        this.groupsCollection,
        where('members', 'array-contains-any', [{ id: userId }])
      );
      
      const querySnapshot = await getDocs(userGroupsQuery);
      
      const updatePromises = querySnapshot.docs.map(async (docSnap) => {
        const groupData = docSnap.data();
        const updatedMembers = groupData.members.map((member: GroupMember) => 
          member.id === userId ? { ...member, ...updates } : member
        );
        
        return updateDoc(doc(db, 'groups', docSnap.id), {
          members: updatedMembers,
          updatedAt: serverTimestamp()
        });
      });
      
      await Promise.all(updatePromises);
    } catch (error) {
      console.error('Error updating member info:', error);
    }
  }
}

export const groupService = new GroupService();