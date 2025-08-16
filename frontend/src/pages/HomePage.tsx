import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Plus, Trophy, TrendingUp, Calendar, Users, Star, History } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { LevelInfo } from '../types';
import { calculateLevelInfo } from '../utils/levelSystem';
import { drinkService } from '../services/drinkService';
import { getUnlockedAchievements, getNextAchievement, getRarityColor } from '../data/achievements';

// Tipo para las estadísticas del servicio de bebidas
type DrinkServiceStats = {
  totalXP: number;
  level: number;
  totalDrinks: number;
  uniqueDrinks: number;
  favoriteCategory: string;
  currentStreak: number;
  lastDrinkDate: Date;
};

const HomePage: React.FC = () => {
  const { currentUser } = useAuth();
  const [userStats, setUserStats] = useState<DrinkServiceStats | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const initializeUserAndLoadStats = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }
      
      try {
        // Inicializar usuario si es necesario
        await drinkService.initializeUser(currentUser);
        
        // Cargar estadísticas del usuario
        const stats = await drinkService.getUserStats(currentUser.id);
        setUserStats(stats);
      } catch (error) {
        console.error('Error al cargar estadísticas del usuario:', error);
      } finally {
        setLoading(false);
      }
    };
    
    initializeUserAndLoadStats();
  }, [currentUser]);
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  const totalXP = userStats?.totalXP || currentUser?.totalXP || 0;
  const levelInfo: LevelInfo = calculateLevelInfo(totalXP);
  const progressPercentage = levelInfo.xpToNextLevel > 0 ? (levelInfo.currentXP / (levelInfo.currentXP + levelInfo.xpToNextLevel)) * 100 : 100;

  const quickActions = [
    {
      title: 'Agregar Trago',
      description: 'Registra tu última bebida',
      icon: Plus,
      color: 'bg-green-500',
      link: '/add-drink'
    },
    {
      title: 'Historial',
      description: 'Ver bebidas por día',
      icon: History,
      color: 'bg-amber-500',
      link: '/history'
    },
    {
      title: 'Ver Grupos',
      description: 'Compite con amigos',
      icon: Users,
      color: 'bg-blue-500',
      link: '/groups'
    },
    {
      title: 'Eventos',
      description: 'Próximas salidas',
      icon: Calendar,
      color: 'bg-purple-500',
      link: '/events'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-display font-bold text-gray-900">
                ¡Hola, {currentUser?.displayName?.split(' ')[0] || 'Amigo'}!
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                Listo para tu próxima aventura
              </p>
            </div>
            
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary-200">
              {currentUser?.photoURL ? (
                <img 
                  src={currentUser.photoURL} 
                  alt="Avatar" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">
                    {currentUser?.displayName?.charAt(0) || 'U'}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Nivel y XP */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Nivel {levelInfo.level}
                </h2>
                <p className="text-gray-600 text-sm">
                  {levelInfo.title}
                </p>
              </div>
            </div>
            
            <div className="text-right">
              <p className="text-2xl font-bold text-primary-600">
                {totalXP.toLocaleString()}
              </p>
              <p className="text-gray-500 text-sm">XP Total</p>
            </div>
          </div>
          
          {/* Barra de progreso */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>{levelInfo.currentXP} XP</span>
              <span>{levelInfo.currentXP + levelInfo.xpToNextLevel} XP</span>
            </div>
            <div className="xp-bar">
              <div 
                className="xp-progress" 
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <p className="text-center text-sm text-gray-500">
              {levelInfo.xpToNextLevel} XP para nivel {levelInfo.level + 1}
            </p>
          </div>
        </div>

        {/* Estadísticas rápidas */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {userStats?.totalDrinks || 0}
                </p>
                <p className="text-gray-600 text-sm">Total</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Calendar className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {userStats?.level || 1}
                </p>
                <p className="text-gray-600 text-sm">Nivel</p>
              </div>
            </div>
          </div>
        </div>

        {/* Acciones rápidas */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900">Acciones Rápidas</h3>
          
          <div className="space-y-3">
            {quickActions.map((action, index) => {
              const IconComponent = action.icon;
              return (
                <Link
                  key={index}
                  to={action.link}
                  className="block bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 ${action.color} rounded-full flex items-center justify-center`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">
                        {action.title}
                      </h4>
                      <p className="text-gray-600 text-sm">
                        {action.description}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Logros recientes */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Logros</h3>
            <Link 
              to="/achievements" 
              className="text-amber-600 hover:text-amber-700 text-sm font-medium"
            >
              Ver todos
            </Link>
          </div>
          
          <div className="space-y-2">
            {userStats ? (() => {
              const unlockedAchievements = getUnlockedAchievements(userStats);
              const nextAchievement = getNextAchievement(userStats);
              
              if (unlockedAchievements.length === 0) {
                return (
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-center">
                    <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600">
                      ¡Registra tu primera bebida para desbloquear logros!
                    </p>
                    {nextAchievement && (
                      <div className="mt-4 p-3 bg-white rounded-lg border">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{nextAchievement.icon}</span>
                          <div className="text-left">
                            <p className="font-medium text-sm">{nextAchievement.name}</p>
                            <p className="text-xs text-gray-600">{nextAchievement.description}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              }
              
              return (
                <>
                  {/* Logros desbloqueados recientes (últimos 3) */}
                  {unlockedAchievements.slice(-3).reverse().map((achievement) => (
                    <div key={achievement.id} className="bg-white border border-gray-200 rounded-xl p-4">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">{achievement.icon}</div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-semibold text-gray-900">{achievement.name}</h4>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRarityColor(achievement.rarity)}`}>
                              {achievement.rarity}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">{achievement.description}</p>
                          <div className="flex items-center space-x-1 mt-1">
                            <Star className="w-3 h-3 text-yellow-500" />
                            <span className="text-xs text-yellow-600">+{achievement.xpReward} XP</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Próximo logro */}
                  {nextAchievement && (
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl opacity-50">{nextAchievement.icon}</div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-semibold text-gray-700">Próximo: {nextAchievement.name}</h4>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRarityColor(nextAchievement.rarity)} opacity-75`}>
                              {nextAchievement.rarity}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">{nextAchievement.description}</p>
                          <div className="flex items-center space-x-1 mt-1">
                            <Star className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-500">+{nextAchievement.xpReward} XP</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              );
            })() : (
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-center">
                <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">Cargando logros...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;