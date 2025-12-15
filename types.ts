// ============================================
// FitTrack Pro - Type Definitions
// ============================================

// Workout Types
export type WorkoutType =
    | 'running'
    | 'cycling'
    | 'swimming'
    | 'weight_training'
    | 'yoga'
    | 'hiit'
    | 'walking'
    | 'other';

export interface Workout {
    id: string;
    type: WorkoutType;
    duration: number; // in minutes
    calories: number;
    date: string; // ISO date string
    notes?: string;
}

// Meal Types
export interface Meal {
    id: string;
    food: string;
    calories: number;
    date: string; // ISO date string
    mealType?: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    protein?: number;
    carbs?: number;
    fat?: number;
}

// Water Intake
export interface WaterIntake {
    id: string;
    amount: number; // in ml
    date: string; // ISO date string
    time: string; // HH:mm format
}

// User Profile & Goals
export interface UserGoals {
    dailyWater: number; // in ml
    dailyCalories: number;
    weeklyWorkouts: number;
}

export interface NotificationPreferences {
    waterReminders: boolean;
    waterReminderInterval: number; // in hours
    workoutReminders: boolean;
    workoutReminderTime: string; // HH:mm format
    mealNotifications: boolean; // Goal achievement notifications for meals
    streakNotifications: boolean; // Streak milestone notifications
}

export interface UserProfile {
    name: string;
    avatar?: string; // Avatar preset ID (e.g., 'fitness', 'runner', 'yoga')
    weight?: number; // in kg
    height?: number; // in cm
    goals: UserGoals;
    notifications: NotificationPreferences;
    streak: number;
    lastActiveDate: string;
}

// Daily Aggregated Data
export interface DailyStats {
    date: string;
    totalWater: number;
    totalCalories: number;
    totalWorkoutMinutes: number;
    workoutCount: number;
}

// Weekly Report Data
export interface WeeklyReport {
    startDate: string;
    endDate: string;
    dailyStats: DailyStats[];
    bestWorkoutDay: string | null;
    averageWater: number;
    averageCalories: number;
    totalWorkouts: number;
}

// Theme Types
export type ThemeMode = 'light' | 'dark';

export interface Theme {
    mode: ThemeMode;
    colors: {
        primary: string;
        primaryLight: string;
        secondary: string;
        accent: string;
        background: string;
        surface: string;
        surfaceVariant: string;
        // Glass-specific colors
        glassSurface: string;
        glassBackground: string;
        text: string;
        textSecondary: string;
        border: string;
        glassBorder: string;
        success: string;
        warning: string;
        error: string;
        water: string;
        calories: string;
        workout: string;
    };
}

// Storage Keys
export const STORAGE_KEYS = {
    WORKOUTS: '@fittrack_workouts',
    MEALS: '@fittrack_meals',
    WATER: '@fittrack_water',
    PROFILE: '@fittrack_profile',
    THEME: '@fittrack_theme',
} as const;

// Default Values
export const DEFAULT_GOALS: UserGoals = {
    dailyWater: 2500, // 2.5 liters
    dailyCalories: 2000,
    weeklyWorkouts: 5,
};

export const DEFAULT_NOTIFICATIONS: NotificationPreferences = {
    waterReminders: true,
    waterReminderInterval: 2,
    workoutReminders: true,
    workoutReminderTime: '09:00',
    mealNotifications: true,
    streakNotifications: true,
};

export const DEFAULT_PROFILE: UserProfile = {
    name: '',
    avatar: 'star', // Default avatar
    goals: DEFAULT_GOALS,
    notifications: DEFAULT_NOTIFICATIONS,
    streak: 0,
    lastActiveDate: new Date().toISOString().split('T')[0],
};

// Avatar preset options
export const AVATAR_PRESETS = [
    { id: 'fitness', emoji: '🏋️', label: 'Fitness' },
    { id: 'runner', emoji: '🏃', label: 'Runner' },
    { id: 'yoga', emoji: '🧘', label: 'Yoga' },
    { id: 'cyclist', emoji: '🚴', label: 'Cyclist' },
    { id: 'swimmer', emoji: '🏊', label: 'Swimmer' },
    { id: 'energy', emoji: '⚡', label: 'Energy' },
    { id: 'star', emoji: '🌟', label: 'Star' },
    { id: 'fire', emoji: '🔥', label: 'Fire' },
];

// Workout type display names and icons
export const WORKOUT_TYPES: Record<WorkoutType, { label: string; icon: string }> = {
    running: { label: 'Running', icon: 'walk' },
    cycling: { label: 'Cycling', icon: 'bicycle' },
    swimming: { label: 'Swimming', icon: 'water' },
    weight_training: { label: 'Weight Training', icon: 'barbell' },
    yoga: { label: 'Yoga', icon: 'body' },
    hiit: { label: 'HIIT', icon: 'flame' },
    walking: { label: 'Walking', icon: 'walk' },
    other: { label: 'Other', icon: 'fitness' },
};

// Water presets in ml
export const WATER_PRESETS = [150, 250, 350, 500];

