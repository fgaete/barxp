// Interfaz para estadísticas del usuario (compatible con drinkService)
type DrinkServiceStats = {
  totalXP: number;
  level: number;
  totalDrinks: number;
  uniqueDrinks: number;
  favoriteCategory: string;
  currentStreak: number;
  lastDrinkDate: Date;
};

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'drinks' | 'xp' | 'social' | 'exploration' | 'special' | 'temporal';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  xpReward: number;
  requirement: {
    type: 'drinks_count' | 'xp_total' | 'category_drinks' | 'streak' | 'level' | 'unique_drinks' | 'specific_drink' | 'daily_drinks' | 'monthly_drinks' | 'yearly_drinks';
    value: number;
    category?: string;
    drinkName?: string;
    timeframe?: 'day' | 'month' | 'year';
  };
  unlockedAt?: Date;
}

// Definición de logros disponibles
export const achievements: Achievement[] = [
  // === LOGROS BÁSICOS DE BEBIDAS ===
  {
    id: 'first_drink',
    name: 'Primera Gota',
    description: 'Registra tu primera bebida',
    icon: '🍺',
    category: 'drinks',
    rarity: 'common',
    xpReward: 50,
    requirement: {
      type: 'drinks_count',
      value: 1
    }
  },
  {
    id: 'five_drinks',
    name: 'Explorador Novato',
    description: 'Registra 5 bebidas',
    icon: '🌟',
    category: 'drinks',
    rarity: 'common',
    xpReward: 100,
    requirement: {
      type: 'drinks_count',
      value: 5
    }
  },
  {
    id: 'ten_drinks',
    name: 'Conocedor',
    description: 'Registra 10 bebidas',
    icon: '🏆',
    category: 'drinks',
    rarity: 'common',
    xpReward: 150,
    requirement: {
      type: 'drinks_count',
      value: 10
    }
  },
  {
    id: 'twenty_five_drinks',
    name: 'Catador Experimentado',
    description: 'Registra 25 bebidas',
    icon: '🥉',
    category: 'drinks',
    rarity: 'rare',
    xpReward: 300,
    requirement: {
      type: 'drinks_count',
      value: 25
    }
  },
  {
    id: 'fifty_drinks',
    name: 'Experto Catador',
    description: 'Registra 50 bebidas',
    icon: '🥈',
    category: 'drinks',
    rarity: 'rare',
    xpReward: 500,
    requirement: {
      type: 'drinks_count',
      value: 50
    }
  },
  {
    id: 'hundred_drinks',
    name: 'Maestro Degustador',
    description: 'Registra 100 bebidas',
    icon: '🥇',
    category: 'drinks',
    rarity: 'epic',
    xpReward: 1000,
    requirement: {
      type: 'drinks_count',
      value: 100
    }
  },
  {
    id: 'two_hundred_drinks',
    name: 'Leyenda Viviente',
    description: 'Registra 200 bebidas',
    icon: '👑',
    category: 'drinks',
    rarity: 'legendary',
    xpReward: 2000,
    requirement: {
      type: 'drinks_count',
      value: 200
    }
  },

  // === LOGROS DE NIVEL Y XP ===
  {
    id: 'first_level',
    name: 'Subiendo de Nivel',
    description: 'Alcanza el nivel 2',
    icon: '⭐',
    category: 'xp',
    rarity: 'common',
    xpReward: 75,
    requirement: {
      type: 'level',
      value: 2
    }
  },
  {
    id: 'level_three',
    name: 'Progresando',
    description: 'Alcanza el nivel 3',
    icon: '🌟',
    category: 'xp',
    rarity: 'common',
    xpReward: 100,
    requirement: {
      type: 'level',
      value: 3
    }
  },
  {
    id: 'level_five',
    name: 'Experimentado',
    description: 'Alcanza el nivel 5',
    icon: '🎖️',
    category: 'xp',
    rarity: 'rare',
    xpReward: 200,
    requirement: {
      type: 'level',
      value: 5
    }
  },
  {
    id: 'level_ten',
    name: 'Veterano',
    description: 'Alcanza el nivel 10',
    icon: '🏅',
    category: 'xp',
    rarity: 'epic',
    xpReward: 500,
    requirement: {
      type: 'level',
      value: 10
    }
  },
  {
    id: 'level_twenty',
    name: 'Maestro Supremo',
    description: 'Alcanza el nivel 20',
    icon: '👑',
    category: 'xp',
    rarity: 'legendary',
    xpReward: 1000,
    requirement: {
      type: 'level',
      value: 20
    }
  },
  {
    id: 'thousand_xp',
    name: 'Mil Puntos',
    description: 'Acumula 1000 XP',
    icon: '💎',
    category: 'xp',
    rarity: 'rare',
    xpReward: 300,
    requirement: {
      type: 'xp_total',
      value: 1000
    }
  },
  {
    id: 'five_thousand_xp',
    name: 'Cinco Mil Puntos',
    description: 'Acumula 5000 XP',
    icon: '💰',
    category: 'xp',
    rarity: 'epic',
    xpReward: 750,
    requirement: {
      type: 'xp_total',
      value: 5000
    }
  },
  {
    id: 'ten_thousand_xp',
    name: 'Diez Mil Puntos',
    description: 'Acumula 10000 XP',
    icon: '🏆',
    category: 'xp',
    rarity: 'legendary',
    xpReward: 1500,
    requirement: {
      type: 'xp_total',
      value: 10000
    }
  },

  // === LOGROS DE CERVEZAS ===
  {
    id: 'first_beer',
    name: 'Primera Cerveza',
    description: 'Registra tu primera cerveza',
    icon: '🍺',
    category: 'exploration',
    rarity: 'common',
    xpReward: 75,
    requirement: {
      type: 'category_drinks',
      value: 1,
      category: 'beer'
    }
  },
  {
    id: 'beer_explorer',
    name: 'Explorador Cervecero',
    description: 'Registra 5 cervezas diferentes',
    icon: '🍻',
    category: 'exploration',
    rarity: 'common',
    xpReward: 150,
    requirement: {
      type: 'category_drinks',
      value: 5,
      category: 'beer'
    }
  },
  {
    id: 'beer_enthusiast',
    name: 'Entusiasta Cervecero',
    description: 'Registra 10 cervezas diferentes',
    icon: '🍺',
    category: 'exploration',
    rarity: 'rare',
    xpReward: 300,
    requirement: {
      type: 'category_drinks',
      value: 10,
      category: 'beer'
    }
  },
  {
    id: 'beer_expert',
    name: 'Experto Cervecero',
    description: 'Registra 50 cervezas diferentes',
    icon: '🏆',
    category: 'exploration',
    rarity: 'epic',
    xpReward: 750,
    requirement: {
      type: 'category_drinks',
      value: 50,
      category: 'beer'
    }
  },
  {
    id: 'beer_master',
    name: 'Maestro Cervecero',
    description: 'Registra 100 cervezas diferentes',
    icon: '👑',
    category: 'exploration',
    rarity: 'legendary',
    xpReward: 1500,
    requirement: {
      type: 'category_drinks',
      value: 100,
      category: 'beer'
    }
  },

  // === LOGROS DE VINOS ===
  {
    id: 'first_wine',
    name: 'Primera Copa',
    description: 'Registra tu primer vino',
    icon: '🍷',
    category: 'exploration',
    rarity: 'common',
    xpReward: 75,
    requirement: {
      type: 'category_drinks',
      value: 1,
      category: 'wine'
    }
  },
  {
    id: 'wine_explorer',
    name: 'Explorador Vinícola',
    description: 'Registra 5 vinos diferentes',
    icon: '🍾',
    category: 'exploration',
    rarity: 'common',
    xpReward: 150,
    requirement: {
      type: 'category_drinks',
      value: 5,
      category: 'wine'
    }
  },
  {
    id: 'wine_connoisseur',
    name: 'Conocedor de Vinos',
    description: 'Registra 10 vinos diferentes',
    icon: '🍷',
    category: 'exploration',
    rarity: 'rare',
    xpReward: 300,
    requirement: {
      type: 'category_drinks',
      value: 10,
      category: 'wine'
    }
  },
  {
    id: 'wine_expert',
    name: 'Experto Enólogo',
    description: 'Registra 50 vinos diferentes',
    icon: '🏆',
    category: 'exploration',
    rarity: 'epic',
    xpReward: 750,
    requirement: {
      type: 'category_drinks',
      value: 50,
      category: 'wine'
    }
  },
  {
    id: 'wine_master',
    name: 'Maestro Sommelier',
    description: 'Registra 100 vinos diferentes',
    icon: '👑',
    category: 'exploration',
    rarity: 'legendary',
    xpReward: 1500,
    requirement: {
      type: 'category_drinks',
      value: 100,
      category: 'wine'
    }
  },

  // === LOGROS DE CÓCTELES ===
  {
    id: 'first_cocktail',
    name: 'Primer Cóctel',
    description: 'Registra tu primer cóctel',
    icon: '🍸',
    category: 'exploration',
    rarity: 'common',
    xpReward: 75,
    requirement: {
      type: 'category_drinks',
      value: 1,
      category: 'cocktail'
    }
  },
  {
    id: 'cocktail_explorer',
    name: 'Explorador de Cócteles',
    description: 'Registra 5 cócteles diferentes',
    icon: '🍹',
    category: 'exploration',
    rarity: 'common',
    xpReward: 150,
    requirement: {
      type: 'category_drinks',
      value: 5,
      category: 'cocktail'
    }
  },
  {
    id: 'cocktail_enthusiast',
    name: 'Entusiasta de Cócteles',
    description: 'Registra 10 cócteles diferentes',
    icon: '🍸',
    category: 'exploration',
    rarity: 'rare',
    xpReward: 300,
    requirement: {
      type: 'category_drinks',
      value: 10,
      category: 'cocktail'
    }
  },
  {
    id: 'cocktail_expert',
    name: 'Experto Coctelero',
    description: 'Registra 50 cócteles diferentes',
    icon: '🏆',
    category: 'exploration',
    rarity: 'epic',
    xpReward: 750,
    requirement: {
      type: 'category_drinks',
      value: 50,
      category: 'cocktail'
    }
  },
  {
    id: 'cocktail_master',
    name: 'Maestro Mixólogo',
    description: 'Registra 100 cócteles diferentes',
    icon: '👑',
    category: 'exploration',
    rarity: 'legendary',
    xpReward: 1500,
    requirement: {
      type: 'category_drinks',
      value: 100,
      category: 'cocktail'
    }
  },

  // === LOGROS DE DESTILADOS ===
  {
    id: 'first_spirit',
    name: 'Primer Destilado',
    description: 'Registra tu primer destilado',
    icon: '🥃',
    category: 'exploration',
    rarity: 'common',
    xpReward: 75,
    requirement: {
      type: 'category_drinks',
      value: 1,
      category: 'spirits'
    }
  },
  {
    id: 'spirits_explorer',
    name: 'Explorador de Destilados',
    description: 'Registra 5 destilados diferentes',
    icon: '🍾',
    category: 'exploration',
    rarity: 'common',
    xpReward: 150,
    requirement: {
      type: 'category_drinks',
      value: 5,
      category: 'spirits'
    }
  },
  {
    id: 'spirits_enthusiast',
    name: 'Entusiasta de Destilados',
    description: 'Registra 10 destilados diferentes',
    icon: '🥃',
    category: 'exploration',
    rarity: 'rare',
    xpReward: 300,
    requirement: {
      type: 'category_drinks',
      value: 10,
      category: 'spirits'
    }
  },
  {
    id: 'spirits_expert',
    name: 'Experto en Destilados',
    description: 'Registra 50 destilados diferentes',
    icon: '🏆',
    category: 'exploration',
    rarity: 'epic',
    xpReward: 750,
    requirement: {
      type: 'category_drinks',
      value: 50,
      category: 'spirits'
    }
  },
  {
    id: 'spirits_master',
    name: 'Maestro Destilador',
    description: 'Registra 100 destilados diferentes',
    icon: '👑',
    category: 'exploration',
    rarity: 'legendary',
    xpReward: 1500,
    requirement: {
      type: 'category_drinks',
      value: 100,
      category: 'spirits'
    }
  },

  // === LOGROS DE BEBIDAS ESPECÍFICAS CHILENAS ===
  {
    id: 'first_piscola',
    name: 'Primera Piscola',
    description: 'Registra tu primera piscola',
    icon: '🇨🇱',
    category: 'exploration',
    rarity: 'common',
    xpReward: 100,
    requirement: {
      type: 'specific_drink',
      value: 1,
      drinkName: 'Piscola'
    }
  },
  {
    id: 'piscola_lover',
    name: 'Amante de la Piscola',
    description: 'Registra 10 piscolas',
    icon: '🥤',
    category: 'exploration',
    rarity: 'rare',
    xpReward: 300,
    requirement: {
      type: 'specific_drink',
      value: 10,
      drinkName: 'Piscola'
    }
  },
  {
    id: 'first_sour',
    name: 'Primer Sour',
    description: 'Registra tu primer pisco sour',
    icon: '🍋',
    category: 'exploration',
    rarity: 'common',
    xpReward: 100,
    requirement: {
      type: 'specific_drink',
      value: 1,
      drinkName: 'Pisco Sour'
    }
  },
  {
    id: 'sour_enthusiast',
    name: 'Entusiasta del Sour',
    description: 'Registra 10 pisco sours',
    icon: '🍸',
    category: 'exploration',
    rarity: 'rare',
    xpReward: 300,
    requirement: {
      type: 'specific_drink',
      value: 10,
      drinkName: 'Pisco Sour'
    }
  },

  // === LOGROS TEMPORALES - DIARIOS ===
  {
    id: 'daily_explorer',
    name: 'Explorador Diario',
    description: 'Registra 3 bebidas en un día',
    icon: '☀️',
    category: 'temporal',
    rarity: 'common',
    xpReward: 150,
    requirement: {
      type: 'daily_drinks',
      value: 3,
      timeframe: 'day'
    }
  },
  {
    id: 'daily_champion',
    name: 'Campeón Diario',
    description: 'Registra 5 bebidas en un día',
    icon: '🌟',
    category: 'temporal',
    rarity: 'rare',
    xpReward: 300,
    requirement: {
      type: 'daily_drinks',
      value: 5,
      timeframe: 'day'
    }
  },
  {
    id: 'daily_legend',
    name: 'Leyenda Diaria',
    description: 'Registra 10 bebidas en un día',
    icon: '🔥',
    category: 'temporal',
    rarity: 'epic',
    xpReward: 500,
    requirement: {
      type: 'daily_drinks',
      value: 10,
      timeframe: 'day'
    }
  },

  // === LOGROS TEMPORALES - MENSUALES ===
  {
    id: 'monthly_explorer',
    name: 'Explorador Mensual',
    description: 'Registra 20 bebidas en un mes',
    icon: '📅',
    category: 'temporal',
    rarity: 'common',
    xpReward: 400,
    requirement: {
      type: 'monthly_drinks',
      value: 20,
      timeframe: 'month'
    }
  },
  {
    id: 'monthly_champion',
    name: 'Campeón Mensual',
    description: 'Registra 50 bebidas en un mes',
    icon: '🏆',
    category: 'temporal',
    rarity: 'rare',
    xpReward: 750,
    requirement: {
      type: 'monthly_drinks',
      value: 50,
      timeframe: 'month'
    }
  },
  {
    id: 'monthly_legend',
    name: 'Leyenda Mensual',
    description: 'Registra 100 bebidas en un mes',
    icon: '👑',
    category: 'temporal',
    rarity: 'epic',
    xpReward: 1200,
    requirement: {
      type: 'monthly_drinks',
      value: 100,
      timeframe: 'month'
    }
  },

  // === LOGROS TEMPORALES - ANUALES ===
  {
    id: 'yearly_explorer',
    name: 'Explorador Anual',
    description: 'Registra 200 bebidas en un año',
    icon: '🗓️',
    category: 'temporal',
    rarity: 'rare',
    xpReward: 1000,
    requirement: {
      type: 'yearly_drinks',
      value: 200,
      timeframe: 'year'
    }
  },
  {
    id: 'yearly_champion',
    name: 'Campeón Anual',
    description: 'Registra 500 bebidas en un año',
    icon: '🏅',
    category: 'temporal',
    rarity: 'epic',
    xpReward: 2000,
    requirement: {
      type: 'yearly_drinks',
      value: 500,
      timeframe: 'year'
    }
  },
  {
    id: 'yearly_legend',
    name: 'Leyenda Anual',
    description: 'Registra 1000 bebidas en un año',
    icon: '👑',
    category: 'temporal',
    rarity: 'legendary',
    xpReward: 5000,
    requirement: {
      type: 'yearly_drinks',
      value: 1000,
      timeframe: 'year'
    }
  },

  // === LOGROS DE RACHA ===
  {
    id: 'weekend_warrior',
    name: 'Guerrero del Fin de Semana',
    description: 'Mantén una racha de 3 días',
    icon: '🔥',
    category: 'special',
    rarity: 'common',
    xpReward: 200,
    requirement: {
      type: 'streak',
      value: 3
    }
  },
  {
    id: 'week_streak',
    name: 'Semana Completa',
    description: 'Mantén una racha de 7 días',
    icon: '🌟',
    category: 'special',
    rarity: 'rare',
    xpReward: 500,
    requirement: {
      type: 'streak',
      value: 7
    }
  },
  {
    id: 'month_streak',
    name: 'Mes Completo',
    description: 'Mantén una racha de 30 días',
    icon: '🏆',
    category: 'special',
    rarity: 'epic',
    xpReward: 1500,
    requirement: {
      type: 'streak',
      value: 30
    }
  },

  // === LOGROS DE VARIEDAD ===
  {
    id: 'variety_seeker',
    name: 'Buscador de Variedad',
    description: 'Prueba 15 bebidas únicas diferentes',
    icon: '🌈',
    category: 'exploration',
    rarity: 'rare',
    xpReward: 400,
    requirement: {
      type: 'unique_drinks',
      value: 15
    }
  },
  {
    id: 'variety_master',
    name: 'Maestro de la Variedad',
    description: 'Prueba 50 bebidas únicas diferentes',
    icon: '🎨',
    category: 'exploration',
    rarity: 'epic',
    xpReward: 1000,
    requirement: {
      type: 'unique_drinks',
      value: 50
    }
  },
  {
    id: 'variety_legend',
    name: 'Leyenda de la Variedad',
    description: 'Prueba 100 bebidas únicas diferentes',
    icon: '🌟',
    category: 'exploration',
    rarity: 'legendary',
    xpReward: 2500,
    requirement: {
      type: 'unique_drinks',
      value: 100
    }
  }
];

// Interfaz para bebidas del usuario
interface UserDrink {
  category: string;
  drinkName: string;
  timestamp: Date;
}

// Función para verificar si un logro está desbloqueado
export function checkAchievement(achievement: Achievement, stats: DrinkServiceStats, userDrinks?: UserDrink[]): boolean {
  const { requirement } = achievement;
  
  switch (requirement.type) {
    case 'drinks_count':
      return stats.totalDrinks >= requirement.value;
    case 'xp_total':
      return stats.totalXP >= requirement.value;
    case 'level':
      return stats.level >= requirement.value;
    case 'unique_drinks':
      return stats.uniqueDrinks >= requirement.value;
    case 'streak':
      return stats.currentStreak >= requirement.value;
    case 'category_drinks': {
      if (!userDrinks || !requirement.category) return false;
      const categoryCount = userDrinks.filter(drink => 
        drink.category === requirement.category
      ).length;
      return categoryCount >= requirement.value;
    }
    case 'specific_drink': {
      if (!userDrinks || !requirement.drinkName) return false;
      const specificDrinkCount = userDrinks.filter(drink => 
        drink.drinkName === requirement.drinkName
      ).length;
      return specificDrinkCount >= requirement.value;
    }
    case 'daily_drinks':
    case 'monthly_drinks':
    case 'yearly_drinks':
      // Estos logros requieren lógica temporal más compleja
      // Por ahora retornamos false, se implementará en el futuro
      return false;
    default:
      return false;
  }
}

// Función para obtener logros desbloqueados
export function getUnlockedAchievements(stats: DrinkServiceStats, userDrinks?: UserDrink[]): Achievement[] {
  return achievements.filter(achievement => checkAchievement(achievement, stats, userDrinks));
}

// Función para obtener el próximo logro a desbloquear
export function getNextAchievement(stats: DrinkServiceStats, userDrinks?: UserDrink[]): Achievement | null {
  const unlockedIds = getUnlockedAchievements(stats, userDrinks).map(a => a.id);
  const nextAchievements = achievements.filter(a => !unlockedIds.includes(a.id));
  
  // Ordenar por dificultad (valor requerido) y retornar el más cercano
  return nextAchievements.sort((a, b) => a.requirement.value - b.requirement.value)[0] || null;
}

// Función para obtener el color según la rareza
export function getRarityColor(rarity: Achievement['rarity']): string {
  switch (rarity) {
    case 'common':
      return 'text-gray-600 bg-gray-100';
    case 'rare':
      return 'text-blue-600 bg-blue-100';
    case 'epic':
      return 'text-purple-600 bg-purple-100';
    case 'legendary':
      return 'text-yellow-600 bg-yellow-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
}

// Función para obtener logros por categoría
export function getAchievementsByCategory(category: Achievement['category']): Achievement[] {
  return achievements.filter(achievement => achievement.category === category);
}

// Función para obtener logros por rareza
export function getAchievementsByRarity(rarity: Achievement['rarity']): Achievement[] {
  return achievements.filter(achievement => achievement.rarity === rarity);
}