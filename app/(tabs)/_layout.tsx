import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { borderRadius, spacing } from '../../constants/theme';
import { useTheme } from '../../context/ThemeContext';

export default function TabLayout() {
    const { theme } = useTheme();

    return (
        <Tabs
            screenOptions={{
                headerShown: true,
                headerStyle: {
                    backgroundColor: theme.colors.background,
                    elevation: 0,
                    shadowOpacity: 0,
                    borderBottomWidth: 0,
                },
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
                    backgroundColor: theme.colors.surface,
                    borderRadius: borderRadius.full,
                    height: 70,
                    paddingBottom: 0,
                    paddingTop: 0,
                    borderTopWidth: 0,
                    elevation: 8,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 8 },
                    shadowOpacity: 0.15,
                    shadowRadius: 16,
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
                            focused && [styles.activeIcon, { backgroundColor: theme.colors.primary + '20' }]
                        ]}>
                            <Ionicons
                                name={focused ? 'home' : 'home-outline'}
                                size={24}
                                color={color}
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
                            focused && [styles.activeIcon, { backgroundColor: theme.colors.workout + '20' }]
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
                            focused && [styles.activeIcon, { backgroundColor: theme.colors.water + '20' }]
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
                            focused && [styles.activeIcon, { backgroundColor: theme.colors.calories + '20' }]
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
                            focused && [styles.activeIcon, { backgroundColor: theme.colors.secondary + '20' }]
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
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    activeIcon: {
        transform: [{ scale: 1.1 }],
    },
});
