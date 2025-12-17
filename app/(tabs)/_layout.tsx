import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { Platform, StyleSheet, View } from 'react-native';
import { borderRadius, glassStyles, shadows, spacing } from '../../constants/theme';
import { useTheme } from '../../context/ThemeContext';

export default function TabLayout() {
    const { theme } = useTheme();
    const isDark = theme.mode === 'dark';

    // Glass tab bar styles
    const tabBarGlassStyle = isDark
        ? glassStyles.dark.surface
        : glassStyles.light.surface;

    return (
        <Tabs
            screenOptions={{
                headerShown: true,
                headerStyle: {
                    backgroundColor: 'transparent',
                    elevation: 0,
                    shadowOpacity: 0,
                    borderBottomWidth: 0,
                },
                headerTransparent: true,
                headerTitleStyle: {
                    color: theme.colors.text,
                    fontSize: 18,
                    fontWeight: '600',
                },
                headerTintColor: theme.colors.text,
                tabBarStyle: {
                    position: 'absolute',
                    bottom: spacing.lg,
                    left: spacing.lg,
                    right: spacing.lg,
                    ...tabBarGlassStyle,
                    borderRadius: borderRadius.full,
                    height: 72,
                    paddingBottom: 0,
                    paddingTop: 0,
                    borderTopWidth: 0,
                    ...shadows.glass,
                    // Additional glass effect
                    ...(Platform.OS === 'ios' ? {
                        backgroundColor: isDark
                            ? 'rgba(20, 20, 30, 0.85)'
                            : 'rgba(255, 255, 255, 0.75)',
                    } : {}),
                },
                tabBarItemStyle: {
                    paddingVertical: spacing.sm,
                },
                tabBarActiveTintColor: theme.colors.primary,
                tabBarInactiveTintColor: theme.colors.textSecondary,
                tabBarShowLabel: false,
                tabBarIconStyle: {
                    marginTop: 0,
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Dashboard',
                    headerShown: false,
                    tabBarIcon: ({ color, focused }) => (
                        <View style={[
                            styles.iconContainer,
                            focused && [
                                styles.activeIcon,
                                { backgroundColor: theme.colors.primary + '25' },
                            ]
                        ]}>
                            <Ionicons
                                name={focused ? 'home' : 'home-outline'}
                                size={24}
                                color={focused ? theme.colors.primary : color}
                            />
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="steps"
                options={{
                    title: 'Steps',
                    tabBarIcon: ({ color, focused }) => (
                        <View style={[
                            styles.iconContainer,
                            focused && [
                                styles.activeIcon,
                                { backgroundColor: theme.colors.primary + '25' },
                            ]
                        ]}>
                            <Ionicons
                                name={focused ? 'walk' : 'walk-outline'}
                                size={24}
                                color={focused ? theme.colors.primary : color}
                            />
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="workout"
                options={{
                    title: 'Workout',
                    tabBarIcon: ({ color, focused }) => (
                        <View style={[
                            styles.iconContainer,
                            focused && [
                                styles.activeIcon,
                                { backgroundColor: theme.colors.workout + '25' },
                            ]
                        ]}>
                            <Ionicons
                                name={focused ? 'barbell' : 'barbell-outline'}
                                size={24}
                                color={focused ? theme.colors.workout : color}
                            />
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="water"
                options={{
                    title: 'Water',
                    tabBarIcon: ({ color, focused }) => (
                        <View style={[
                            styles.iconContainer,
                            focused && [
                                styles.activeIcon,
                                { backgroundColor: theme.colors.water + '25' },
                            ]
                        ]}>
                            <Ionicons
                                name={focused ? 'water' : 'water-outline'}
                                size={24}
                                color={focused ? theme.colors.water : color}
                            />
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="meals"
                options={{
                    title: 'Meals',
                    tabBarIcon: ({ color, focused }) => (
                        <View style={[
                            styles.iconContainer,
                            focused && [
                                styles.activeIcon,
                                { backgroundColor: theme.colors.calories + '25' },
                            ]
                        ]}>
                            <Ionicons
                                name={focused ? 'restaurant' : 'restaurant-outline'}
                                size={24}
                                color={focused ? theme.colors.calories : color}
                            />
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ color, focused }) => (
                        <View style={[
                            styles.iconContainer,
                            focused && [
                                styles.activeIcon,
                                { backgroundColor: theme.colors.secondary + '25' },
                            ]
                        ]}>
                            <Ionicons
                                name={focused ? 'person' : 'person-outline'}
                                size={24}
                                color={focused ? theme.colors.secondary : color}
                            />
                        </View>
                    ),
                }}
            />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    iconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
    },
    activeIcon: {
        transform: [{ scale: 1.05 }],
    },
});

