import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Trophy, Star, Calendar, TrendingUp, Award, LogOut } from 'lucide-react';
import { calculateLevelInfo } from '../utils/levelSystem';
import type { LevelInfo } from '../types';

interface Achievement {
  id: number;
  name: string;
  description: string;
  icon: string;
  unlockedAt: Date | null;
  rarity: string;
}

const ProfilePage: React.FC = () => {
  const { currentUser, logout } = useAuth();
  
  // Usar datos reales del usuario autenticado
  const userStats = {
    totalXP: currentUser?.totalXP || 0,
    totalDrinks: 0, // TODO: Obtener de la API
    favoriteCategory: 'Sin datos', // TODO: Obtener de la API
    joinDate: currentUser?.createdAt || new Date(),
    achievements: [] as Achievement[], // TODO: Obtener de la API
    weeklyStats: {
      drinks: 0, // TODO: Obtener de la API
      xpGained: 0, // TODO: Obtener de la API
      newAchievements: 0 // TODO: Obtener de la API
    }
  };

  const levelInfo: LevelInfo = calculateLevelInfo(userStats.totalXP);
  const progressPercentage = levelInfo.xpToNextLevel > 0 ? (levelInfo.currentXP / (levelInfo.currentXP + levelInfo.xpToNextLevel)) * 100 : 100;
  
  const unlockedAchievements = userStats.achievements.filter(a => a.unlockedAt);
  const lockedAchievements = userStats.achievements.filter(a => !a.unlockedAt);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'border-gray-300 bg-gray-50';
      case 'uncommon': return 'border-green-300 bg-green-50';
      case 'rare': return 'border-blue-300 bg-blue-50';
      case 'epic': return 'border-purple-300 bg-purple-50';
      case 'legendary': return 'border-yellow-300 bg-yellow-50';
      default: return 'border-gray-300 bg-gray-50';
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50 pb-20">
      {/* Header con perfil */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="px-6 py-6">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-primary-200">
              {currentUser?.photoURL ? (
                <img 
                  src={currentUser.photoURL} 
                  alt="Avatar" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                  <span className="text-white font-bold text-2xl">
                    {currentUser?.displayName?.charAt(0) || 'U'}
                  </span>
                </div>
              )}
            </div>
            
            <div className="flex-1">
              <h1 className="text-2xl font-display font-bold text-gray-900">
                {currentUser?.displayName || 'Usuario'}
              </h1>
              <p className="text-gray-600">
                {currentUser?.email}
              </p>
              <div className="flex items-center space-x-2 mt-2">
                <div className="flex items-center space-x-1">
                  <Trophy className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm font-medium text-gray-700">
                    Nivel {levelInfo.level}
                  </span>
                </div>
                <span className="text-gray-400">•</span>
                <span className="text-sm text-gray-600">
                  {levelInfo.title}
                </span>
              </div>
            </div>
            
            <button
              onClick={handleLogout}
              className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Progreso de nivel */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Progreso de Nivel</h2>
            <span className="text-2xl">{levelInfo.badge}</span>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Nivel {levelInfo.level}</span>
              <span>Nivel {levelInfo.level + 1}</span>
            </div>
            
            <div className="xp-bar">
              <div 
                className="xp-progress" 
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-primary-600 font-medium">
                {levelInfo.currentXP} XP
              </span>
              <span className="text-gray-500">
                {levelInfo.xpToNextLevel} XP restantes
              </span>
            </div>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {userStats.totalDrinks}
                </p>
                <p className="text-gray-600 text-sm">Total Tragos</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Award className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {unlockedAchievements.length}
                </p>
                <p className="text-gray-600 text-sm">Logros</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <Star className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">
                  {userStats.favoriteCategory}
                </p>
                <p className="text-gray-600 text-sm">Favorito</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <Calendar className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">
                  {Math.floor((Date.now() - userStats.joinDate.getTime()) / (1000 * 60 * 60 * 24))}d
                </p>
                <p className="text-gray-600 text-sm">Miembro</p>
              </div>
            </div>
          </div>
        </div>

        {/* Logros desbloqueados */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900">
            Logros Desbloqueados ({unlockedAchievements.length})
          </h3>
          
          <div className="space-y-2">
            {unlockedAchievements.length > 0 ? (
              unlockedAchievements.map((achievement) => (
                <div 
                  key={achievement.id}
                  className={`p-4 rounded-xl border-2 ${getRarityColor(achievement.rarity)}`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{achievement.icon}</span>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">
                        {achievement.name}
                      </h4>
                      <p className="text-gray-600 text-sm">
                        {achievement.description}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500 capitalize">
                        {achievement.rarity}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center">
                <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Sin logros desbloqueados</h4>
                <p className="text-gray-600">
                  ¡Registra bebidas para comenzar a desbloquear logros!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Logros bloqueados */}
        {lockedAchievements.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900">
              Próximos Logros ({lockedAchievements.length})
            </h3>
            
            <div className="space-y-2">
              {lockedAchievements.length > 0 ? (
                lockedAchievements.map((achievement) => (
                  <div 
                    key={achievement.id}
                    className="p-4 rounded-xl border-2 border-gray-200 bg-gray-50 opacity-60"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl grayscale">{achievement.icon}</span>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-700">
                          {achievement.name}
                        </h4>
                        <p className="text-gray-500 text-sm">
                          {achievement.description}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-400 capitalize">
                          {achievement.rarity}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center">
                  <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Todos los logros desbloqueados</h4>
                  <p className="text-gray-600">
                    ¡Felicitaciones! Has completado todos los desafíos disponibles.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;