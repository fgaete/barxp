import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc,
  setDoc,
  getDoc,
  deleteDoc,
  query, 
  where, 
  serverTimestamp,
  increment,
  FieldValue
} from 'firebase/firestore';
import { db } from './firebase';
import type { User } from '../types';
import { getUnlockedAchievements } from '../data/achievements';

export interface DrinkEntry {
  id?: string;
  userId: string;
  drinkName: string;
  category: string;
  alcoholContent: number;
  xpReward: number;
  difficulty: string;
  image: string;
  description: string;
  timestamp: Date;
  location?: string;
  notes?: string;
}

// Interfaz interna para estadísticas del servicio
interface DrinkServiceStats {
  totalXP: number;
  level: number;
  totalDrinks: number;
  uniqueDrinks: number;
  favoriteCategory: string;
  currentStreak: number;
  lastDrinkDate: Date;
}

class DrinkService {
  // Agregar una bebida al registro del usuario
  async addDrink(userId: string, drink: Omit<DrinkEntry, 'id' | 'userId' | 'timestamp'>, customDate?: Date): Promise<string> {
    try {
      console.log('🔄 DrinkService.addDrink - Iniciando proceso:', { userId, drinkName: drink.drinkName });
      
      // Obtener estadísticas actuales antes de agregar la bebida
      console.log('📊 Obteniendo estadísticas actuales del usuario...');
      const currentStats = await this.getUserStats(userId);
      console.log('📊 Estadísticas obtenidas:', currentStats);
      
      const previousAchievements = getUnlockedAchievements(currentStats);
      console.log('🏆 Logros previos:', previousAchievements.length);

      // Usar fecha personalizada o fecha actual
      const drinkTimestamp = customDate || new Date();
      
      // Crear entrada de bebida
      const drinkEntry: Omit<DrinkEntry, 'id'> = {
        userId,
        ...drink,
        timestamp: drinkTimestamp
      };
      console.log('📝 Entrada de bebida creada:', drinkEntry);

      // Guardar en la colección de drinks
      console.log('💾 Guardando bebida en Firestore...');
      const docRef = await addDoc(collection(db, 'drinks'), {
        ...drinkEntry,
        timestamp: customDate ? drinkTimestamp : serverTimestamp()
      });
      console.log('✅ Bebida guardada con ID:', docRef.id);

      // Actualizar estadísticas del usuario
      console.log('📈 Actualizando estadísticas del usuario...');
      await this.updateUserStats(userId, drink.xpReward);
      console.log('✅ Estadísticas actualizadas');

      // Verificar nuevos logros desbloqueados
      console.log('🏆 Verificando nuevos logros...');
      const newStats = await this.getUserStats(userId);
      const newAchievements = getUnlockedAchievements(newStats);
      const unlockedAchievements = newAchievements.filter(
        newAch => !previousAchievements.some(prevAch => prevAch.id === newAch.id)
      );
      
      if (unlockedAchievements.length > 0) {
        console.log('🎉 Nuevos logros desbloqueados:', unlockedAchievements.map(a => a.name));
      }

      console.log('✅ Proceso completado exitosamente');
      return docRef.id;
    } catch (error) {
      console.error('❌ Error detallado en addDrink:', {
        error,
        message: error instanceof Error ? error.message : 'Error desconocido',
        stack: error instanceof Error ? error.stack : undefined,
        userId,
        drinkName: drink.drinkName
      });
      throw new Error('No se pudo agregar la bebida');
    }
  }

  // Otorgar XP por invitaciones de grupo
  async grantInvitationXP(userId: string, memberCount: number): Promise<number> {
    try {
      // Calcular XP basado en el número de miembros
      let xpReward = 0;
      if (memberCount === 1) xpReward = 10;
      else if (memberCount === 10) xpReward = 100;
      else if (memberCount === 100) xpReward = 1000;
      else if (memberCount >= 1000) xpReward = 100000;
      else {
        // Escala progresiva para otros números
        if (memberCount < 10) xpReward = 10;
        else if (memberCount < 100) xpReward = 100;
        else if (memberCount < 1000) xpReward = 1000;
        else xpReward = 100000;
      }

      console.log(`🎉 Otorgando ${xpReward} XP por invitación (${memberCount} miembros)`);
      
      // Actualizar estadísticas sin incrementar contador de bebidas
      await this.updateUserStats(userId, xpReward, false);
      
      return xpReward;
    } catch (error) {
      console.error('❌ Error al otorgar XP por invitación:', error);
      throw error;
    }
  }

  // Actualizar estadísticas del usuario
  private async updateUserStats(userId: string, xpGained: number, incrementDrinkCount: boolean = true): Promise<void> {
    try {
      console.log('📊 updateUserStats - Iniciando:', { userId, xpGained, incrementDrinkCount });
      
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        console.log('👤 Usuario no existe, creando documento inicial...');
        await setDoc(userRef, {
          id: userId,
          totalXP: xpGained,
          totalDrinks: incrementDrinkCount ? 1 : 0,
          level: this.calculateLevel(xpGained),
          lastDrinkDate: new Date(),
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        console.log('✅ Documento de usuario creado');
      } else {
        console.log('👤 Usuario existe, actualizando estadísticas...');
        const updateData: {
          totalXP: FieldValue;
          updatedAt: FieldValue;
          totalDrinks?: FieldValue;
          lastDrinkDate?: Date;
        } = {
          totalXP: increment(xpGained),
          updatedAt: serverTimestamp()
        };
        
        if (incrementDrinkCount) {
          updateData.totalDrinks = increment(1);
          updateData.lastDrinkDate = new Date();
        }
        
        await updateDoc(userRef, updateData);
        console.log('✅ Estadísticas actualizadas');
        
        // Actualizar nivel
        await this.updateUserLevel(userId);
      }
    } catch (error) {
      console.error('❌ Error al actualizar estadísticas:', error);
      throw error;
    }
  }

  // Actualizar nivel del usuario basado en XP total
  private async updateUserLevel(userId: string): Promise<void> {
    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const totalXP = userData.totalXP || 0;
        const newLevel = this.calculateLevel(totalXP);
        
        await updateDoc(userRef, {
          level: newLevel,
          updatedAt: serverTimestamp()
        });
      }
    } catch (error) {
      console.error('❌ Error al actualizar nivel:', error);
      throw error;
    }
  }

  // Calcular nivel basado en XP total
  private calculateLevel(totalXP: number): number {
    if (totalXP < 100) return 1;
    if (totalXP < 300) return 2;
    if (totalXP < 600) return 3;
    if (totalXP < 1000) return 4;
    
    // Nivel 5+ = cada 1000 XP adicionales
    return Math.floor((totalXP - 1000) / 1000) + 5;
  }

  // Obtener estadísticas del usuario recalculadas desde las bebidas reales
  async getUserStats(userId: string): Promise<DrinkServiceStats> {
    try {
      console.log('📊 getUserStats - Iniciando para userId:', userId);
      
      // Obtener bebidas del usuario para calcular estadísticas reales
      console.log('🍺 Obteniendo bebidas del usuario...');
      const drinksQuery = query(
        collection(db, 'drinks'),
        where('userId', '==', userId)
      );
      console.log('🔍 Ejecutando query de bebidas...');
      const drinksSnapshot = await getDocs(drinksQuery);
      console.log('🍺 Bebidas obtenidas:', drinksSnapshot.size, 'documentos');
      
      const drinks = drinksSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate() || new Date()
      })) as DrinkEntry[];

      // Calcular estadísticas basadas en bebidas reales
      const totalXP = drinks.reduce((sum, drink) => sum + drink.xpReward, 0);
      const totalDrinks = drinks.length;
      const uniqueDrinkNames = new Set(drinks.map(drink => drink.drinkName));
      const uniqueDrinks = uniqueDrinkNames.size;
      
      // Calcular categoría favorita
      const categoryCount: Record<string, number> = {};
      drinks.forEach(drink => {
        categoryCount[drink.category] = (categoryCount[drink.category] || 0) + 1;
      });
      
      const favoriteCategory = Object.keys(categoryCount).length > 0 
        ? Object.entries(categoryCount).sort(([,a], [,b]) => b - a)[0][0]
        : 'beer';
      
      const level = this.calculateLevel(totalXP);
      const lastDrinkDate = drinks.length > 0 
        ? new Date(Math.max(...drinks.map(d => d.timestamp.getTime())))
        : new Date();
      
      const userStats: DrinkServiceStats = {
        totalXP,
        level,
        totalDrinks,
        uniqueDrinks,
        favoriteCategory,
        currentStreak: 0,
        lastDrinkDate
      };

      // Sincronizar estadísticas del usuario con los datos reales
      console.log('🔄 Sincronizando estadísticas del usuario...');
      await this.syncUserStats(userId, userStats);
      
      console.log('✅ Estadísticas calculadas exitosamente:', userStats);
      return userStats;
    } catch (error) {
      console.error('❌ Error detallado en getUserStats:', {
        error,
        message: error instanceof Error ? error.message : 'Error desconocido',
        stack: error instanceof Error ? error.stack : undefined,
        userId
      });
      throw new Error('No se pudieron obtener las estadísticas');
    }
  }

  // Método para sincronizar estadísticas del usuario con los datos reales
  private async syncUserStats(userId: string, stats: DrinkServiceStats): Promise<void> {
    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        // Crear documento inicial si no existe
        await setDoc(userRef, {
          id: userId,
          totalXP: stats.totalXP,
          totalDrinks: stats.totalDrinks,
          level: stats.level,
          lastDrinkDate: stats.lastDrinkDate,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      } else {
        // Actualizar estadísticas existentes
        await updateDoc(userRef, {
          totalXP: stats.totalXP,
          totalDrinks: stats.totalDrinks,
          level: stats.level,
          lastDrinkDate: stats.lastDrinkDate,
          updatedAt: serverTimestamp()
        });
      }
      
      console.log('✅ Estadísticas sincronizadas en Firestore');
    } catch (error) {
      console.error('❌ Error al sincronizar estadísticas:', error);
      throw error;
    }
  }

  // Obtener historial de bebidas del usuario
  async getUserDrinks(userId: string): Promise<DrinkEntry[]> {
    try {
      console.log('🔍 getUserDrinks - Buscando bebidas para usuario:', userId);
      
      const drinksQuery = query(
        collection(db, 'drinks'),
        where('userId', '==', userId)
      );
      
      const snapshot = await getDocs(drinksQuery);
      console.log('📊 getUserDrinks - Documentos encontrados:', snapshot.docs.length);
      
      const drinks = snapshot.docs.map(doc => {
        const data = doc.data();
        console.log('📄 Documento:', { id: doc.id, data });
        return {
          id: doc.id,
          ...data,
          timestamp: data.timestamp?.toDate() || new Date()
        };
      }) as DrinkEntry[];
      
      // Ordenar por timestamp descendente
      drinks.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      
      console.log('✅ getUserDrinks - Bebidas procesadas:', drinks.length);
      return drinks;
    } catch (error) {
      console.error('❌ Error al obtener bebidas:', error);
      throw new Error('No se pudo obtener el historial de bebidas');
    }
  }

  // Inicializar usuario en la base de datos
  async initializeUser(user: User): Promise<void> {
    try {
      console.log('🔄 Inicializando usuario:', user.id);
      
      const userRef = doc(db, 'users', user.id);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        await setDoc(userRef, {
          id: user.id,
          email: user.email,
          displayName: user.displayName || '',
          photoURL: user.photoURL || '',
          totalXP: 0,
          totalDrinks: 0,
          level: 1,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        console.log('✅ Usuario inicializado en Firestore');
      } else {
        console.log('👤 Usuario ya existe en Firestore');
      }
    } catch (error) {
      console.error('❌ Error al inicializar usuario:', error);
      throw error;
    }
  }

  // Eliminar una bebida y actualizar estadísticas
  async deleteDrink(drinkId: string): Promise<void> {
    try {
      console.log('🗑️ DrinkService.deleteDrink - Iniciando eliminación:', drinkId);
      
      // Primero obtener la información de la bebida antes de eliminarla
      const drinkRef = doc(db, 'drinks', drinkId);
      const drinkDoc = await getDoc(drinkRef);
      
      if (!drinkDoc.exists()) {
        throw new Error('La bebida no existe');
      }
      
      const drinkData = drinkDoc.data() as DrinkEntry;
      console.log('📋 Datos de la bebida a eliminar:', {
        drinkName: drinkData.drinkName,
        xpReward: drinkData.xpReward,
        userId: drinkData.userId
      });
      
      // Eliminar la bebida
      console.log('🗑️ Eliminando bebida de Firestore...');
      await deleteDoc(drinkRef);
      console.log('✅ Bebida eliminada de Firestore');
      
      // Actualizar las estadísticas del usuario (restar XP y contador de bebidas)
      console.log('📉 Actualizando estadísticas del usuario (restando XP y bebidas)...');
      await this.updateUserStatsOnDelete(drinkData.userId, drinkData.xpReward);
      
      console.log('✅ Bebida eliminada y estadísticas actualizadas:', drinkId);
    } catch (error) {
      console.error('❌ Error al eliminar bebida:', error);
      throw error;
    }
  }
  
  // Método para actualizar estadísticas cuando se elimina una bebida
  private async updateUserStatsOnDelete(userId: string, xpToSubtract: number): Promise<void> {
    try {
      console.log('📉 updateUserStatsOnDelete - Iniciando:', { userId, xpToSubtract });
      
      const userRef = doc(db, 'users', userId);
      
      // Verificar si el documento existe
      const userDoc = await getDoc(userRef);
      console.log('👤 Documento de usuario existe:', userDoc.exists());
      
      if (userDoc.exists()) {
        const currentData = userDoc.data();
        console.log('📊 Estadísticas actuales antes de eliminar:', {
          totalXP: currentData.totalXP || 0,
          totalDrinks: currentData.totalDrinks || 0,
          level: currentData.level || 1
        });
        
        // Actualizar estadísticas restando XP y decrementando contador de bebidas
        console.log('🔄 Aplicando decrementos:', {
          xpDecrement: -xpToSubtract,
          drinksDecrement: -1
        });
        
        await updateDoc(userRef, {
          totalXP: increment(-xpToSubtract),
          totalDrinks: increment(-1),
          updatedAt: serverTimestamp()
        });
        console.log('✅ Estadísticas actualizadas en Firestore');
        
        // Recalcular nivel basado en el nuevo XP
        console.log('🎯 Recalculando nivel del usuario...');
        await this.updateUserLevel(userId);
        console.log('✅ Nivel recalculado');
      } else {
        console.log('⚠️ Documento de usuario no existe, no se pueden actualizar estadísticas');
      }
    } catch (error) {
      console.error('❌ Error al actualizar estadísticas en eliminación:', error);
      throw error;
    }
  }
}

export const drinkService = new DrinkService();
export default drinkService;