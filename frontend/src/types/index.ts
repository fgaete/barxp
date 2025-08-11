// User Types
export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  level: number;
  currentXP: number;
  totalXP: number;
  xpToNextLevel: number;
  createdAt: Date;
  lastLoginAt: Date;
  preferences: UserPreferences;
}

export interface UserPreferences {
  notifications: boolean;
  darkMode: boolean;
  language: 'es' | 'en';
  units: 'metric' | 'imperial';
}

// Drink Types
export interface Drink {
  id: string;
  name: string;
  type: DrinkType;
  alcoholContent: number; // Percentage
  description?: string;
  imageUrl?: string;
  baseXP: number;
  rarity: DrinkRarity;
  origin?: string;
  tags: string[];
}

export const DrinkType = {
  BEER: 'beer',
  WINE: 'wine',
  COCKTAIL: 'cocktail',
  SPIRIT: 'spirit',
  LIQUEUR: 'liqueur',
  SAKE: 'sake',
  CIDER: 'cider',
  MEAD: 'mead',
  OTHER: 'other'
} as const;

export type DrinkType = typeof DrinkType[keyof typeof DrinkType];

export const DrinkRarity = {
  COMMON: 'common',
  UNCOMMON: 'uncommon',
  RARE: 'rare',
  EPIC: 'epic',
  LEGENDARY: 'legendary'
} as const;

export type DrinkRarity = typeof DrinkRarity[keyof typeof DrinkRarity];

// Consumption Types
export interface DrinkConsumption {
  id: string;
  userId: string;
  drinkId: string;
  drink: Drink;
  consumedAt: Date;
  location?: string;
  notes?: string;
  xpEarned: number;
  multipliers: XPMultiplier[];
  groupEventId?: string;
  rating?: number; // 1-5 stars
}

export interface XPMultiplier {
  type: MultiplierType;
  value: number; // 1.5 = 50% bonus
  reason: string;
}

export const MultiplierType = {
  FIRST_TIME: 'first_time',
  RARE_DRINK: 'rare_drink',
  GROUP_EVENT: 'group_event',
  PERFECT_PAIRING: 'perfect_pairing',
  STREAK_BONUS: 'streak_bonus'
} as const;

export type MultiplierType = typeof MultiplierType[keyof typeof MultiplierType];

// Level System
export interface LevelInfo {
  level: number;
  currentXP: number;
  xpToNextLevel: number;
  totalXPRequired: number;
  title: string;
  badge?: string;
}

export const LEVEL_TITLES: Record<number, string> = {
  1: 'Principiante',
  10: 'Aficionado',
  25: 'Conocedor',
  50: 'Experto',
  100: 'Maestro Cervecero',
  200: 'Sommelier',
  500: 'Leyenda',
  999: 'Gran Maestro'
};

// Achievement Types
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: AchievementRarity;
  xpReward: number;
  requirements: AchievementRequirement[];
}

export interface UserAchievement {
  achievementId: string;
  achievement: Achievement;
  unlockedAt: Date;
  progress?: number; // For progressive achievements
}

export const AchievementRarity = {
  BRONZE: 'bronze',
  SILVER: 'silver',
  GOLD: 'gold',
  PLATINUM: 'platinum'
} as const;

export type AchievementRarity = typeof AchievementRarity[keyof typeof AchievementRarity];

export interface AchievementRequirement {
  type: RequirementType;
  value: number;
  drinkType?: DrinkType;
  timeframe?: number; // in days
}

export const RequirementType = {
  TOTAL_DRINKS: 'total_drinks',
  UNIQUE_DRINKS: 'unique_drinks',
  DRINK_TYPE_COUNT: 'drink_type_count',
  CONSECUTIVE_DAYS: 'consecutive_days',
  GROUP_EVENTS: 'group_events',
  LEVEL_REACHED: 'level_reached'
} as const;

export type RequirementType = typeof RequirementType[keyof typeof RequirementType];

// Group Types
export interface Group {
  id: string;
  name: string;
  description?: string;
  createdBy: string;
  createdAt: Date;
  members: GroupMember[];
  isPrivate: boolean;
  inviteCode?: string;
  settings: GroupSettings;
}

export interface GroupMember {
  userId: string;
  user: User;
  joinedAt: Date;
  role: GroupRole;
  stats: GroupMemberStats;
}

export const GroupRole = {
  OWNER: 'owner',
  ADMIN: 'admin',
  MEMBER: 'member'
} as const;

export type GroupRole = typeof GroupRole[keyof typeof GroupRole];

export interface GroupMemberStats {
  totalXP: number;
  drinksConsumed: number;
  eventsAttended: number;
  rank: number;
}

export interface GroupSettings {
  allowInvites: boolean;
  requireApproval: boolean;
  maxMembers: number;
}

// Event Types
export interface GroupEvent {
  id: string;
  groupId: string;
  name: string;
  description?: string;
  scheduledAt: Date;
  location?: string;
  createdBy: string;
  attendees: EventAttendee[];
  status: EventStatus;
  googleCalendarEventId?: string;
}

export interface EventAttendee {
  userId: string;
  user: User;
  status: AttendeeStatus;
  joinedAt: Date;
}

export const EventStatus = {
  SCHEDULED: 'scheduled',
  ACTIVE: 'active',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
} as const;

export type EventStatus = typeof EventStatus[keyof typeof EventStatus];

export const AttendeeStatus = {
  INVITED: 'invited',
  ACCEPTED: 'accepted',
  DECLINED: 'declined',
  MAYBE: 'maybe'
} as const;

export type AttendeeStatus = typeof AttendeeStatus[keyof typeof AttendeeStatus];

// Statistics Types
export interface UserStats {
  totalDrinks: number;
  uniqueDrinks: number;
  favoriteType: DrinkType;
  averageRating: number;
  streakDays: number;
  longestStreak: number;
  totalXP: number;
  achievementsUnlocked: number;
  groupsJoined: number;
  eventsAttended: number;
  monthlyStats: MonthlyStats[];
}

export interface MonthlyStats {
  month: string; // YYYY-MM
  drinksConsumed: number;
  xpEarned: number;
  newAchievements: number;
  favoriteType: DrinkType;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Form Types
export interface AddDrinkForm {
  drinkId: string;
  location?: string;
  notes?: string;
  rating?: number;
}

export interface CreateGroupForm {
  name: string;
  description?: string;
  isPrivate: boolean;
}

export interface CreateEventForm {
  name: string;
  description?: string;
  scheduledAt: Date;
  location?: string;
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: unknown;
  read: boolean;
  createdAt: Date;
}

export const NotificationType = {
  ACHIEVEMENT_UNLOCKED: 'achievement_unlocked',
  LEVEL_UP: 'level_up',
  GROUP_INVITE: 'group_invite',
  EVENT_REMINDER: 'event_reminder',
  FRIEND_ACTIVITY: 'friend_activity',
  SYSTEM: 'system'
} as const;

export type NotificationType = typeof NotificationType[keyof typeof NotificationType];