import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
    Alert,
    Keyboard,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { borderRadius, spacing, typography } from '../../constants/theme';
import { useTheme } from '../../context/ThemeContext';
import { DEFAULT_PROFILE, UserProfile } from '../../types';
import { cancelAllNotifications, updateNotificationSchedules } from '../../utils/notifications';
import { clearAllData, getProfile, saveProfile } from '../../utils/storage';

export default function ProfileScreen() {
    const { theme, themeMode, toggleTheme } = useTheme();
    const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
    const [editedProfile, setEditedProfile] = useState<UserProfile>(DEFAULT_PROFILE);
    const [refreshing, setRefreshing] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const loadData = async () => {
        const profileData = await getProfile();
        setProfile(profileData);
        setEditedProfile(profileData);
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

    const handleEdit = () => {
        setEditedProfile(profile);
        setIsEditing(true);
    };

    const handleSave = async () => {
        Keyboard.dismiss();
        await saveProfile(editedProfile);
        setProfile(editedProfile);
        setIsEditing(false);
        Alert.alert('Success', 'Your changes have been saved!');
    };

    const handleCancel = () => {
        Keyboard.dismiss();
        setEditedProfile(profile);
        setIsEditing(false);
    };

    const handleToggleWaterReminders = async (value: boolean) => {
        const updated = {
            ...profile,
            notifications: { ...profile.notifications, waterReminders: value },
        };
        setProfile(updated);
        setEditedProfile(updated);
        await saveProfile(updated);
        await updateNotificationSchedules(updated.notifications);
    };

    const handleToggleWorkoutReminders = async (value: boolean) => {
        const updated = {
            ...profile,
            notifications: { ...profile.notifications, workoutReminders: value },
        };
        setProfile(updated);
        setEditedProfile(updated);
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
                        setEditedProfile(DEFAULT_PROFILE);
                    },
                },
            ]
        );
    };

    const currentProfile = isEditing ? editedProfile : profile;

    return (
        <ScrollView
            style={[styles.container, { backgroundColor: theme.colors.background }]}
            contentContainerStyle={styles.content}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            keyboardShouldPersistTaps="handled"
        >
            {/* Profile Header */}
            <View style={[styles.profileHeader, { backgroundColor: theme.colors.primary }]}>
                <View style={[styles.avatar, { backgroundColor: 'rgba(0,0,0,0.2)' }]}>
                    <Text style={styles.avatarText}>
                        {currentProfile.name ? currentProfile.name[0].toUpperCase() : 'U'}
                    </Text>
                </View>
                <Text style={styles.headerName}>
                    {currentProfile.name || 'Your Name'}
                </Text>
                <View style={styles.streakInfo}>
                    <Ionicons name="flame" size={16} color="rgba(0,0,0,0.6)" />
                    <Text style={styles.streakText}>
                        {profile.streak} day streak
                    </Text>
                </View>
            </View>

            {/* Edit/Save Buttons */}
            <View style={styles.buttonRow}>
                {isEditing ? (
                    <>
                        <TouchableOpacity
                            style={[styles.actionButton, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
                            onPress={handleCancel}
                        >
                            <Ionicons name="close" size={20} color={theme.colors.textSecondary} />
                            <Text style={[styles.actionButtonText, { color: theme.colors.textSecondary }]}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.actionButton, { backgroundColor: theme.colors.success }]}
                            onPress={handleSave}
                        >
                            <Ionicons name="checkmark" size={20} color="#FFFFFF" />
                            <Text style={[styles.actionButtonText, { color: '#FFFFFF' }]}>Save Changes</Text>
                        </TouchableOpacity>
                    </>
                ) : (
                    <TouchableOpacity
                        style={[styles.actionButton, styles.editButton, { backgroundColor: theme.colors.primary }]}
                        onPress={handleEdit}
                    >
                        <Ionicons name="pencil" size={20} color="#000000" />
                        <Text style={[styles.actionButtonText, { color: '#000000' }]}>Edit Profile & Goals</Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* Daily Goals */}
            <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
                <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                    Daily Goals
                </Text>

                {/* Water Goal */}
                <View style={[styles.goalCard, { backgroundColor: theme.colors.water + '20' }]}>
                    <View style={[styles.goalIcon, { backgroundColor: theme.colors.water + '30' }]}>
                        <Ionicons name="water" size={24} color={theme.colors.water} />
                    </View>
                    <View style={styles.goalContent}>
                        <Text style={[styles.goalLabel, { color: theme.colors.textSecondary }]}>
                            Daily Water Goal
                        </Text>
                        {isEditing ? (
                            <View style={styles.goalInputRow}>
                                <TextInput
                                    style={[styles.goalInput, { color: theme.colors.text, backgroundColor: theme.colors.background }]}
                                    keyboardType="number-pad"
                                    value={editedProfile.goals.dailyWater.toString()}
                                    onChangeText={(text) => {
                                        const value = parseInt(text) || 0;
                                        setEditedProfile({
                                            ...editedProfile,
                                            goals: { ...editedProfile.goals, dailyWater: value },
                                        });
                                    }}
                                />
                                <Text style={[styles.goalUnit, { color: theme.colors.textSecondary }]}>ml</Text>
                            </View>
                        ) : (
                            <Text style={[styles.goalValue, { color: theme.colors.text }]}>
                                {profile.goals.dailyWater} ml
                            </Text>
                        )}
                    </View>
                </View>

                {/* Calorie Goal */}
                <View style={[styles.goalCard, { backgroundColor: theme.colors.calories + '20' }]}>
                    <View style={[styles.goalIcon, { backgroundColor: theme.colors.calories + '30' }]}>
                        <Ionicons name="flame" size={24} color={theme.colors.calories} />
                    </View>
                    <View style={styles.goalContent}>
                        <Text style={[styles.goalLabel, { color: theme.colors.textSecondary }]}>
                            Daily Calorie Goal
                        </Text>
                        {isEditing ? (
                            <View style={styles.goalInputRow}>
                                <TextInput
                                    style={[styles.goalInput, { color: theme.colors.text, backgroundColor: theme.colors.background }]}
                                    keyboardType="number-pad"
                                    value={editedProfile.goals.dailyCalories.toString()}
                                    onChangeText={(text) => {
                                        const value = parseInt(text) || 0;
                                        setEditedProfile({
                                            ...editedProfile,
                                            goals: { ...editedProfile.goals, dailyCalories: value },
                                        });
                                    }}
                                />
                                <Text style={[styles.goalUnit, { color: theme.colors.textSecondary }]}>kcal</Text>
                            </View>
                        ) : (
                            <Text style={[styles.goalValue, { color: theme.colors.text }]}>
                                {profile.goals.dailyCalories} kcal
                            </Text>
                        )}
                    </View>
                </View>

                {/* Workout Goal */}
                <View style={[styles.goalCard, { backgroundColor: theme.colors.workout + '20' }]}>
                    <View style={[styles.goalIcon, { backgroundColor: theme.colors.workout + '30' }]}>
                        <Ionicons name="barbell" size={24} color={theme.colors.workout} />
                    </View>
                    <View style={styles.goalContent}>
                        <Text style={[styles.goalLabel, { color: theme.colors.textSecondary }]}>
                            Weekly Workouts Goal
                        </Text>
                        {isEditing ? (
                            <View style={styles.goalInputRow}>
                                <TextInput
                                    style={[styles.goalInput, { color: theme.colors.text, backgroundColor: theme.colors.background }]}
                                    keyboardType="number-pad"
                                    value={editedProfile.goals.weeklyWorkouts.toString()}
                                    onChangeText={(text) => {
                                        const value = parseInt(text) || 0;
                                        setEditedProfile({
                                            ...editedProfile,
                                            goals: { ...editedProfile.goals, weeklyWorkouts: value },
                                        });
                                    }}
                                />
                                <Text style={[styles.goalUnit, { color: theme.colors.textSecondary }]}>per week</Text>
                            </View>
                        ) : (
                            <Text style={[styles.goalValue, { color: theme.colors.text }]}>
                                {profile.goals.weeklyWorkouts} per week
                            </Text>
                        )}
                    </View>
                </View>
            </View>

            {/* Personal Details */}
            <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
                <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                    Personal Details
                </Text>

                {/* Name */}
                <View style={styles.detailRow}>
                    <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>Name</Text>
                    {isEditing ? (
                        <TextInput
                            style={[styles.detailInput, { color: theme.colors.text, backgroundColor: theme.colors.background }]}
                            placeholder="Your Name"
                            placeholderTextColor={theme.colors.textSecondary}
                            value={editedProfile.name}
                            onChangeText={(text) => setEditedProfile({ ...editedProfile, name: text })}
                        />
                    ) : (
                        <Text style={[styles.detailValue, { color: theme.colors.text }]}>
                            {profile.name || 'Not set'}
                        </Text>
                    )}
                </View>

                {/* Weight */}
                <View style={styles.detailRow}>
                    <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>Weight</Text>
                    {isEditing ? (
                        <View style={styles.detailInputRow}>
                            <TextInput
                                style={[styles.detailInputSmall, { color: theme.colors.text, backgroundColor: theme.colors.background }]}
                                placeholder="70"
                                placeholderTextColor={theme.colors.textSecondary}
                                keyboardType="number-pad"
                                value={editedProfile.weight?.toString() || ''}
                                onChangeText={(text) => setEditedProfile({ ...editedProfile, weight: parseInt(text) || undefined })}
                            />
                            <Text style={[styles.detailUnit, { color: theme.colors.textSecondary }]}>kg</Text>
                        </View>
                    ) : (
                        <Text style={[styles.detailValue, { color: theme.colors.text }]}>
                            {profile.weight ? `${profile.weight} kg` : 'Not set'}
                        </Text>
                    )}
                </View>

                {/* Height */}
                <View style={styles.detailRow}>
                    <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>Height</Text>
                    {isEditing ? (
                        <View style={styles.detailInputRow}>
                            <TextInput
                                style={[styles.detailInputSmall, { color: theme.colors.text, backgroundColor: theme.colors.background }]}
                                placeholder="175"
                                placeholderTextColor={theme.colors.textSecondary}
                                keyboardType="number-pad"
                                value={editedProfile.height?.toString() || ''}
                                onChangeText={(text) => setEditedProfile({ ...editedProfile, height: parseInt(text) || undefined })}
                            />
                            <Text style={[styles.detailUnit, { color: theme.colors.textSecondary }]}>cm</Text>
                        </View>
                    ) : (
                        <Text style={[styles.detailValue, { color: theme.colors.text }]}>
                            {profile.height ? `${profile.height} cm` : 'Not set'}
                        </Text>
                    )}
                </View>
            </View>

            {/* Preferences */}
            <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
                <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                    Preferences
                </Text>

                <View style={styles.toggleRow}>
                    <View style={styles.toggleInfo}>
                        <View style={[styles.toggleIcon, { backgroundColor: theme.colors.primary + '20' }]}>
                            <Ionicons name={themeMode === 'dark' ? 'moon' : 'sunny'} size={20} color={theme.colors.primary} />
                        </View>
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
                        <View style={[styles.toggleIcon, { backgroundColor: theme.colors.water + '20' }]}>
                            <Ionicons name="water" size={20} color={theme.colors.water} />
                        </View>
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
                        <View style={[styles.toggleIcon, { backgroundColor: theme.colors.workout + '20' }]}>
                            <Ionicons name="barbell" size={20} color={theme.colors.workout} />
                        </View>
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
            <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
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
        paddingBottom: 120,
    },
    profileHeader: {
        alignItems: 'center',
        paddingTop: spacing.xl,
        paddingBottom: spacing.xl,
        paddingHorizontal: spacing.lg,
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
        color: '#000000',
    },
    headerName: {
        ...typography.h2,
        color: '#000000',
        marginBottom: spacing.sm,
    },
    streakInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    streakText: {
        ...typography.bodySmall,
        fontWeight: '600',
        color: 'rgba(0,0,0,0.6)',
    },
    buttonRow: {
        flexDirection: 'row',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.md,
        gap: spacing.sm,
    },
    actionButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.md,
        borderRadius: borderRadius.lg,
        gap: spacing.sm,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    editButton: {
        flex: 1,
    },
    actionButtonText: {
        ...typography.button,
    },
    section: {
        marginHorizontal: spacing.md,
        padding: spacing.lg,
        borderRadius: borderRadius.xl,
        marginBottom: spacing.md,
    },
    sectionTitle: {
        ...typography.h3,
        marginBottom: spacing.md,
    },
    goalCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
        borderRadius: borderRadius.lg,
        marginBottom: spacing.sm,
    },
    goalIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.md,
    },
    goalContent: {
        flex: 1,
    },
    goalLabel: {
        ...typography.caption,
        marginBottom: 4,
    },
    goalValue: {
        ...typography.h3,
        fontWeight: '700',
    },
    goalInputRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    goalInput: {
        ...typography.h3,
        fontWeight: '700',
        minWidth: 80,
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.sm,
    },
    goalUnit: {
        ...typography.body,
        marginLeft: spacing.xs,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(128,128,128,0.1)',
    },
    detailLabel: {
        ...typography.body,
    },
    detailValue: {
        ...typography.body,
        fontWeight: '600',
    },
    detailInput: {
        ...typography.body,
        fontWeight: '600',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.md,
        minWidth: 150,
        textAlign: 'right',
    },
    detailInputRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    detailInputSmall: {
        ...typography.body,
        fontWeight: '600',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.md,
        minWidth: 80,
        textAlign: 'right',
    },
    detailUnit: {
        ...typography.body,
        marginLeft: spacing.xs,
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
    toggleIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    toggleLabel: {
        ...typography.body,
    },
    dangerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.md,
        borderRadius: borderRadius.lg,
        borderWidth: 1.5,
        gap: spacing.sm,
    },
    dangerButtonText: {
        ...typography.button,
    },
});
