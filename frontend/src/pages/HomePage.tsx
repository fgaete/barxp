import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Plus, Trophy, TrendingUp, Calendar, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { LevelInfo } from '../types';
import { calculateLevelInfo } from '../utils/levelSystem';

interface Achievement {
  id: number;
  name: string;
  icon: string;
  description?: string;
}

const HomePage: React.FC = () => {
  const { currentUser } = useAuth();
  
  // Usar datos reales del usuario autenticado
  const userStats = {
    totalXP: currentUser?.totalXP || 0,
    drinksToday: 0, // TODO: Obtener de la API
    weeklyGoal: 15, // TODO: Obtener de preferencias del usuario
    weeklyProgress: 0, // TODO: Obtener de la API
    recentAchievements: [] as Achievement[] // TODO: Obtener de la API
  };

  const levelInfo: LevelInfo = calculateLevelInfo(userStats.totalXP);
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
                {userStats.totalXP.toLocaleString()}
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
                  {userStats.drinksToday}
                </p>
                <p className="text-gray-600 text-sm">Hoy</p>
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
                  {userStats.weeklyProgress}/{userStats.weeklyGoal}
                </p>
                <p className="text-gray-600 text-sm">Esta semana</p>
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
          <h3 className="text-lg font-semibold text-gray-900">Logros Recientes</h3>
          
          <div className="space-y-2">
            {userStats.recentAchievements.length > 0 ? (
              userStats.recentAchievements.map((achievement) => (
                <div 
                  key={achievement.id}
                  className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-4"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{achievement.icon}</span>
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {achievement.name}
                      </h4>
                      <p className="text-gray-600 text-sm">
                        Desbloqueado hace poco
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-center">
                <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">
                  ¡Registra tu primera bebida para desbloquear logros!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;