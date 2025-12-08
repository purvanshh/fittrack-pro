import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
    Alert,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { borderRadius, shadows, spacing, typography } from '../../constants/theme';
import { useTheme } from '../../context/ThemeContext';
import { DEFAULT_PROFILE, UserProfile } from '../../types';
import { cancelAllNotifications, updateNotificationSchedules } from '../../utils/notifications';
import { clearAllData, getProfile, saveProfile } from '../../utils/storage';

export default function ProfileScreen() {
    const { theme, themeMode, toggleTheme } = useTheme();
    const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
    const [refreshing, setRefreshing] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const loadData = async () => {
        const profileData = await getProfile();
        setProfile(profileData);
    };

    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [])
    );

    const onRefresh = async () => {
        setRefreshing(true);
        await loadData();
        setRefreshing(false);
    };

    const handleSave = async () => {
        await saveProfile(profile);
        await updateNotificationSchedules(profile.notifications);
        setIsEditing(false);
    };

    const handleToggleWaterReminders = async (value: boolean) => {
        const updated = {
            ...profile,
            notifications: { ...profile.notifications, waterReminders: value },
        };
        setProfile(updated);
        await saveProfile(updated);
        await updateNotificationSchedules(updated.notifications);
    };

    const handleToggleWorkoutReminders = async (value: boolean) => {
        const updated = {
            ...profile,
            notifications: { ...profile.notifications, workoutReminders: value },
        };
        setProfile(updated);
        await saveProfile(updated);
        await updateNotificationSchedules(updated.notifications);
    };

    const handleClearData = () => {
        Alert.alert(
            'Clear All Data',
            'This will delete all your workout, meal, and water tracking data. This action cannot be undone.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Clear',
                    style: 'destructive',
                    onPress: async () => {
                        await clearAllData();
                        await cancelAllNotifications();
                        setProfile(DEFAULT_PROFILE);
                    },
                },
            ]
        );
    };

    return (
        <ScrollView
            style={[styles.container, { backgroundColor: theme.colors.background }]}
            contentContainerStyle={styles.content}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
        >
            {/* Profile Header */}
            <View style={[styles.profileHeader, { backgroundColor: theme.colors.surface }, shadows.md]}>
                <View style={[styles.avatar, { backgroundColor: theme.colors.primary }]}>
                    <Text style={styles.avatarText}>
                        {profile.name ? profile.name[0].toUpperCase() : 'U'}
                    </Text>
                </View>
                <Text style={[styles.userName, { color: theme.colors.text }]}>
                    {profile.name || 'Set your name'}
                </Text>
                <View style={[styles.streakInfo, { backgroundColor: theme.colors.accent + '20' }]}>
                    <Ionicons name="flame" size={16} color={theme.colors.accent} />
                    <Text style={[styles.streakText, { color: theme.colors.accent }]}>
                        {profile.streak} day streak
                    </Text>
                </View>
            </View>

            {/* Personal Details */}
            <View style={[styles.section, { backgroundColor: theme.colors.surface }, shadows.sm]}>
                <View style={styles.sectionHeader}>
                    <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                        Personal Details
                    </Text>
                    <TouchableOpacity onPress={() => isEditing ? handleSave() : setIsEditing(true)}>
                        <Text style={[styles.editButton, { color: theme.colors.primary }]}>
                            {isEditing ? 'Save' : 'Edit'}
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.inputGroup}>
                    <Text style={[styles.inputLabel, { color: theme.colors.textSecondary }]}>Name</Text>
                    <TextInput
                        style={[
                            styles.input,
                            {
                                backgroundColor: theme.colors.surfaceVariant,
                                color: theme.colors.text,
                                borderColor: theme.colors.border,
                            },
                        ]}
                        placeholder="Your name"
                        placeholderTextColor={theme.colors.textSecondary}
                        value={profile.name}
                        onChangeText={(text) => setProfile({ ...profile, name: text })}
                        editable={isEditing}
                    />
                </View>

                <View style={styles.rowInputs}>
                    <View style={[styles.inputGroup, { flex: 1 }]}>
                        <Text style={[styles.inputLabel, { color: theme.colors.textSecondary }]}>Weight (kg)</Text>
                        <TextInput
                            style={[
                                styles.input,
                                {
                                    backgroundColor: theme.colors.surfaceVariant,
                                    color: theme.colors.text,
                                    borderColor: theme.colors.border,
                                },
                            ]}
                            placeholder="70"
                            placeholderTextColor={theme.colors.textSecondary}
                            keyboardType="number-pad"
                            value={profile.weight?.toString() || ''}
                            onChangeText={(text) => setProfile({ ...profile, weight: parseInt(text) || undefined })}
                            editable={isEditing}
                        />
                    </View>
                    <View style={[styles.inputGroup, { flex: 1 }]}>
                        <Text style={[styles.inputLabel, { color: theme.colors.textSecondary }]}>Height (cm)</Text>
                        <TextInput
                            style={[
                                styles.input,
                                {
                                    backgroundColor: theme.colors.surfaceVariant,
                                    color: theme.colors.text,
                                    borderColor: theme.colors.border,
                                },
                            ]}
                            placeholder="175"
                            placeholderTextColor={theme.colors.textSecondary}
                            keyboardType="number-pad"
                            value={profile.height?.toString() || ''}
                            onChangeText={(text) => setProfile({ ...profile, height: parseInt(text) || undefined })}
                            editable={isEditing}
                        />
                    </View>
                </View>
            </View>

            {/* Goals */}
            <View style={[styles.section, { backgroundColor: theme.colors.surface }, shadows.sm]}>
                <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                    Daily Goals
                </Text>

                <View style={styles.inputGroup}>
                    <Text style={[styles.inputLabel, { color: theme.colors.textSecondary }]}>
                        Water Goal (ml)
                    </Text>
                    <TextInput
                        style={[
                            styles.input,
                            {
                                backgroundColor: theme.colors.surfaceVariant,
                                color: theme.colors.text,
                                borderColor: theme.colors.border,
                            },
                        ]}
                        placeholder="2500"
                        placeholderTextColor={theme.colors.textSecondary}
                        keyboardType="number-pad"
                        value={profile.goals.dailyWater.toString()}
                        onChangeText={(text) =>
                            setProfile({
                                ...profile,
                                goals: { ...profile.goals, dailyWater: parseInt(text) || 2500 }
                            })
                        }
                        editable={isEditing}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={[styles.inputLabel, { color: theme.colors.textSecondary }]}>
                        Calorie Goal
                    </Text>
                    <TextInput
                        style={[
                            styles.input,
                            {
                                backgroundColor: theme.colors.surfaceVariant,
                                color: theme.colors.text,
                                borderColor: theme.colors.border,
                            },
                        ]}
                        placeholder="2000"
                        placeholderTextColor={theme.colors.textSecondary}
                        keyboardType="number-pad"
                        value={profile.goals.dailyCalories.toString()}
                        onChangeText={(text) =>
                            setProfile({
                                ...profile,
                                goals: { ...profile.goals, dailyCalories: parseInt(text) || 2000 }
                            })
                        }
                        editable={isEditing}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={[styles.inputLabel, { color: theme.colors.textSecondary }]}>
                        Weekly Workouts Goal
                    </Text>
                    <TextInput
                        style={[
                            styles.input,
                            {
                                backgroundColor: theme.colors.surfaceVariant,
                                color: theme.colors.text,
                                borderColor: theme.colors.border,
                            },
                        ]}
                        placeholder="5"
                        placeholderTextColor={theme.colors.textSecondary}
                        keyboardType="number-pad"
                        value={profile.goals.weeklyWorkouts.toString()}
                        onChangeText={(text) =>
                            setProfile({
                                ...profile,
                                goals: { ...profile.goals, weeklyWorkouts: parseInt(text) || 5 }
                            })
                        }
                        editable={isEditing}
                    />
                </View>
            </View>

            {/* Preferences */}
            <View style={[styles.section, { backgroundColor: theme.colors.surface }, shadows.sm]}>
                <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                    Preferences
                </Text>

                <View style={styles.toggleRow}>
                    <View style={styles.toggleInfo}>
                        <Ionicons name={themeMode === 'dark' ? 'moon' : 'sunny'} size={22} color={theme.colors.primary} />
                        <Text style={[styles.toggleLabel, { color: theme.colors.text }]}>Dark Mode</Text>
                    </View>
                    <Switch
                        value={themeMode === 'dark'}
                        onValueChange={toggleTheme}
                        trackColor={{ false: theme.colors.border, true: theme.colors.primary + '50' }}
                        thumbColor={themeMode === 'dark' ? theme.colors.primary : theme.colors.surfaceVariant}
                    />
                </View>

                <View style={styles.toggleRow}>
                    <View style={styles.toggleInfo}>
                        <Ionicons name="water" size={22} color={theme.colors.water} />
                        <Text style={[styles.toggleLabel, { color: theme.colors.text }]}>Water Reminders</Text>
                    </View>
                    <Switch
                        value={profile.notifications.waterReminders}
                        onValueChange={handleToggleWaterReminders}
                        trackColor={{ false: theme.colors.border, true: theme.colors.water + '50' }}
                        thumbColor={profile.notifications.waterReminders ? theme.colors.water : theme.colors.surfaceVariant}
                    />
                </View>

                <View style={styles.toggleRow}>
                    <View style={styles.toggleInfo}>
                        <Ionicons name="barbell" size={22} color={theme.colors.workout} />
                        <Text style={[styles.toggleLabel, { color: theme.colors.text }]}>Workout Reminders</Text>
                    </View>
                    <Switch
                        value={profile.notifications.workoutReminders}
                        onValueChange={handleToggleWorkoutReminders}
                        trackColor={{ false: theme.colors.border, true: theme.colors.workout + '50' }}
                        thumbColor={profile.notifications.workoutReminders ? theme.colors.workout : theme.colors.surfaceVariant}
                    />
                </View>
            </View>

            {/* Danger Zone */}
            <View style={[styles.section, { backgroundColor: theme.colors.surface }, shadows.sm]}>
                <Text style={[styles.sectionTitle, { color: theme.colors.error }]}>
                    Danger Zone
                </Text>
                <TouchableOpacity
                    style={[styles.dangerButton, { borderColor: theme.colors.error }]}
                    onPress={handleClearData}
                >
                    <Ionicons name="trash-outline" size={20} color={theme.colors.error} />
                    <Text style={[styles.dangerButtonText, { color: theme.colors.error }]}>
                        Clear All Data
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        padding: spacing.md,
        paddingBottom: spacing.xxl,
    },
    profileHeader: {
        alignItems: 'center',
        padding: spacing.xl,
        borderRadius: borderRadius.lg,
        marginBottom: spacing.md,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.md,
    },
    avatarText: {
        fontSize: 32,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    userName: {
        ...typography.h2,
        marginBottom: spacing.sm,
    },
    streakInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.full,
        gap: 4,
    },
    streakText: {
        ...typography.bodySmall,
        fontWeight: '600',
    },
    section: {
        padding: spacing.lg,
        borderRadius: borderRadius.lg,
        marginBottom: spacing.md,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    sectionTitle: {
        ...typography.h3,
    },
    editButton: {
        ...typography.body,
        fontWeight: '600',
    },
    inputGroup: {
        marginBottom: spacing.md,
    },
    inputLabel: {
        ...typography.caption,
        marginBottom: spacing.xs,
    },
    input: {
        ...typography.body,
        padding: spacing.md,
        borderRadius: borderRadius.md,
        borderWidth: 1,
    },
    rowInputs: {
        flexDirection: 'row',
        gap: spacing.md,
    },
    toggleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: spacing.sm,
    },
    toggleInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
    },
    toggleLabel: {
        ...typography.body,
    },
    dangerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.md,
        borderRadius: borderRadius.md,
        borderWidth: 1.5,
        gap: spacing.sm,
    },
    dangerButtonText: {
        ...typography.button,
    },
});
