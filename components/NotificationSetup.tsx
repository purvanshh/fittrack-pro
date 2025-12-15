import Constants from 'expo-constants';
import { useEffect, useRef } from 'react';
import { requestNotificationPermissions } from '../utils/notifications';

// ============================================
// Notification Setup Component
// ============================================
// This component handles notification permissions and listeners
// Add this to the root layout to enable notifications

// Check if we're in Expo Go
const isExpoGo = Constants.appOwnership === 'expo';

export default function NotificationSetup() {
    const listenerCleanups = useRef<(() => void)[]>([]);

    useEffect(() => {
        // Skip setup in Expo Go
        if (isExpoGo) {
            console.log('Notifications are not supported in Expo Go. Skipping setup.');
            return;
        }

        // Request permissions on mount
        requestNotificationPermissions();

        // Setup listeners only in development builds
        const setupListeners = async () => {
            try {
                const Notifications = await import('expo-notifications');

                // Listen for incoming notifications while app is foregrounded
                const notificationSubscription = Notifications.addNotificationReceivedListener(notification => {
                    console.log('Notification received:', notification.request.content.title);
                });

                // Listen for user interactions with notifications
                const responseSubscription = Notifications.addNotificationResponseReceivedListener(response => {
                    const data = response.notification.request.content.data;
                    console.log('Notification tapped:', data);
                });

                // Store cleanup functions
                listenerCleanups.current = [
                    () => notificationSubscription.remove(),
                    () => responseSubscription.remove(),
                ];
            } catch (error) {
                console.log('Could not setup notification listeners:', error);
            }
        };

        setupListeners();

        return () => {
            // Cleanup listeners
            listenerCleanups.current.forEach(cleanup => cleanup());
        };
    }, []);

    // This component doesn't render anything
    return null;
}
