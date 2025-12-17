import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
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
import GlassCard from '../../components/GlassCard';
import { borderRadius, glassStyles, gradients, shadows, spacing, typography } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { AVATAR_PRESETS, DEFAULT_PROFILE, UserProfile } from '../../types';
import { cancelAllNotifications, updateNotificationSchedules } from '../../utils/notifications';
import { clearAllData, getProfile, saveProfile } from '../../utils/storage';

export default function ProfileScreen() {
    const { theme } = useTheme();
    const { signOut, user } = useAuth();
    const isDark = theme.mode === 'dark';
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

    const handleToggleMealNotifications = async (value: boolean) => {
        const updated = {
            ...profile,
            notifications: { ...profile.notifications, mealNotifications: value },
        };
        setProfile(updated);
        setEditedProfile(updated);
        await saveProfile(updated);
    };

    const handleToggleStreakNotifications = async (value: boolean) => {
        const updated = {
            ...profile,
            notifications: { ...profile.notifications, streakNotifications: value },
        };
        setProfile(updated);
        setEditedProfile(updated);
        await saveProfile(updated);
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

    const handleSignOut = () => {
        Alert.alert(
            'Sign Out',
            'Are you sure you want to sign out?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Sign Out',
                    style: 'destructive',
                    onPress: async () => {
                        await signOut();
                    },
                },
            ]
        );
    };

    const currentProfile = isEditing ? editedProfile : profile;
    const currentAvatar = AVATAR_PRESETS.find(a => a.id === currentProfile.avatar) || AVATAR_PRESETS[6]; // Default to star
    const glassStyle = isDark ? glassStyles.dark : glassStyles.light;

    return (
        <View style={styles.wrapper}>
            {/* Gradient Background */}
            <LinearGradient
                colors={isDark ? gradients.darkBackground : gradients.lightBackground}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
            />

            {/* Decorative Gradient Orbs */}
            <View style={[styles.gradientOrb, styles.orbPrimary, { backgroundColor: theme.colors.primary }]} />
            <View style={[styles.gradientOrb, styles.orbSecondary, { backgroundColor: theme.colors.secondary }]} />
            <View style={[styles.gradientOrb, styles.orbAccent, { backgroundColor: theme.colors.accent }]} />

            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.content}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.primary} />
                }
                keyboardShouldPersistTaps="handled"
            >
                {/* Profile Header */}
                <GlassCard style={styles.profileHeader} variant="surface">
                    <View style={{ alignItems: 'center', width: '100%' }}>
                        <View style={[styles.avatar, shadows.glow(theme.colors.primary)]}>
                            <LinearGradient
                                colors={gradients.primary}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={StyleSheet.absoluteFill}
                            />
                            {profile.avatar ? (
                                <Text style={styles.avatarEmoji}>
                                    {AVATAR_PRESETS.find(p => p.id === profile.avatar)?.emoji || '👤'}
                                </Text>
                            ) : (
                                <Text style={styles.avatarEmoji}>👤</Text>
                            )}
                        </View>
                        <Text style={[styles.headerName, { color: theme.colors.text }]}>
                            {profile.name || 'User'}
                        </Text>
                        <Text style={[styles.headerEmail, { color: theme.colors.textSecondary }]}>
                            {user?.email || 'No email'}
                        </Text>

                        <View style={[styles.streakBadge, { backgroundColor: theme.colors.primary + '20' }]}>
                            <Ionicons name="flame" size={16} color={theme.colors.primary} />
                            <Text style={[styles.streakText, { color: theme.colors.primary }]}>
                                {profile.streak} Day Streak
                            </Text>
                        </View>
                    </View>
                </GlassCard>

                {/* Avatar Selection (Edit Mode) */}
                {isEditing && (
                    <GlassCard style={styles.section} variant="card">
                        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                            Choose Avatar
                        </Text>
                        <View style={styles.avatarGrid}>
                            {AVATAR_PRESETS.map((preset) => {
                                const isSelected = editedProfile.avatar === preset.id;
                                return (
                                    <TouchableOpacity
                                        key={preset.id}
                                        style={[
                                            styles.avatarOption,
                                            { backgroundColor: isSelected ? theme.colors.primary + '25' : theme.colors.surface + '40' },
                                            isSelected && [
                                                styles.avatarOptionSelected,
                                                { borderColor: theme.colors.primary },
                                            ],
                                        ]}
                                        onPress={() => setEditedProfile({ ...editedProfile, avatar: preset.id })}
                                    >
                                        {isSelected && (
                                            <LinearGradient
                                                colors={[theme.colors.primary + '40', theme.colors.primary + '20']}
                                                style={StyleSheet.absoluteFill}
                                            />
                                        )}
                                        <Text style={styles.avatarOptionEmoji}>{preset.emoji}</Text>
                                        <Text style={[styles.avatarOptionLabel, { color: isSelected ? theme.colors.primary : theme.colors.textSecondary }]}>
                                            {preset.label}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </GlassCard>
                )}

                {/* Edit/Save Buttons */}
                <View style={styles.buttonRow}>
                    {isEditing ? (
                        <>
                            <TouchableOpacity
                                style={[styles.actionButton, glassStyle.card, shadows.glass]}
                                onPress={handleCancel}
                            >
                                <Ionicons name="close" size={20} color={theme.colors.textSecondary} />
                                <Text style={[styles.actionButtonText, { color: theme.colors.textSecondary }]}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[
                                    styles.actionButton,
                                    styles.saveButton,
                                    { backgroundColor: theme.colors.success }
                                ]}
                                onPress={handleSave}
                            >
                                <Ionicons name="checkmark" size={20} color="#FFFFFF" />
                                <Text style={[styles.actionButtonText, { color: '#FFFFFF' }]}>Save</Text>
                            </TouchableOpacity>
                        </>
                    ) : (
                        <TouchableOpacity
                            style={[
                                styles.actionButton,
                                styles.editButton,
                                styles.primaryButton,
                                { backgroundColor: theme.colors.primary }
                            ]}
                            onPress={handleEdit}
                        >
                            <Ionicons name="pencil" size={20} color="#000000" />
                            <Text style={[styles.actionButtonText, { color: '#000000' }]}>Edit Profile & Goals</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {/* Daily Goals */}
                <GlassCard style={styles.section} variant="card">
                    <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                        Daily Goals
                    </Text>

                    {/* Water Goal */}
                    <View style={[styles.goalCard, { backgroundColor: theme.colors.water + '15' }]}>
                        <View style={[styles.goalIcon, { backgroundColor: theme.colors.water + '25' }]}>
                            <Ionicons name="water" size={24} color={theme.colors.water} />
                        </View>
                        <View style={styles.goalContent}>
                            <Text style={[styles.goalLabel, { color: theme.colors.textSecondary }]}>
                                Daily Water Goal
                            </Text>
                            {isEditing ? (
                                <View style={styles.goalInputRow}>
                                    <TextInput
                                        style={[styles.goalInput, { color: theme.colors.text, backgroundColor: theme.colors.background + '80' }]}
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
                    <View style={[styles.goalCard, { backgroundColor: theme.colors.calories + '15' }]}>
                        <View style={[styles.goalIcon, { backgroundColor: theme.colors.calories + '25' }]}>
                            <Ionicons name="flame" size={24} color={theme.colors.calories} />
                        </View>
                        <View style={styles.goalContent}>
                            <Text style={[styles.goalLabel, { color: theme.colors.textSecondary }]}>
                                Daily Calorie Goal
                            </Text>
                            {isEditing ? (
                                <View style={styles.goalInputRow}>
                                    <TextInput
                                        style={[styles.goalInput, { color: theme.colors.text, backgroundColor: theme.colors.background + '80' }]}
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
                    <View style={[styles.goalCard, { backgroundColor: theme.colors.workout + '15' }]}>
                        <View style={[styles.goalIcon, { backgroundColor: theme.colors.workout + '25' }]}>
                            <Ionicons name="barbell" size={24} color={theme.colors.workout} />
                        </View>
                        <View style={styles.goalContent}>
                            <Text style={[styles.goalLabel, { color: theme.colors.textSecondary }]}>
                                Weekly Workouts Goal
                            </Text>
                            {isEditing ? (
                                <View style={styles.goalInputRow}>
                                    <TextInput
                                        style={[styles.goalInput, { color: theme.colors.text, backgroundColor: theme.colors.background + '80' }]}
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

                    {/* Step Goal */}
                    <View style={[styles.goalCard, { backgroundColor: theme.colors.primary + '15' }]}>
                        <View style={[styles.goalIcon, { backgroundColor: theme.colors.primary + '25' }]}>
                            <Ionicons name="walk" size={24} color={theme.colors.primary} />
                        </View>
                        <View style={styles.goalContent}>
                            <Text style={[styles.goalLabel, { color: theme.colors.textSecondary }]}>
                                Daily Steps Goal
                            </Text>
                            {isEditing ? (
                                <View style={styles.goalInputRow}>
                                    <TextInput
                                        style={[styles.goalInput, { color: theme.colors.text, backgroundColor: theme.colors.background + '80' }]}
                                        keyboardType="number-pad"
                                        value={editedProfile.goals.dailySteps?.toString() || '10000'}
                                        onChangeText={(text) => {
                                            const value = parseInt(text) || 0;
                                            setEditedProfile({
                                                ...editedProfile,
                                                goals: { ...editedProfile.goals, dailySteps: value },
                                            });
                                        }}
                                    />
                                    <Text style={[styles.goalUnit, { color: theme.colors.textSecondary }]}>steps</Text>
                                </View>
                            ) : (
                                <Text style={[styles.goalValue, { color: theme.colors.text }]}>
                                    {profile.goals.dailySteps || 10000} steps
                                </Text>
                            )}
                        </View>
                    </View>
                </GlassCard>

                {/* Personal Details */}
                <GlassCard style={styles.section} variant="card">
                    <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                        Personal Details
                    </Text>

                    {/* Name */}
                    <View style={[styles.detailRow, { borderBottomColor: theme.colors.border + '30' }]}>
                        <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>Name</Text>
                        {isEditing ? (
                            <TextInput
                                style={[styles.detailInput, { color: theme.colors.text, backgroundColor: theme.colors.background + '80' }]}
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
                    <View style={[styles.detailRow, { borderBottomColor: theme.colors.border + '30' }]}>
                        <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>Weight</Text>
                        {isEditing ? (
                            <View style={styles.detailInputRow}>
                                <TextInput
                                    style={[styles.detailInputSmall, { color: theme.colors.text, backgroundColor: theme.colors.background + '80' }]}
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
                    <View style={[styles.detailRow, { borderBottomColor: 'transparent' }]}>
                        <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>Height</Text>
                        {isEditing ? (
                            <View style={styles.detailInputRow}>
                                <TextInput
                                    style={[styles.detailInputSmall, { color: theme.colors.text, backgroundColor: theme.colors.background + '80' }]}
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
                </GlassCard>

                {/* Preferences */}
                <GlassCard style={styles.section} variant="card">
                    <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                        Notifications
                    </Text>

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

                    <View style={styles.toggleRow}>
                        <View style={styles.toggleInfo}>
                            <View style={[styles.toggleIcon, { backgroundColor: theme.colors.calories + '20' }]}>
                                <Ionicons name="restaurant" size={20} color={theme.colors.calories} />
                            </View>
                            <Text style={[styles.toggleLabel, { color: theme.colors.text }]}>Meal Goal Notifications</Text>
                        </View>
                        <Switch
                            value={profile.notifications.mealNotifications}
                            onValueChange={handleToggleMealNotifications}
                            trackColor={{ false: theme.colors.border, true: theme.colors.calories + '50' }}
                            thumbColor={profile.notifications.mealNotifications ? theme.colors.calories : theme.colors.surfaceVariant}
                        />
                    </View>

                    <View style={styles.toggleRow}>
                        <View style={styles.toggleInfo}>
                            <View style={[styles.toggleIcon, { backgroundColor: theme.colors.primary + '20' }]}>
                                <Ionicons name="flame" size={20} color={theme.colors.primary} />
                            </View>
                            <Text style={[styles.toggleLabel, { color: theme.colors.text }]}>Streak Notifications</Text>
                        </View>
                        <Switch
                            value={profile.notifications.streakNotifications}
                            onValueChange={handleToggleStreakNotifications}
                            trackColor={{ false: theme.colors.border, true: theme.colors.primary + '50' }}
                            thumbColor={profile.notifications.streakNotifications ? theme.colors.primary : theme.colors.surfaceVariant}
                        />
                    </View>
                </GlassCard>

                {/* Danger Zone */}
                <GlassCard style={styles.section} variant="card">
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
                </GlassCard>

                {/* Sign Out */}
                <GlassCard style={styles.section} variant="card">
                    <TouchableOpacity
                        style={[styles.signOutButton, glassStyle.card]}
                        onPress={handleSignOut}
                    >
                        <Ionicons name="log-out-outline" size={22} color={theme.colors.textSecondary} />
                        <Text style={[styles.signOutButtonText, { color: theme.colors.textSecondary }]}>
                            Sign Out
                        </Text>
                    </TouchableOpacity>
                </GlassCard>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
    },
    container: {
        flex: 1,
    },
    content: {
        paddingTop: 100,
        paddingBottom: 140,
    },
    // Decorative gradient orbs
    gradientOrb: {
        position: 'absolute',
        borderRadius: 200,
        opacity: 0.15,
    },
    orbPrimary: {
        width: 300,
        height: 300,
        top: -100,
        right: -100,
    },
    orbSecondary: {
        width: 250,
        height: 250,
        bottom: 200,
        left: -100,
    },
    orbAccent: {
        width: 200,
        height: 200,
        bottom: -50,
        right: -50,
    },
    profileHeader: {
        alignItems: 'center',
        marginHorizontal: spacing.md,
        paddingVertical: spacing.xl,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.md,
        overflow: 'hidden',
        alignSelf: 'center',
    },
    avatarEmoji: {
        fontSize: 48,
    },
    headerName: {
        ...typography.h2,
        marginBottom: spacing.xs,
        textAlign: 'center',
    },
    headerEmail: {
        ...typography.bodySmall,
        marginBottom: spacing.sm,
        textAlign: 'center',
    },
    streakBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.full,
        gap: spacing.xs,
    },
    streakText: {
        ...typography.bodySmall,
        fontWeight: '600',
    },
    avatarGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.sm,
        justifyContent: 'center',
    },
    avatarOption: {
        width: 72,
        height: 80,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: borderRadius.lg,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    avatarOptionSelected: {
        borderWidth: 2,
    },
    avatarOptionEmoji: {
        fontSize: 28,
        marginBottom: 2,
    },
    avatarOptionLabel: {
        ...typography.caption,
        fontSize: 10,
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
    },
    editButton: {
        flex: 1,
    },
    saveButton: {
        shadowColor: '#4CAF50',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 3,
    },
    primaryButton: {
        shadowColor: '#00D4AA',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 3,
    },
    actionButtonText: {
        ...typography.button,
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.sm,
        zIndex: 1,
    },
    section: {
        marginHorizontal: spacing.md,
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
    signOutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.md,
        borderRadius: borderRadius.lg,
        gap: spacing.sm,
    },
    signOutButtonText: {
        ...typography.button,
    },
});
