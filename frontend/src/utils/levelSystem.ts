import type { LevelInfo } from '../types';
import { LEVEL_TITLES } from '../types';

/**
 * Calcula la experiencia total requerida para alcanzar un nivel específico
 * Fórmula: Nivel 1->2 = 500 XP, cada nivel siguiente = anterior * 1.75
 */
export function calculateTotalXPForLevel(level: number): number {
  if (level <= 1) return 0;
  
  let totalXP = 0;
  let currentLevelXP = 500; // XP requerida para nivel 2
  
  for (let i = 2; i <= level; i++) {
    totalXP += currentLevelXP;
    currentLevelXP = Math.floor(currentLevelXP * 1.75);
  }
  
  return totalXP;
}

/**
 * Calcula la experiencia requerida para pasar de un nivel al siguiente
 */
export function calculateXPForNextLevel(currentLevel: number): number {
  if (currentLevel >= 999) return 0;
  
  if (currentLevel === 1) return 500;
  
  let levelXP = 500;
  for (let i = 2; i <= currentLevel; i++) {
    levelXP = Math.floor(levelXP * 1.75);
  }
  
  return levelXP;
}

/**
 * Determina el nivel actual basado en la experiencia total
 */
export function calculateLevelFromXP(totalXP: number): number {
  if (totalXP < 500) return 1;
  
  let level = 1;
  let accumulatedXP = 0;
  let currentLevelXP = 500;
  
  while (accumulatedXP + currentLevelXP <= totalXP && level < 999) {
    accumulatedXP += currentLevelXP;
    level++;
    currentLevelXP = Math.floor(currentLevelXP * 1.75);
  }
  
  return level;
}

/**
 * Calcula la información completa del nivel para un usuario
 */
export function calculateLevelInfo(totalXP: number): LevelInfo {
  const level = calculateLevelFromXP(totalXP);
  const totalXPForCurrentLevel = calculateTotalXPForLevel(level);
  const totalXPForNextLevel = calculateTotalXPForLevel(level + 1);
  const currentXP = totalXP - totalXPForCurrentLevel;
  const xpToNextLevel = level >= 999 ? 0 : totalXPForNextLevel - totalXP;
  
  return {
    level,
    currentXP,
    xpToNextLevel,
    totalXPRequired: level >= 999 ? totalXPForCurrentLevel : totalXPForNextLevel,
    title: getLevelTitle(level),
    badge: getLevelBadge(level)
  };
}

/**
 * Obtiene el título correspondiente al nivel
 */
export function getLevelTitle(level: number): string {
  const titleLevels = Object.keys(LEVEL_TITLES)
    .map(Number)
    .sort((a, b) => b - a); // Ordenar de mayor a menor
  
  for (const titleLevel of titleLevels) {
    if (level >= titleLevel) {
      return LEVEL_TITLES[titleLevel];
    }
  }
  
  return LEVEL_TITLES[1] || 'Principiante';
}

/**
 * Obtiene el badge/insignia correspondiente al nivel
 */
export function getLevelBadge(level: number): string {
  if (level >= 999) return '👑'; // Gran Maestro
  if (level >= 500) return '🏆'; // Leyenda
  if (level >= 200) return '🥇'; // Sommelier
  if (level >= 100) return '🍺'; // Maestro Cervecero
  if (level >= 50) return '🎓'; // Experto
  if (level >= 25) return '📚'; // Conocedor
  if (level >= 10) return '⭐'; // Aficionado
  return '🌱'; // Principiante
}

/**
 * Calcula el porcentaje de progreso hacia el siguiente nivel
 */
export function calculateLevelProgress(totalXP: number): number {
  const levelInfo = calculateLevelInfo(totalXP);
  
  if (levelInfo.level >= 999) return 100;
  
  const xpInCurrentLevel = levelInfo.currentXP;
  const xpNeededForNextLevel = calculateXPForNextLevel(levelInfo.level);
  
  return Math.min(100, (xpInCurrentLevel / xpNeededForNextLevel) * 100);
}

/**
 * Simula la ganancia de XP y devuelve si hubo level up
 */
export function simulateXPGain(currentTotalXP: number, xpGained: number): {
  newTotalXP: number;
  leveledUp: boolean;
  oldLevel: number;
  newLevel: number;
  levelsGained: number;
} {
  const oldLevel = calculateLevelFromXP(currentTotalXP);
  const newTotalXP = currentTotalXP + xpGained;
  const newLevel = calculateLevelFromXP(newTotalXP);
  
  return {
    newTotalXP,
    leveledUp: newLevel > oldLevel,
    oldLevel,
    newLevel,
    levelsGained: newLevel - oldLevel
  };
}

/**
 * Genera una tabla de niveles para referencia (útil para debugging)
 */
export function generateLevelTable(maxLevel: number = 50): Array<{
  level: number;
  xpRequired: number;
  totalXP: number;
  title: string;
}> {
  const table = [];
  
  for (let level = 1; level <= maxLevel; level++) {
    table.push({
      level,
      xpRequired: level === 1 ? 0 : calculateXPForNextLevel(level - 1),
      totalXP: calculateTotalXPForLevel(level),
      title: getLevelTitle(level)
    });
  }
  
  return table;
}

/**
 * Valida que un nivel esté dentro del rango permitido
 */
export function isValidLevel(level: number): boolean {
  return level >= 1 && level <= 999 && Number.isInteger(level);
}

/**
 * Calcula cuántos niveles faltan para alcanzar un título específico
 */
export function levelsToTitle(currentLevel: number, targetTitle: string): number {
  const titleLevel = Object.entries(LEVEL_TITLES)
    .find(([, title]) => title === targetTitle)?.[0];
  
  if (!titleLevel) return -1;
  
  const target = parseInt(titleLevel);
  return Math.max(0, target - currentLevel);
}