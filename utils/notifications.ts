import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { NotificationPreferences } from '../types';

// ============================================
// FitTrack Pro - Notification Utilities
// ============================================

// Check if notifications are supported (not on web)
const isNotificationSupported = Platform.OS !== 'web';

// Configure notification handler (only on native)
if (isNotificationSupported) {
    Notifications.setNotificationHandler({
        handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: true,
            shouldSetBadge: false,
            shouldShowBanner: true,
            shouldShowList: true,
        }),
    });
}

/**
 * Request notification permissions
 */
export async function requestNotificationPermissions(): Promise<boolean> {
    if (!isNotificationSupported) {
        console.log('Notifications not supported on web');
        return false;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }

    if (finalStatus !== 'granted') {
        console.log('Notification permissions not granted');
        return false;
    }

    // For Android, set up notification channel
    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'FitTrack Reminders',
            importance: Notifications.AndroidImportance.HIGH,
            vibrationPattern: [0, 250, 250, 250],
        });
    }

    return true;
}

/**
 * Schedule water reminders at regular intervals
 */
export async function scheduleWaterReminders(intervalHours: number): Promise<void> {
    if (!isNotificationSupported) return;

    // Cancel existing water reminders
    await cancelWaterReminders();

    if (intervalHours <= 0) return;

    // Schedule reminders from 8 AM to 10 PM
    const startHour = 8;
    const endHour = 22;

    for (let hour = startHour; hour <= endHour; hour += intervalHours) {
        await Notifications.scheduleNotificationAsync({
            content: {
                title: '💧 Time to Hydrate!',
                body: "Don't forget to drink some water to stay hydrated.",
                sound: true,
            },
            trigger: {
                type: Notifications.SchedulableTriggerInputTypes.DAILY,
                hour: hour,
                minute: 0,
            },
            identifier: `water-reminder-${hour}`,
        });
    }
}

/**
 * Schedule workout reminder at a specific time
 */
export async function scheduleWorkoutReminder(time: string): Promise<void> {
    if (!isNotificationSupported) return;

    // Cancel existing workout reminder
    await cancelWorkoutReminder();

    const [hours, minutes] = time.split(':').map(Number);

    await Notifications.scheduleNotificationAsync({
        content: {
            title: '🏋️ Workout Time!',
            body: "Ready to crush your fitness goals? Let's get moving!",
            sound: true,
        },
        trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DAILY,
            hour: hours,
            minute: minutes,
        },
        identifier: 'workout-reminder',
    });
}

/**
 * Cancel all water reminders
 */
export async function cancelWaterReminders(): Promise<void> {
    if (!isNotificationSupported) return;

    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    const waterReminders = scheduled.filter(n =>
        n.identifier?.startsWith('water-reminder-')
    );

    for (const reminder of waterReminders) {
        await Notifications.cancelScheduledNotificationAsync(reminder.identifier);
    }
}

/**
 * Cancel workout reminder
 */
export async function cancelWorkoutReminder(): Promise<void> {
    if (!isNotificationSupported) return;

    try {
        await Notifications.cancelScheduledNotificationAsync('workout-reminder');
    } catch {
        // Ignore if not found
    }
}

/**
 * Update all notification schedules based on preferences
 */
export async function updateNotificationSchedules(
    preferences: NotificationPreferences
): Promise<void> {
    const hasPermission = await requestNotificationPermissions();

    if (!hasPermission) return;

    if (preferences.waterReminders) {
        await scheduleWaterReminders(preferences.waterReminderInterval);
    } else {
        await cancelWaterReminders();
    }

    if (preferences.workoutReminders) {
        await scheduleWorkoutReminder(preferences.workoutReminderTime);
    } else {
        await cancelWorkoutReminder();
    }
}

/**
 * Cancel all scheduled notifications
 */
export async function cancelAllNotifications(): Promise<void> {
    if (!isNotificationSupported) return;

    await Notifications.cancelAllScheduledNotificationsAsync();
}
