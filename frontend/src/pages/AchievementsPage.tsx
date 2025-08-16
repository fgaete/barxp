import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Trophy, Star, Lock, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { drinkService } from '../services/drinkService';
import { achievements, getUnlockedAchievements, getRarityColor, type Achievement } from '../data/achievements';

// Interfaz para bebidas del usuario
interface UserDrink {
  category: string;
  drinkName: string;
  timestamp: Date;
}

type DrinkServiceStats = {
  totalXP: number;
  level: number;
  totalDrinks: number;
  uniqueDrinks: number;
  favoriteCategory: string;
  currentStreak: number;
  lastDrinkDate: Date;
};

const AchievementsPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [userStats, setUserStats] = useState<DrinkServiceStats | null>(null);
  const [userDrinks, setUserDrinks] = useState<UserDrink[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    const loadUserStats = async () => {
      if (currentUser) {
        try {
          const stats = await drinkService.getUserStats(currentUser.id);
           const drinks = await drinkService.getUserDrinks(currentUser.id);
          setUserStats(stats);
          setUserDrinks(drinks);
        } catch (error) {
          console.error('Error al cargar estadísticas:', error);
        }
      }
      setLoading(false);
    };

    loadUserStats();
  }, [currentUser]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center">
        <div className="text-center">
          <Trophy className="w-12 h-12 text-amber-600 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Cargando logros...</p>
        </div>
      </div>
    );
  }

  const unlockedAchievements = userStats ? getUnlockedAchievements(userStats, userDrinks) : [];
  const unlockedIds = unlockedAchievements.map(a => a.id);
  
  const categories = [
    { id: 'all', name: 'Todos', icon: '🏆' },
    { id: 'drinks', name: 'Bebidas', icon: '🍺' },
    { id: 'xp', name: 'Experiencia', icon: '⭐' },
    { id: 'exploration', name: 'Exploración', icon: '🌟' },
    { id: 'temporal', name: 'Temporales', icon: '⏰' },
    { id: 'special', name: 'Especiales', icon: '🎯' }
  ];

  const filteredAchievements = selectedCategory === 'all' 
    ? achievements 
    : achievements.filter(a => a.category === selectedCategory);

  const getProgressText = (achievement: Achievement, stats: DrinkServiceStats | null) => {
    if (!stats) return '';
    
    const { requirement } = achievement;
    let current = 0;
    
    switch (requirement.type) {
      case 'drinks_count':
        current = stats.totalDrinks;
        break;
      case 'xp_total':
        current = stats.totalXP;
        break;
      case 'level':
        current = stats.level;
        break;
      case 'unique_drinks':
        current = stats.uniqueDrinks;
        break;
      case 'streak':
        current = stats.currentStreak;
        break;
      case 'category_drinks':
        if (requirement.category) {
          current = userDrinks.filter(drink => drink.category === requirement.category).length;
        }
        break;
      case 'specific_drink':
        if (requirement.drinkName) {
          current = userDrinks.filter(drink => drink.drinkName === requirement.drinkName).length;
        }
        break;
      case 'daily_drinks':
      case 'monthly_drinks':
      case 'yearly_drinks':
        return 'Próximamente';
      default:
        return '';
    }
    
    return `${Math.min(current, requirement.value)}/${requirement.value}`;
  };

  const getProgressPercentage = (achievement: Achievement, stats: DrinkServiceStats | null) => {
    if (!stats) return 0;
    
    const { requirement } = achievement;
    let current = 0;
    
    switch (requirement.type) {
      case 'drinks_count':
        current = stats.totalDrinks;
        break;
      case 'xp_total':
        current = stats.totalXP;
        break;
      case 'level':
        current = stats.level;
        break;
      case 'unique_drinks':
        current = stats.uniqueDrinks;
        break;
      case 'streak':
        current = stats.currentStreak;
        break;
      case 'category_drinks':
        if (requirement.category) {
          current = userDrinks.filter(drink => drink.category === requirement.category).length;
        }
        break;
      case 'specific_drink':
        if (requirement.drinkName) {
          current = userDrinks.filter(drink => drink.drinkName === requirement.drinkName).length;
        }
        break;
      case 'daily_drinks':
      case 'monthly_drinks':
      case 'yearly_drinks':
        return 0;
      default:
        return 0;
    }
    
    return Math.min((current / requirement.value) * 100, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link 
              to="/" 
              className="p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Logros</h1>
              <p className="text-gray-600">
                {unlockedAchievements.length} de {achievements.length} desbloqueados
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="bg-white rounded-lg px-4 py-2 shadow-md">
              <div className="text-2xl font-bold text-amber-600">
                {unlockedAchievements.reduce((total, a) => total + a.xpReward, 0)}
              </div>
              <div className="text-sm text-gray-600">XP de logros</div>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex space-x-2 mb-8 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                selectedCategory === category.id
                  ? 'bg-amber-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-amber-50'
              }`}
            >
              <span>{category.icon}</span>
              <span className="font-medium">{category.name}</span>
            </button>
          ))}
        </div>

        {/* Achievements Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredAchievements.map((achievement) => {
            const isUnlocked = unlockedIds.includes(achievement.id);
            const progress = getProgressPercentage(achievement, userStats);
            const progressText = getProgressText(achievement, userStats);
            
            return (
              <div
                key={achievement.id}
                className={`bg-white rounded-xl p-6 shadow-md border-2 transition-all hover:shadow-lg ${
                  isUnlocked 
                    ? 'border-amber-200 bg-gradient-to-br from-white to-amber-50' 
                    : 'border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`text-4xl ${isUnlocked ? '' : 'grayscale opacity-50'}`}>
                    {achievement.icon}
                  </div>
                  <div className="flex items-center space-x-2">
                    {isUnlocked ? (
                      <Trophy className="w-5 h-5 text-amber-600" />
                    ) : (
                      <Lock className="w-5 h-5 text-gray-400" />
                    )}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRarityColor(achievement.rarity)}`}>
                      {achievement.rarity}
                    </span>
                  </div>
                </div>
                
                <h3 className={`font-bold text-lg mb-2 ${
                  isUnlocked ? 'text-gray-900' : 'text-gray-600'
                }`}>
                  {achievement.name}
                </h3>
                
                <p className={`text-sm mb-4 ${
                  isUnlocked ? 'text-gray-700' : 'text-gray-500'
                }`}>
                  {achievement.description}
                </p>
                
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-1">
                    <Star className={`w-4 h-4 ${
                      isUnlocked ? 'text-yellow-500' : 'text-gray-400'
                    }`} />
                    <span className={`text-sm font-medium ${
                      isUnlocked ? 'text-yellow-600' : 'text-gray-500'
                    }`}>
                      +{achievement.xpReward} XP
                    </span>
                  </div>
                  {!isUnlocked && progressText && (
                    <span className="text-sm text-gray-500">
                      {progressText}
                    </span>
                  )}
                </div>
                
                {!isUnlocked && (
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-amber-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {filteredAchievements.length === 0 && (
          <div className="text-center py-12">
            <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No hay logros en esta categoría.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AchievementsPage;