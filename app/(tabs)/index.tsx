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
import CalendarWeek from '../../components/CalendarWeek';
import OvalProgress from '../../components/OvalProgress';
import QuickActionButton from '../../components/QuickActionButton';
import { borderRadius, spacing, typography } from '../../constants/theme';
import { useTheme } from '../../context/ThemeContext';
import { DailyStats, Meal, UserProfile, Workout } from '../../types';
import { generateId, getCurrentTime, getToday } from '../../utils/dateUtils';
import {
    getDailyStats,
    getProfile,
    getTodayMeals,
    getTodayWater,
    getTodayWorkouts,
    saveMeal,
    saveWaterIntake,
    saveWorkout
} from '../../utils/storage';

export default function DashboardScreen() {
    const { theme } = useTheme();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [stats, setStats] = useState<DailyStats | null>(null);
    const [activeDays, setActiveDays] = useState<string[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const [showWorkoutModal, setShowWorkoutModal] = useState(false);
    const [showMealModal, setShowMealModal] = useState(false);

    const loadData = async () => {
        const [profileData, statsData, workouts, meals, water] = await Promise.all([
            getProfile(),
            getDailyStats(getToday()),
            getTodayWorkouts(),
            getTodayMeals(),
            getTodayWater(),
        ]);
        setProfile(profileData);
        setStats(statsData);

        // Determine active days (days with any activity)
        const today = getToday();
        const active: string[] = [];
        if (workouts.length > 0 || meals.length > 0 || water.length > 0) {
            active.push(today);
        }
        setActiveDays(active);
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

    const waterGoal = profile?.goals.dailyWater || 2500;
    const calorieGoal = profile?.goals.dailyCalories || 2000;
    const workoutGoal = profile?.goals.weeklyWorkouts || 5;

    return (
        <ScrollView
            style={[styles.container, { backgroundColor: theme.colors.background }]}
            contentContainerStyle={styles.content}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
        >
            {/* Header with Greeting */}
            <View style={styles.header}>
                <View>
                    <Text style={[styles.greeting, { color: theme.colors.text }]}>
                        {profile?.name ? `Hi ${profile.name}` : 'Your Activity'}
                    </Text>
                    {profile && profile.streak > 0 && (
                        <View style={styles.streakRow}>
                            <Ionicons name="flash" size={14} color={theme.colors.primary} />
                            <Text style={[styles.streakLabel, { color: theme.colors.primary }]}>
                                {profile.streak} day streak
                            </Text>
                        </View>
                    )}
                </View>
                <TouchableOpacity
                    style={[styles.menuButton, { backgroundColor: theme.colors.surfaceVariant }]}
                    onPress={() => router.push('/profile')}
                >
                    <Ionicons name="grid-outline" size={20} color={theme.colors.text} />
                </TouchableOpacity>
            </View>

            {/* Calendar Week */}
            <CalendarWeek
                currentDate={getToday()}
                activeDays={activeDays}
            />

            {/* Challenge / Goals Card */}
            <TouchableOpacity
                style={[styles.challengeCard, { backgroundColor: theme.colors.primary }]}
                onPress={() => router.push('/profile')}
                activeOpacity={0.9}
            >
                <View style={styles.challengeContent}>
                    <Text style={styles.challengeTitle}>Today's Challenge</Text>
                    <Text style={styles.challengeSubtitle}>
                        Hit your daily goals before midnight!
                    </Text>
                </View>
                <View style={styles.challengeBadge}>
                    <Ionicons name="trophy" size={32} color="rgba(0,0,0,0.3)" />
                </View>
            </TouchableOpacity>

            {/* Progress Indicators Section */}
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                Today's Progress
            </Text>
            <View style={styles.progressRow}>
                <View style={[styles.progressCard, { backgroundColor: theme.colors.surface }]}>
                    <OvalProgress
                        type="water"
                        current={stats?.totalWater || 0}
                        goal={waterGoal}
                        size={90}
                    />
                </View>
                <View style={[styles.progressCard, { backgroundColor: theme.colors.surface }]}>
                    <OvalProgress
                        type="calories"
                        current={stats?.totalCalories || 0}
                        goal={calorieGoal}
                        size={90}
                    />
                </View>
                <View style={[styles.progressCard, { backgroundColor: theme.colors.surface }]}>
                    <OvalProgress
                        type="workout"
                        current={stats?.workoutCount || 0}
                        goal={Math.ceil(workoutGoal / 7)}
                        size={90}
                    />
                </View>
            </View>

            {/* Stats Cards */}
            <View style={styles.statsRow}>
                {/* Steps/Activity Card - Lavender */}
                <View style={[styles.statCard, { backgroundColor: theme.colors.secondary }]}>
                    <View style={styles.statHeader}>
                        <Text style={styles.statTitle}>Workouts</Text>
                        <Ionicons name="fitness" size={20} color="rgba(0,0,0,0.5)" />
                    </View>
                    <Text style={styles.statValue}>{stats?.workoutCount || 0}</Text>
                    <Text style={styles.statLabel}>today</Text>
                </View>

                {/* Goals Card - Pink */}
                <View style={[styles.statCard, { backgroundColor: theme.colors.accent }]}>
                    <View style={styles.statHeader}>
                        <Text style={styles.statTitle}>My Goals</Text>
                    </View>
                    <Text style={styles.statSubtext}>Keep it up!</Text>
                    <View style={styles.goalProgress}>
                        <View
                            style={[
                                styles.goalRing,
                                { borderColor: 'rgba(0,0,0,0.2)' }
                            ]}
                        >
                            <Text style={styles.goalPercent}>
                                {Math.round(((stats?.totalWater || 0) / waterGoal) * 100)}%
                            </Text>
                        </View>
                    </View>
                </View>
            </View>

            {/* Quick Actions */}
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                Quick Actions
            </Text>
            <View style={styles.quickActions}>
                <QuickActionButton
                    icon="barbell-outline"
                    label="Workout"
                    color={theme.colors.workout}
                    onPress={() => setShowWorkoutModal(true)}
                    style={styles.actionButton}
                />
                <QuickActionButton
                    icon="water-outline"
                    label="Water"
                    color={theme.colors.water}
                    onPress={handleQuickWater}
                    style={styles.actionButton}
                />
                <QuickActionButton
                    icon="restaurant-outline"
                    label="Meal"
                    color={theme.colors.calories}
                    onPress={() => setShowMealModal(true)}
                    style={styles.actionButton}
                />
            </View>

            {/* Weekly Report Button */}
            <TouchableOpacity
                style={[styles.reportButton, { backgroundColor: theme.colors.surfaceVariant }]}
                onPress={() => router.push('/weekly-report')}
            >
                <View style={styles.reportContent}>
                    <Ionicons name="stats-chart" size={24} color={theme.colors.primary} />
                    <View style={styles.reportText}>
                        <Text style={[styles.reportTitle, { color: theme.colors.text }]}>
                            Weekly Report
                        </Text>
                        <Text style={[styles.reportSubtitle, { color: theme.colors.textSecondary }]}>
                            View your 7-day analytics
                        </Text>
                    </View>
                </View>
                <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
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
        paddingBottom: 120,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: spacing.md,
    },
    greeting: {
        ...typography.h1,
    },
    streakRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: 4,
    },
    streakLabel: {
        ...typography.caption,
        fontWeight: '600',
    },
    menuButton: {
        width: 40,
        height: 40,
        borderRadius: borderRadius.full,
        alignItems: 'center',
        justifyContent: 'center',
    },
    challengeCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: spacing.lg,
        borderRadius: borderRadius.xl,
        marginBottom: spacing.md,
    },
    challengeContent: {
        flex: 1,
    },
    challengeTitle: {
        ...typography.h3,
        color: '#000000',
        marginBottom: 4,
    },
    challengeSubtitle: {
        ...typography.bodySmall,
        color: 'rgba(0,0,0,0.6)',
    },
    challengeBadge: {
        marginLeft: spacing.md,
    },
    sectionTitle: {
        ...typography.h3,
        marginBottom: spacing.md,
        marginTop: spacing.sm,
    },
    progressRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: spacing.md,
    },
    progressCard: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: spacing.md,
        marginHorizontal: spacing.xs,
        borderRadius: borderRadius.lg,
    },
    statsRow: {
        flexDirection: 'row',
        gap: spacing.sm,
        marginBottom: spacing.md,
    },
    statCard: {
        flex: 1,
        padding: spacing.md,
        borderRadius: borderRadius.xl,
    },
    statHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.xs,
    },
    statTitle: {
        ...typography.bodySmall,
        fontWeight: '600',
        color: 'rgba(0,0,0,0.7)',
    },
    statValue: {
        fontSize: 32,
        fontWeight: '700',
        color: 'rgba(0,0,0,0.8)',
    },
    statLabel: {
        ...typography.caption,
        color: 'rgba(0,0,0,0.5)',
    },
    statSubtext: {
        ...typography.bodySmall,
        color: 'rgba(0,0,0,0.6)',
        marginTop: spacing.xs,
    },
    goalProgress: {
        alignItems: 'flex-end',
        marginTop: spacing.sm,
    },
    goalRing: {
        width: 50,
        height: 50,
        borderRadius: 25,
        borderWidth: 3,
        alignItems: 'center',
        justifyContent: 'center',
    },
    goalPercent: {
        ...typography.bodySmall,
        fontWeight: '700',
        color: 'rgba(0,0,0,0.7)',
    },
    quickActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: spacing.sm,
        marginBottom: spacing.lg,
    },
    actionButton: {
        flex: 1,
    },
    reportButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: spacing.md,
        borderRadius: borderRadius.lg,
    },
    reportContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
    },
    reportText: {
        flex: 1,
    },
    reportTitle: {
        ...typography.body,
        fontWeight: '600',
    },
    reportSubtitle: {
        ...typography.caption,
    },
});
