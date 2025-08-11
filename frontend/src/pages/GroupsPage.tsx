import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Users, Plus, Trophy, Calendar, Crown, Star, UserPlus, X, Mail, Send } from 'lucide-react';
import { calculateLevelInfo } from '../utils/levelSystem';

interface GroupMember {
  id: number;
  name: string;
  level: number;
  xp: number;
  avatar: string | null;
  isOwner: boolean;
}

interface GroupActivity {
  user: string;
  action: string;
  time: string;
}

interface GroupEvent {
  id: number;
  name: string;
  date: Date;
  attendees: number;
}

interface UserGroup {
  id: number;
  name: string;
  description: string;
  memberCount: number;
  isOwner: boolean;
  members: GroupMember[];
  recentActivity: GroupActivity[];
  upcomingEvents: GroupEvent[];
}

const GroupsPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteMessage, setInviteMessage] = useState('');
  const [isInviting, setIsInviting] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDescription, setNewGroupDescription] = useState('');
  const [userGroups, setUserGroups] = useState<UserGroup[]>([]); // Estado local para grupos

  const handleCreateGroup = () => {
    if (newGroupName.trim() && currentUser) {
      // Crear nuevo grupo con el usuario actual como owner
      const newGroup: UserGroup = {
        id: Date.now(), // ID temporal
        name: newGroupName.trim(),
        description: newGroupDescription.trim() || 'Sin descripción',
        memberCount: 1,
        isOwner: true,
        members: [{
           id: 1,
           name: currentUser.displayName || 'Usuario',
           level: 1,
           xp: 0,
           avatar: currentUser.photoURL || null,
           isOwner: true
         }],
        recentActivity: [{
          user: currentUser.displayName || 'Usuario',
          action: 'creó el grupo',
          time: 'hace unos segundos'
        }],
        upcomingEvents: []
      };
      
      // Agregar el nuevo grupo a la lista
      setUserGroups(prev => [...prev, newGroup]);
      
      // Limpiar formulario y cerrar modal
      setNewGroupName('');
      setNewGroupDescription('');
      setShowCreateModal(false);
      
      // TODO: En producción, hacer llamada a la API
      console.log('Grupo creado:', newGroup);
    }
  };

  const handleInviteMember = (groupId: number) => {
    setSelectedGroupId(groupId);
    const selectedGroup = userGroups.find(g => g.id === groupId);
    setInviteMessage(
      `🎯 ¡Desafío BarXP Activado! 🍻\n\n` +
      `¡Hola! Te invito a unirte a nuestro grupo "${selectedGroup?.name}" en BarXP - la app que convierte cada trago en una aventura épica.\n\n` +
      `🏆 ¿Estás listo para el reto?\n` +
      `• Compite conmigo y otros ${selectedGroup?.memberCount || 0} miembros\n` +
      `• Gana XP por cada trago que registres\n` +
      `• Sube de nivel y desbloquea logros únicos\n` +
      `• Demuestra quién es el verdadero maestro de la vida nocturna\n\n` +
      `💪 Este no es solo un juego... es un estilo de vida.\n` +
      `¿Tienes lo que se necesita para llegar a la cima del ranking?\n\n` +
      `🔥 Acepta el desafío: ${window.location.origin}\n\n` +
      `¡Nos vemos en la batalla! 🥂\n` +
      `- ${currentUser?.displayName || 'Tu retador'}`
    );
    setShowInviteModal(true);
  };

  const handleSendInvite = async () => {
    if (!inviteEmail.trim() || !inviteMessage.trim()) return;
    
    setIsInviting(true);
    
    try {
      // Simular envío de correo (aquí se integraría con un servicio real como EmailJS)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Agregar actividad al grupo
      const selectedGroup = userGroups.find(g => g.id === selectedGroupId);
      if (selectedGroup) {
        setUserGroups(prev => prev.map(group => 
          group.id === selectedGroupId 
            ? {
                ...group,
                recentActivity: [
                  {
                    user: currentUser?.displayName || 'Usuario',
                    action: `invitó a ${inviteEmail}`,
                    time: 'ahora'
                  },
                  ...group.recentActivity
                ]
              }
            : group
        ));
      }
      
      alert('¡Invitación enviada con éxito! 🚀');
      setInviteEmail('');
      setInviteMessage('');
      setShowInviteModal(false);
      setSelectedGroupId(null);
    } catch {
       alert('Error al enviar la invitación. Inténtalo de nuevo.');
    } finally {
      setIsInviting(false);
    }
  };

  const getMemberRank = (members: GroupMember[], userId: number) => {
    const sortedMembers = [...members].sort((a, b) => b.xp - a.xp);
    return sortedMembers.findIndex(m => m.id === userId) + 1;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-display font-bold text-gray-900">
                Mis Grupos
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                Compite y socializa con amigos
              </p>
            </div>
            
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-primary-500 text-white p-3 rounded-full shadow-lg hover:bg-primary-600 transition-colors"
            >
              <Plus className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Crear grupo modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Crear Nuevo Grupo
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre del Grupo
                  </label>
                  <input
                    type="text"
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Ej: Los Cerveceros"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción (Opcional)
                  </label>
                  <textarea
                    value={newGroupDescription}
                    onChange={(e) => setNewGroupDescription(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Describe tu grupo..."
                    rows={3}
                  />
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCreateGroup}
                  disabled={!newGroupName.trim()}
                  className="flex-1 px-4 py-3 bg-primary-500 text-white rounded-xl hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Crear Grupo
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Lista de grupos */}
        {userGroups.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No tienes grupos aún
            </h3>
            <p className="text-gray-600 mb-6">
              Crea tu primer grupo o únete a uno existente
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-primary"
            >
              Crear Mi Primer Grupo
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {userGroups.map((group) => {
              const currentUserMember = group.members.find(m => m.name === currentUser?.displayName);
              const userRank = currentUserMember ? getMemberRank(group.members, currentUserMember.id) : null;
              
              return (
                <div key={group.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  {/* Header del grupo */}
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-xl font-bold text-gray-900">
                            {group.name}
                          </h3>
                          {group.isOwner && (
                            <Crown className="w-5 h-5 text-yellow-500" />
                          )}
                        </div>
                        
                        <p className="text-gray-600 mb-3">
                          {group.description}
                        </p>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Users className="w-4 h-4" />
                            <span>{group.memberCount} miembros</span>
                          </div>
                          
                          {userRank && (
                            <div className="flex items-center space-x-1">
                              <Trophy className="w-4 h-4" />
                              <span>#{userRank} en ranking</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <button 
                        onClick={() => handleInviteMember(group.id)}
                        className="p-2 text-gray-400 hover:text-primary-500 hover:bg-primary-50 rounded-lg transition-colors"
                      >
                        <UserPlus className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Top miembros */}
                  <div className="p-6 border-b border-gray-100">
                    <h4 className="font-semibold text-gray-900 mb-3">Top Miembros</h4>
                    <div className="space-y-2">
                      {group.members
                        .sort((a, b) => b.xp - a.xp)
                        .slice(0, 3)
                        .map((member, index) => {
                          const levelInfo = calculateLevelInfo(member.xp);
                          return (
                            <div key={member.id} className="flex items-center space-x-3">
                              <div className="flex items-center space-x-2">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                  index === 0 ? 'bg-yellow-100 text-yellow-700' :
                                  index === 1 ? 'bg-gray-100 text-gray-700' :
                                  'bg-orange-100 text-orange-700'
                                }`}>
                                  {index + 1}
                                </div>
                                
                                <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center">
                                  <span className="text-white font-bold text-sm">
                                    {member.name.charAt(0)}
                                  </span>
                                </div>
                              </div>
                              
                              <div className="flex-1">
                                <div className="flex items-center space-x-2">
                                  <span className="font-medium text-gray-900">
                                    {member.name}
                                  </span>
                                  {member.isOwner && (
                                    <Crown className="w-4 h-4 text-yellow-500" />
                                  )}
                                </div>
                                <div className="flex items-center space-x-2 text-sm text-gray-600">
                                  <span>Nivel {levelInfo.level}</span>
                                  <span>•</span>
                                  <span>{member.xp.toLocaleString()} XP</span>
                                </div>
                              </div>
                              
                              {index === 0 && (
                                <Star className="w-5 h-5 text-yellow-500" />
                              )}
                            </div>
                          );
                        })}
                    </div>
                  </div>
                  
                  {/* Actividad reciente */}
                  {group.recentActivity && group.recentActivity.length > 0 && (
                    <div className="p-6 border-b border-gray-100">
                      <h4 className="font-semibold text-gray-900 mb-3">Actividad Reciente</h4>
                      <div className="space-y-2">
                        {group.recentActivity.map((activity, index) => (
                          <div key={index} className="text-sm text-gray-600">
                            <span className="font-medium text-gray-900">
                              {activity.user}
                            </span>
                            {' '}{activity.action}
                            <span className="text-gray-500"> • hace {activity.time}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Próximos eventos */}
                  {group.upcomingEvents && group.upcomingEvents.length > 0 && (
                    <div className="p-6">
                      <h4 className="font-semibold text-gray-900 mb-3">Próximos Eventos</h4>
                      <div className="space-y-2">
                        {group.upcomingEvents.map((event) => (
                          <div key={event.id} className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                            <Calendar className="w-5 h-5 text-blue-600" />
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">
                                {event.name}
                              </p>
                              <p className="text-sm text-gray-600">
                                {event.date.toLocaleDateString('es-ES', { 
                                  weekday: 'long', 
                                  year: 'numeric', 
                                  month: 'long', 
                                  day: 'numeric' 
                                })}
                              </p>
                            </div>
                            <div className="text-sm text-blue-600 font-medium">
                              {event.attendees} asistirán
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Modal de invitación */}
        {showInviteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  Invitar Miembro
                </h2>
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email del invitado
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="amigo@ejemplo.com"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mensaje de invitación
                  </label>
                  <textarea
                    value={inviteMessage}
                    onChange={(e) => setInviteMessage(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                    rows={8}
                    placeholder="Escribe un mensaje personalizado..."
                  />
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                  disabled={isInviting}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSendInvite}
                  disabled={!inviteEmail.trim() || !inviteMessage.trim() || isInviting}
                  className="flex-1 px-4 py-3 bg-primary-500 text-white rounded-xl hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                >
                  {isInviting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Enviando...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Enviar Invitación</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupsPage;