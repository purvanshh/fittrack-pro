import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    DailyStats,
    DEFAULT_PROFILE,
    Meal,
    UserProfile,
    WaterIntake,
    Workout,
} from '../types';
import { calculateStreak, getLast7Days, getToday } from './dateUtils';

// ============================================
// FitTrack Pro - Storage Utilities
// User-Specific Storage with User ID Namespacing
// ============================================

// Current user ID - set when user logs in
let currentUserId: string | null = null;

export function setCurrentUserId(userId: string | null): void {
    currentUserId = userId;
    console.log('Storage: User ID set to:', userId);
}

export function getCurrentUserId(): string | null {
    return currentUserId;
}

// Generate user-specific storage key
function getUserKey(baseKey: string): string {
    if (!currentUserId) {
        // Fallback for when no user is logged in (shouldn't happen normally)
        return `@fittrack_guest_${baseKey}`;
    }
    return `@fittrack_${currentUserId}_${baseKey}`;
}

// Storage key constants (base keys without user prefix)
const KEYS = {
    WORKOUTS: 'workouts',
    MEALS: 'meals',
    WATER: 'water',
    PROFILE: 'profile',
};

// ==================== WORKOUTS ====================

export async function getWorkouts(): Promise<Workout[]> {
    try {
        const data = await AsyncStorage.getItem(getUserKey(KEYS.WORKOUTS));
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Error getting workouts:', error);
        return [];
    }
}

export async function saveWorkout(workout: Workout): Promise<void> {
    try {
        const workouts = await getWorkouts();
        workouts.push(workout);
        await AsyncStorage.setItem(getUserKey(KEYS.WORKOUTS), JSON.stringify(workouts));
        await updateStreak();
    } catch (error) {
        console.error('Error saving workout:', error);
    }
}

export async function deleteWorkout(id: string): Promise<void> {
    try {
        const workouts = await getWorkouts();
        const filtered = workouts.filter(w => w.id !== id);
        await AsyncStorage.setItem(getUserKey(KEYS.WORKOUTS), JSON.stringify(filtered));
    } catch (error) {
        console.error('Error deleting workout:', error);
    }
}

export async function getTodayWorkouts(): Promise<Workout[]> {
    const workouts = await getWorkouts();
    const today = getToday();
    return workouts.filter(w => w.date === today);
}

// ==================== MEALS ====================

export async function getMeals(): Promise<Meal[]> {
    try {
        const data = await AsyncStorage.getItem(getUserKey(KEYS.MEALS));
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Error getting meals:', error);
        return [];
    }
}

export async function saveMeal(meal: Meal): Promise<void> {
    try {
        const meals = await getMeals();
        meals.push(meal);
        await AsyncStorage.setItem(getUserKey(KEYS.MEALS), JSON.stringify(meals));
        await updateStreak();
    } catch (error) {
        console.error('Error saving meal:', error);
    }
}

export async function deleteMeal(id: string): Promise<void> {
    try {
        const meals = await getMeals();
        const filtered = meals.filter(m => m.id !== id);
        await AsyncStorage.setItem(getUserKey(KEYS.MEALS), JSON.stringify(filtered));
    } catch (error) {
        console.error('Error deleting meal:', error);
    }
}

export async function getTodayMeals(): Promise<Meal[]> {
    const meals = await getMeals();
    const today = getToday();
    return meals.filter(m => m.date === today);
}

// ==================== WATER ====================

export async function getWaterIntakes(): Promise<WaterIntake[]> {
    try {
        const data = await AsyncStorage.getItem(getUserKey(KEYS.WATER));
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Error getting water intakes:', error);
        return [];
    }
}

export async function saveWaterIntake(intake: WaterIntake): Promise<void> {
    try {
        const intakes = await getWaterIntakes();
        intakes.push(intake);
        await AsyncStorage.setItem(getUserKey(KEYS.WATER), JSON.stringify(intakes));
        await updateStreak();
    } catch (error) {
        console.error('Error saving water intake:', error);
    }
}

export async function deleteWaterIntake(id: string): Promise<void> {
    try {
        const intakes = await getWaterIntakes();
        const filtered = intakes.filter(i => i.id !== id);
        await AsyncStorage.setItem(getUserKey(KEYS.WATER), JSON.stringify(filtered));
    } catch (error) {
        console.error('Error deleting water intake:', error);
    }
}

export async function getTodayWater(): Promise<WaterIntake[]> {
    const intakes = await getWaterIntakes();
    const today = getToday();
    return intakes.filter(i => i.date === today);
}

export async function getTodayWaterTotal(): Promise<number> {
    const todayIntakes = await getTodayWater();
    return todayIntakes.reduce((sum, i) => sum + i.amount, 0);
}

// ==================== PROFILE ====================

export async function getProfile(): Promise<UserProfile> {
    try {
        const data = await AsyncStorage.getItem(getUserKey(KEYS.PROFILE));
        return data ? JSON.parse(data) : DEFAULT_PROFILE;
    } catch (error) {
        console.error('Error getting profile:', error);
        return DEFAULT_PROFILE;
    }
}

export async function saveProfile(profile: UserProfile): Promise<void> {
    try {
        await AsyncStorage.setItem(getUserKey(KEYS.PROFILE), JSON.stringify(profile));
    } catch (error) {
        console.error('Error saving profile:', error);
    }
}

export async function updateStreak(): Promise<void> {
    try {
        const profile = await getProfile();
        const today = getToday();

        if (profile.lastActiveDate !== today) {
            const newStreak = calculateStreak(profile.lastActiveDate, profile.streak);
            profile.streak = newStreak;
            profile.lastActiveDate = today;
            await saveProfile(profile);
        }
    } catch (error) {
        console.error('Error updating streak:', error);
    }
}

// ==================== DAILY STATS ====================

export async function getDailyStats(date: string): Promise<DailyStats> {
    const [workouts, meals, waterIntakes] = await Promise.all([
        getWorkouts(),
        getMeals(),
        getWaterIntakes(),
    ]);

    const dayWorkouts = workouts.filter(w => w.date === date);
    const dayMeals = meals.filter(m => m.date === date);
    const dayWater = waterIntakes.filter(i => i.date === date);

    return {
        date,
        totalWater: dayWater.reduce((sum, i) => sum + i.amount, 0),
        totalCalories: dayMeals.reduce((sum, m) => sum + m.calories, 0),
        totalWorkoutMinutes: dayWorkouts.reduce((sum, w) => sum + w.duration, 0),
        workoutCount: dayWorkouts.length,
    };
}

export async function getWeeklyStats(): Promise<DailyStats[]> {
    const days = getLast7Days();
    const stats = await Promise.all(days.map(date => getDailyStats(date)));
    return stats;
}

// ==================== CLEAR DATA ====================

export async function clearAllData(): Promise<void> {
    try {
        // Only clear data for current user
        await AsyncStorage.multiRemove([
            getUserKey(KEYS.WORKOUTS),
            getUserKey(KEYS.MEALS),
            getUserKey(KEYS.WATER),
            getUserKey(KEYS.PROFILE),
        ]);
    } catch (error) {
        console.error('Error clearing data:', error);
    }
}
