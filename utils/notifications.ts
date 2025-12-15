import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { NotificationPreferences } from '../types';

// ============================================
// FitTrack Pro - Notification Utilities
// ============================================

// Check if we're in Expo Go (notifications don't work there in SDK 53+)
const isExpoGo = Constants.appOwnership === 'expo';

// Only import expo-notifications in development builds
let Notifications: typeof import('expo-notifications') | null = null;

// Lazy load notifications module only if not in Expo Go
async function getNotificationsModule() {
    if (isExpoGo) {
        console.log('Notifications are not supported in Expo Go. Using development build is required.');
        return null;
    }
    if (!Notifications) {
        Notifications = await import('expo-notifications');
    }
    return Notifications;
}

// Configure notification behavior (only in dev builds)
if (!isExpoGo) {
    import('expo-notifications').then((module) => {
        module.setNotificationHandler({
            handleNotification: async () => ({
                shouldShowAlert: true,
                shouldPlaySound: true,
                shouldSetBadge: true,
                shouldShowBanner: true,
                shouldShowList: true,
            }),
        });
    }).catch(() => {
        // Ignore errors if module can't be loaded
    });
}

/**
 * Request notification permissions from the user
 */
export async function requestNotificationPermissions(): Promise<boolean> {
    if (isExpoGo) {
        console.log('Notifications require a development build. Skipping permission request.');
        return false;
    }

    try {
        const notifs = await getNotificationsModule();
        if (!notifs) return false;

        const { status: existingStatus } = await notifs.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
            const { status } = await notifs.requestPermissionsAsync();
            finalStatus = status;
        }

        if (finalStatus !== 'granted') {
            console.log('Notification permissions not granted');
            return false;
        }

        // Create notification channels for Android
        if (Platform.OS === 'android') {
            await createNotificationChannels();
        }

        return true;
    } catch (error) {
        console.error('Error requesting notification permissions:', error);
        return false;
    }
}

/**
 * Create notification channels for Android
 */
async function createNotificationChannels(): Promise<void> {
    const notifs = await getNotificationsModule();
    if (!notifs) return;

    await notifs.setNotificationChannelAsync('water-reminders', {
        name: 'Water Reminders',
        description: 'Reminders to stay hydrated',
        importance: notifs.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#00D4FF',
    });

    await notifs.setNotificationChannelAsync('workout-reminders', {
        name: 'Workout Reminders',
        description: 'Daily workout reminders',
        importance: notifs.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF6B6B',
    });

    await notifs.setNotificationChannelAsync('achievements', {
        name: 'Achievements',
        description: 'Goal and streak achievements',
        importance: notifs.AndroidImportance.DEFAULT,
        lightColor: '#FFD93D',
    });
}

/**
 * Schedule recurring water reminders
 */
export async function scheduleWaterReminders(intervalHours: number): Promise<void> {
    if (isExpoGo) return;

    try {
        const notifs = await getNotificationsModule();
        if (!notifs) return;

        // Cancel existing water reminders first
        await cancelWaterReminders();

        // Schedule repeating reminder
        await notifs.scheduleNotificationAsync({
            content: {
                title: '💧 Time to Hydrate!',
                body: "Stay on track with your water goal. Take a sip!",
                sound: true,
                priority: notifs.AndroidNotificationPriority.HIGH,
            },
            trigger: {
                type: notifs.SchedulableTriggerInputTypes.TIME_INTERVAL,
                seconds: intervalHours * 60 * 60,
                repeats: true,
            },
            identifier: 'water-reminder',
        });

        console.log(`Water reminders scheduled every ${intervalHours} hours`);
    } catch (error) {
        console.error('Error scheduling water reminders:', error);
    }
}

/**
 * Schedule daily workout reminder at a specific time
 */
export async function scheduleWorkoutReminder(time: string): Promise<void> {
    if (isExpoGo) return;

    try {
        const notifs = await getNotificationsModule();
        if (!notifs) return;

        // Cancel existing workout reminder first
        await cancelWorkoutReminder();

        // Parse time string (HH:mm format)
        const [hours, minutes] = time.split(':').map(Number);

        // Schedule daily reminder
        await notifs.scheduleNotificationAsync({
            content: {
                title: '🏋️ Workout Time!',
                body: "Ready to crush your fitness goals? Let's get moving!",
                sound: true,
                priority: notifs.AndroidNotificationPriority.HIGH,
            },
            trigger: {
                type: notifs.SchedulableTriggerInputTypes.DAILY,
                hour: hours,
                minute: minutes,
            },
            identifier: 'workout-reminder',
        });

        console.log(`Workout reminder scheduled for ${time}`);
    } catch (error) {
        console.error('Error scheduling workout reminder:', error);
    }
}

/**
 * Cancel all water reminders
 */
export async function cancelWaterReminders(): Promise<void> {
    if (isExpoGo) return;

    try {
        const notifs = await getNotificationsModule();
        if (!notifs) return;
        await notifs.cancelScheduledNotificationAsync('water-reminder');
    } catch (error) {
        // Notification might not exist, ignore error
    }
}

/**
 * Cancel workout reminder
 */
export async function cancelWorkoutReminder(): Promise<void> {
    if (isExpoGo) return;

    try {
        const notifs = await getNotificationsModule();
        if (!notifs) return;
        await notifs.cancelScheduledNotificationAsync('workout-reminder');
    } catch (error) {
        // Notification might not exist, ignore error
    }
}

/**
 * Update all notification schedules based on user preferences
 */
export async function updateNotificationSchedules(
    preferences: NotificationPreferences
): Promise<void> {
    if (isExpoGo) return;

    // Handle water reminders
    if (preferences.waterReminders) {
        await scheduleWaterReminders(preferences.waterReminderInterval);
    } else {
        await cancelWaterReminders();
    }

    // Handle workout reminders
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
    if (isExpoGo) return;

    try {
        const notifs = await getNotificationsModule();
        if (!notifs) return;
        await notifs.cancelAllScheduledNotificationsAsync();
        console.log('All notifications cancelled');
    } catch (error) {
        console.error('Error cancelling notifications:', error);
    }
}

/**
 * Send an immediate notification for goal achievement
 */
export async function sendGoalAchievedNotification(
    goalType: 'water' | 'calories' | 'workout'
): Promise<void> {
    if (isExpoGo) return;

    const titles: Record<string, string> = {
        water: '💧 Water Goal Achieved!',
        calories: '🍎 Calorie Goal Reached!',
        workout: '🏆 Workout Goal Complete!',
    };

    const bodies: Record<string, string> = {
        water: "Amazing! You've hit your daily water goal. Stay hydrated!",
        calories: "Great job tracking your nutrition today!",
        workout: "You crushed your workout goal! Keep up the momentum!",
    };

    try {
        const notifs = await getNotificationsModule();
        if (!notifs) return;

        await notifs.scheduleNotificationAsync({
            content: {
                title: titles[goalType],
                body: bodies[goalType],
                sound: true,
                priority: notifs.AndroidNotificationPriority.DEFAULT,
            },
            trigger: null, // Send immediately
        });
    } catch (error) {
        console.error('Error sending goal notification:', error);
    }
}

/**
 * Send streak notification
 */
export async function sendStreakNotification(streakDays: number): Promise<void> {
    if (isExpoGo) return;

    try {
        const notifs = await getNotificationsModule();
        if (!notifs) return;

        await notifs.scheduleNotificationAsync({
            content: {
                title: '🔥 Streak On Fire!',
                body: `Incredible! You're on a ${streakDays}-day streak! Keep going!`,
                sound: true,
                priority: notifs.AndroidNotificationPriority.DEFAULT,
            },
            trigger: null, // Send immediately
        });
    } catch (error) {
        console.error('Error sending streak notification:', error);
    }
}

/**
 * Get Expo push token for remote notifications (optional future use)
 */
export async function getExpoPushToken(): Promise<string | null> {
    if (isExpoGo) return null;

    try {
        const notifs = await getNotificationsModule();
        if (!notifs) return null;

        const token = await notifs.getExpoPushTokenAsync({
            projectId: 'e5ccd4b4-7582-42a3-aa85-99bb4f4461c3',
        });
        return token.data;
    } catch (error) {
        console.error('Error getting push token:', error);
        return null;
    }
}
