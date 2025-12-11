import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
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
import CalendarMonth from '../../components/CalendarMonth';
import CalendarWeek from '../../components/CalendarWeek';
import GlassCard from '../../components/GlassCard';
import OvalProgress from '../../components/OvalProgress';
import QuickActionButton from '../../components/QuickActionButton';
import { borderRadius, glassStyles, gradients, shadows, spacing, typography } from '../../constants/theme';
import { useTheme } from '../../context/ThemeContext';
import { DailyStats, Meal, UserProfile, Workout } from '../../types';
import { generateId, getCurrentTime, getToday } from '../../utils/dateUtils';
import {
    getDailyStats,
    getProfile,
    saveMeal,
    saveWaterIntake,
    saveWorkout
} from '../../utils/storage';

export default function DashboardScreen() {
    const { theme } = useTheme();
    const isDark = theme.mode === 'dark';
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [stats, setStats] = useState<DailyStats | null>(null);
    const [activeDays, setActiveDays] = useState<string[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const [showWorkoutModal, setShowWorkoutModal] = useState(false);
    const [showMealModal, setShowMealModal] = useState(false);
    const [selectedDate, setSelectedDate] = useState(getToday());
    const [weekDate, setWeekDate] = useState(getToday());
    const [showMonthModal, setShowMonthModal] = useState(false);

    const loadData = async (date: string = selectedDate) => {
        const profileData = await getProfile();
        const statsData = await getDailyStats(date);
        setProfile(profileData);
        setStats(statsData);

        // Get active days for the current week
        const weekStart = new Date(weekDate);
        const dayOfWeek = weekStart.getDay();
        weekStart.setDate(weekStart.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));

        const activeDaysArray: string[] = [];
        for (let i = 0; i < 7; i++) {
            const checkDate = new Date(weekStart);
            checkDate.setDate(weekStart.getDate() + i);
            const dateStr = checkDate.toISOString().split('T')[0];
            const dayStats = await getDailyStats(dateStr);
            if (dayStats.workoutCount > 0 || dayStats.totalWater > 0 || dayStats.totalCalories > 0) {
                activeDaysArray.push(dateStr);
            }
        }
        setActiveDays(activeDaysArray);
    };

    useFocusEffect(
        useCallback(() => {
            loadData(selectedDate);
        }, [selectedDate, weekDate])
    );

    const onRefresh = async () => {
        setRefreshing(true);
        await loadData(selectedDate);
        setRefreshing(false);
    };

    const handleDateSelect = (date: string) => {
        setSelectedDate(date);
        loadData(date);
    };

    const handleWeekChange = (newDate: string) => {
        setWeekDate(newDate);
    };

    const handleMonthDateSelect = (date: string) => {
        setSelectedDate(date);
        setWeekDate(date); // Update the week view to show the selected date's week
        setShowMonthModal(false);
        loadData(date);
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
            >
                {/* Header with Greeting */}
                <View style={styles.header}>
                    <View>
                        <Text style={[styles.greeting, { color: theme.colors.text }]}>
                            {profile?.name ? `Hi ${profile.name}` : 'Your Activity'}
                        </Text>
                        {profile && profile.streak > 0 && (
                            <View style={[styles.streakBadge, { backgroundColor: theme.colors.primary + '20' }]}>
                                <Ionicons name="flash" size={14} color={theme.colors.primary} />
                                <Text style={[styles.streakLabel, { color: theme.colors.primary }]}>
                                    {profile.streak} day streak
                                </Text>
                            </View>
                        )}
                    </View>
                    <TouchableOpacity
                        style={[styles.menuButton, glassStyle.card, shadows.glass]}
                        onPress={() => router.push('/profile')}
                    >
                        <Ionicons name="grid-outline" size={20} color={theme.colors.text} />
                    </TouchableOpacity>
                </View>

                {/* Calendar Week */}
                <CalendarWeek
                    currentDate={weekDate}
                    selectedDate={selectedDate}
                    activeDays={activeDays}
                    onDateSelect={handleDateSelect}
                    onWeekChange={handleWeekChange}
                    onMonthPress={() => setShowMonthModal(true)}
                />

                <CalendarMonth
                    visible={showMonthModal}
                    onClose={() => setShowMonthModal(false)}
                    selectedDate={selectedDate}
                    onDateSelect={handleMonthDateSelect}
                />

                {/* Selected Date Info */}
                {selectedDate !== getToday() && (
                    <GlassCard style={styles.dateInfoCard} variant="subtle">
                        <View style={styles.dateInfoContent}>
                            <Ionicons name="calendar" size={16} color={theme.colors.textSecondary} />
                            <Text style={[styles.dateInfoText, { color: theme.colors.textSecondary }]}>
                                Viewing: {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                            </Text>
                            <TouchableOpacity onPress={() => { setSelectedDate(getToday()); setWeekDate(getToday()); loadData(getToday()); }}>
                                <Text style={[styles.todayLink, { color: theme.colors.primary }]}>Go to Today</Text>
                            </TouchableOpacity>
                        </View>
                    </GlassCard>
                )}

                {/* Challenge / Goals Card - Accent Gradient */}
                <TouchableOpacity
                    onPress={() => router.push('/profile')}
                    activeOpacity={0.9}
                >
                    <View style={[styles.challengeCard, shadows.glow(theme.colors.primary)]}>
                        <LinearGradient
                            colors={[theme.colors.primary, isDark ? `${theme.colors.primary}CC` : `${theme.colors.primary}DD`]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={StyleSheet.absoluteFill}
                        />
                        <View style={styles.challengeContent}>
                            <Text style={styles.challengeTitle}>Today's Challenge</Text>
                            <Text style={styles.challengeSubtitle}>
                                Hit your daily goals before midnight!
                            </Text>
                        </View>
                        <View style={styles.challengeBadge}>
                            <Ionicons name="trophy" size={36} color="rgba(0,0,0,0.2)" />
                        </View>
                    </View>
                </TouchableOpacity>

                {/* Progress Indicators Section */}
                <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                    Today's Progress
                </Text>
                <View style={styles.progressRow}>
                    <GlassCard style={styles.progressCard} variant="card">
                        <OvalProgress
                            type="water"
                            current={stats?.totalWater || 0}
                            goal={waterGoal}
                            size={90}
                        />
                    </GlassCard>
                    <GlassCard style={styles.progressCard} variant="card">
                        <OvalProgress
                            type="calories"
                            current={stats?.totalCalories || 0}
                            goal={calorieGoal}
                            size={90}
                        />
                    </GlassCard>
                    <GlassCard style={styles.progressCard} variant="card">
                        <OvalProgress
                            type="workout"
                            current={stats?.workoutCount || 0}
                            goal={Math.ceil(workoutGoal / 7)}
                            size={90}
                        />
                    </GlassCard>
                </View>

                {/* Stats Cards */}
                <View style={styles.statsRow}>
                    {/* Workouts Card */}
                    <View style={[styles.statCard, shadows.glow(theme.colors.secondary)]}>
                        <LinearGradient
                            colors={gradients.secondary}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={StyleSheet.absoluteFill}
                        />
                        <View style={styles.statHeader}>
                            <Text style={styles.statTitle}>Workouts</Text>
                            <Ionicons name="fitness" size={20} color="rgba(255,255,255,0.7)" />
                        </View>
                        <Text style={styles.statValue}>{stats?.workoutCount || 0}</Text>
                        <Text style={styles.statLabel}>today</Text>
                    </View>

                    {/* Goals Card */}
                    <View style={[styles.statCard, shadows.glow(theme.colors.accent)]}>
                        <LinearGradient
                            colors={gradients.accent}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={StyleSheet.absoluteFill}
                        />
                        <View style={styles.statHeader}>
                            <Text style={styles.statTitle}>My Goals</Text>
                        </View>
                        <Text style={styles.statSubtext}>Keep it up!</Text>
                        <View style={styles.goalProgress}>
                            <View style={styles.goalRing}>
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
                <GlassCard style={styles.reportButton} variant="card">
                    <TouchableOpacity
                        style={styles.reportTouchable}
                        onPress={() => router.push('/weekly-report')}
                    >
                        <View style={styles.reportContent}>
                            <View style={[styles.reportIconContainer, { backgroundColor: theme.colors.primary + '20' }]}>
                                <Ionicons name="stats-chart" size={24} color={theme.colors.primary} />
                            </View>
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
                </GlassCard>

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
        padding: spacing.md,
        paddingTop: 60,
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
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: spacing.md,
    },
    greeting: {
        ...typography.h1,
    },
    streakBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: 8,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: borderRadius.full,
        alignSelf: 'flex-start',
    },
    streakLabel: {
        ...typography.caption,
        fontWeight: '600',
    },
    menuButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
    },
    challengeCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: spacing.lg,
        borderRadius: borderRadius.xl,
        marginBottom: spacing.lg,
        overflow: 'hidden',
    },
    challengeContent: {
        flex: 1,
        zIndex: 1,
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
        zIndex: 1,
    },
    sectionTitle: {
        ...typography.h3,
        marginBottom: spacing.md,
        marginTop: spacing.sm,
    },
    progressRow: {
        flexDirection: 'row',
        gap: spacing.sm,
        marginBottom: spacing.lg,
    },
    progressCard: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: spacing.md,
    },
    statsRow: {
        flexDirection: 'row',
        gap: spacing.sm,
        marginBottom: spacing.lg,
    },
    statCard: {
        flex: 1,
        padding: spacing.md,
        borderRadius: borderRadius.xl,
        overflow: 'hidden',
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
        color: 'rgba(255,255,255,0.9)',
    },
    statValue: {
        fontSize: 36,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    statLabel: {
        ...typography.caption,
        color: 'rgba(255,255,255,0.7)',
    },
    statSubtext: {
        ...typography.bodySmall,
        color: 'rgba(255,255,255,0.8)',
        marginTop: spacing.xs,
    },
    goalProgress: {
        alignItems: 'flex-end',
        marginTop: spacing.sm,
    },
    goalRing: {
        width: 54,
        height: 54,
        borderRadius: 27,
        borderWidth: 3,
        borderColor: 'rgba(255,255,255,0.4)',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255,255,255,0.15)',
    },
    goalPercent: {
        ...typography.bodySmall,
        fontWeight: '700',
        color: '#FFFFFF',
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
        marginBottom: spacing.md,
    },
    reportTouchable: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    reportContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
    },
    reportIconContainer: {
        width: 44,
        height: 44,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
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
    dateInfoCard: {
        marginBottom: spacing.md,
    },
    dateInfoContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        zIndex: 1,
        elevation: 2,
    },
    dateInfoText: {
        ...typography.bodySmall,
        flex: 1,
    },
    todayLink: {
        ...typography.bodySmall,
        fontWeight: '600',
    },
});

