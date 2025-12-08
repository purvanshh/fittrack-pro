import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import AddMealModal from '../../components/AddMealModal';
import AddWorkoutModal from '../../components/AddWorkoutModal';
import ProgressRing from '../../components/ProgressRing';
import QuickActionButton from '../../components/QuickActionButton';
import StatCard from '../../components/StatCard';
import { borderRadius, shadows, spacing, typography } from '../../constants/theme';
import { useTheme } from '../../context/ThemeContext';
import { DailyStats, Meal, UserProfile, Workout } from '../../types';
import { formatDateLong, formatWater, generateId, getCurrentTime, getToday } from '../../utils/dateUtils';
import {
    getDailyStats,
    getProfile,
    saveMeal,
    saveWaterIntake,
    saveWorkout
} from '../../utils/storage';

export default function DashboardScreen() {
    const { theme } = useTheme();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [stats, setStats] = useState<DailyStats | null>(null);
    const [refreshing, setRefreshing] = useState(false);
    const [showWorkoutModal, setShowWorkoutModal] = useState(false);
    const [showMealModal, setShowMealModal] = useState(false);

    const loadData = async () => {
        const [profileData, statsData] = await Promise.all([
            getProfile(),
            getDailyStats(getToday()),
        ]);
        setProfile(profileData);
        setStats(statsData);
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

    const handleAddWorkout = async (workout: Workout) => {
        await saveWorkout(workout);
        await loadData();
    };

    const handleAddMeal = async (meal: Meal) => {
        await saveMeal(meal);
        await loadData();
    };

    const handleQuickWater = async () => {
        await saveWaterIntake({
            id: generateId(),
            amount: 250,
            date: getToday(),
            time: getCurrentTime(),
        });
        await loadData();
    };

    const waterProgress = (stats?.totalWater || 0) / (profile?.goals.dailyWater || 2500);
    const calorieProgress = (stats?.totalCalories || 0) / (profile?.goals.dailyCalories || 2000);
    const workoutProgress = (stats?.workoutCount || 0) / Math.ceil((profile?.goals.weeklyWorkouts || 5) / 7);

    return (
        <ScrollView
            style={[styles.container, { backgroundColor: theme.colors.background }]}
            contentContainerStyle={styles.content}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
        >
            {/* Date Header */}
            <View style={styles.dateHeader}>
                <Text style={[styles.dateText, { color: theme.colors.textSecondary }]}>
                    {formatDateLong(getToday())}
                </Text>
                {profile && profile.streak > 0 && (
                    <View style={[styles.streakBadge, { backgroundColor: theme.colors.accent + '20' }]}>
                        <Ionicons name="flame" size={16} color={theme.colors.accent} />
                        <Text style={[styles.streakText, { color: theme.colors.accent }]}>
                            {profile.streak} day streak
                        </Text>
                    </View>
                )}
            </View>

            {/* Progress Rings */}
            <View style={[styles.progressSection, { backgroundColor: theme.colors.surface }, shadows.md]}>
                <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                    Today's Progress
                </Text>
                <View style={styles.ringsContainer}>
                    <View style={styles.ringWrapper}>
                        <ProgressRing
                            progress={waterProgress}
                            color={theme.colors.water}
                            label="Water"
                            value={formatWater(stats?.totalWater || 0)}
                            size={100}
                        />
                    </View>
                    <View style={styles.ringWrapper}>
                        <ProgressRing
                            progress={calorieProgress}
                            color={theme.colors.calories}
                            label="Calories"
                            value={`${stats?.totalCalories || 0}`}
                            size={100}
                        />
                    </View>
                    <View style={styles.ringWrapper}>
                        <ProgressRing
                            progress={Math.min(workoutProgress, 1)}
                            color={theme.colors.workout}
                            label="Workout"
                            value={`${stats?.workoutCount || 0}`}
                            size={100}
                        />
                    </View>
                </View>
            </View>

            {/* Quick Actions */}
            <Text style={[styles.sectionTitle, { color: theme.colors.text, marginTop: spacing.lg }]}>
                Quick Actions
            </Text>
            <View style={styles.quickActions}>
                <QuickActionButton
                    icon="barbell-outline"
                    label="Add Workout"
                    color={theme.colors.workout}
                    onPress={() => setShowWorkoutModal(true)}
                    style={styles.actionButton}
                />
                <QuickActionButton
                    icon="water-outline"
                    label="Add Water"
                    color={theme.colors.water}
                    onPress={handleQuickWater}
                    style={styles.actionButton}
                />
                <QuickActionButton
                    icon="restaurant-outline"
                    label="Add Meal"
                    color={theme.colors.calories}
                    onPress={() => setShowMealModal(true)}
                    style={styles.actionButton}
                />
            </View>

            {/* Today's Stats */}
            <Text style={[styles.sectionTitle, { color: theme.colors.text, marginTop: spacing.lg }]}>
                Summary
            </Text>
            <View style={styles.statsGrid}>
                <StatCard
                    icon="water"
                    iconColor={theme.colors.water}
                    title="Water Intake"
                    value={formatWater(stats?.totalWater || 0)}
                    subtitle={`Goal: ${formatWater(profile?.goals.dailyWater || 2500)}`}
                    style={styles.statCard}
                />
                <StatCard
                    icon="flame"
                    iconColor={theme.colors.calories}
                    title="Calories"
                    value={`${stats?.totalCalories || 0}`}
                    subtitle={`Goal: ${profile?.goals.dailyCalories || 2000}`}
                    style={styles.statCard}
                />
                <StatCard
                    icon="barbell"
                    iconColor={theme.colors.workout}
                    title="Workouts"
                    value={stats?.workoutCount || 0}
                    subtitle={`${stats?.totalWorkoutMinutes || 0} min total`}
                    style={styles.statCard}
                />
            </View>

            {/* Weekly Report Button */}
            <TouchableOpacity
                style={[
                    styles.weeklyReportButton,
                    { backgroundColor: theme.colors.primary },
                    shadows.md,
                ]}
                onPress={() => router.push('/weekly-report')}
            >
                <Ionicons name="stats-chart" size={20} color="#FFFFFF" />
                <Text style={styles.weeklyReportText}>View Weekly Report</Text>
                <Ionicons name="chevron-forward" size={20} color="#FFFFFF" />
            </TouchableOpacity>

            {/* Modals */}
            <AddWorkoutModal
                visible={showWorkoutModal}
                onClose={() => setShowWorkoutModal(false)}
                onSave={handleAddWorkout}
            />
            <AddMealModal
                visible={showMealModal}
                onClose={() => setShowMealModal(false)}
                onSave={handleAddMeal}
            />
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
    dateHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    dateText: {
        ...typography.body,
    },
    streakBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.full,
        gap: 4,
    },
    streakText: {
        ...typography.caption,
        fontWeight: '600',
    },
    progressSection: {
        padding: spacing.lg,
        borderRadius: borderRadius.lg,
    },
    sectionTitle: {
        ...typography.h3,
        marginBottom: spacing.md,
    },
    ringsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    ringWrapper: {
        alignItems: 'center',
    },
    quickActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: spacing.sm,
    },
    actionButton: {
        flex: 1,
    },
    statsGrid: {
        gap: spacing.sm,
    },
    statCard: {
        marginBottom: 0,
    },
    weeklyReportButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.md,
        borderRadius: borderRadius.md,
        marginTop: spacing.lg,
        gap: spacing.sm,
    },
    weeklyReportText: {
        ...typography.button,
        color: '#FFFFFF',
        flex: 1,
        textAlign: 'center',
    },
});
