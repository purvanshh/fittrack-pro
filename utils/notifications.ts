import { NotificationPreferences } from '../types';

// ============================================
// FitTrack Pro - Notification Utilities
// ============================================

// IMPORTANT: expo-notifications was removed from Expo Go in SDK 53
// This is a stub implementation that provides the API without the functionality
// For full notification support, use a development build instead of Expo Go
// See: https://docs.expo.dev/develop/development-builds/introduction/

const NOTIFICATIONS_DISABLED_MESSAGE =
    'Notifications require a development build. Using Expo Go with SDK 53+ does not support push notifications.';

/**
 * Request notification permissions (stub)
 */
export async function requestNotificationPermissions(): Promise<boolean> {
    console.log(NOTIFICATIONS_DISABLED_MESSAGE);
    return false;
}

/**
 * Schedule water reminders (stub)
 */
export async function scheduleWaterReminders(_intervalHours: number): Promise<void> {
    // No-op in Expo Go
}

/**
 * Schedule workout reminder (stub)
 */
export async function scheduleWorkoutReminder(_time: string): Promise<void> {
    // No-op in Expo Go
}

/**
 * Cancel all water reminders (stub)
 */
export async function cancelWaterReminders(): Promise<void> {
    // No-op in Expo Go
}

/**
 * Cancel workout reminder (stub)
 */
export async function cancelWorkoutReminder(): Promise<void> {
    // No-op in Expo Go
}

/**
 * Update all notification schedules (stub)
 */
export async function updateNotificationSchedules(
    _preferences: NotificationPreferences
): Promise<void> {
    // No-op in Expo Go
}

/**
 * Cancel all scheduled notifications (stub)
 */
export async function cancelAllNotifications(): Promise<void> {
    // No-op in Expo Go
}
