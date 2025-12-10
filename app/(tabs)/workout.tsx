import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import AddWorkoutModal from '../../components/AddWorkoutModal';
import GlassCard from '../../components/GlassCard';
import WorkoutCard from '../../components/WorkoutCard';
import { borderRadius, glassStyles, gradients, shadows, spacing, typography } from '../../constants/theme';
import { useTheme } from '../../context/ThemeContext';
import { Workout, WORKOUT_TYPES, WorkoutType } from '../../types';
import { formatDuration } from '../../utils/dateUtils';
import {
    deleteWorkout,
    getTodayWorkouts,
    getWeeklyStats,
    getWorkouts,
    saveWorkout,
} from '../../utils/storage';

export default function WorkoutScreen() {
    const { theme } = useTheme();
    const isDark = theme.mode === 'dark';
    const [todayWorkouts, setTodayWorkouts] = useState<Workout[]>([]);
    const [weeklyMinutes, setWeeklyMinutes] = useState(0);
    const [weeklyCount, setWeeklyCount] = useState(0);
    const [refreshing, setRefreshing] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [recentTypes, setRecentTypes] = useState<WorkoutType[]>([]);

    const glassStyle = isDark ? glassStyles.dark : glassStyles.light;

    const loadData = async () => {
        const [today, weeklyStats, allWorkouts] = await Promise.all([
            getTodayWorkouts(),
            getWeeklyStats(),
            getWorkouts(),
        ]);

        setTodayWorkouts(today);

        // Calculate weekly totals
        const totalMinutes = weeklyStats.reduce((sum, day) => sum + day.totalWorkoutMinutes, 0);
        const totalCount = weeklyStats.reduce((sum, day) => sum + day.workoutCount, 0);
        setWeeklyMinutes(totalMinutes);
        setWeeklyCount(totalCount);

        // Get recent workout types for smart suggestions
        const recent = allWorkouts
            .slice(-10)
            .map(w => w.type)
            .filter((type, index, self) => self.indexOf(type) === index)
            .slice(0, 4);
        setRecentTypes(recent);
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

    const handleDeleteWorkout = async (id: string) => {
        await deleteWorkout(id);
        await loadData();
    };

    const todayMinutes = todayWorkouts.reduce((sum, w) => sum + w.duration, 0);
    const todayCalories = todayWorkouts.reduce((sum, w) => sum + w.calories, 0);

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
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.workout} />
                }
            >
                {/* Weekly Summary */}
                <View style={[styles.summaryCard, shadows.glow(theme.colors.workout)]}>
                    <LinearGradient
                        colors={gradients.workout}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={StyleSheet.absoluteFill}
                    />
                    <Text style={styles.summaryTitle}>This Week</Text>
                    <View style={styles.summaryStats}>
                        <View style={styles.summaryStat}>
                            <Text style={styles.summaryValue}>{weeklyCount}</Text>
                            <Text style={styles.summaryLabel}>Workouts</Text>
                        </View>
                        <View style={[styles.divider, { backgroundColor: 'rgba(255,255,255,0.3)' }]} />
                        <View style={styles.summaryStat}>
                            <Text style={styles.summaryValue}>{formatDuration(weeklyMinutes)}</Text>
                            <Text style={styles.summaryLabel}>Total Time</Text>
                        </View>
                    </View>
                </View>

                {/* Smart Suggestions */}
                {recentTypes.length > 0 && (
                    <>
                        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                            Quick Start
                        </Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.suggestionsScroll}>
                            <View style={styles.suggestions}>
                                {recentTypes.map((type) => {
                                    const info = WORKOUT_TYPES[type];
                                    return (
                                        <TouchableOpacity
                                            key={type}
                                            style={[
                                                styles.suggestionChip,
                                                glassStyle.card,
                                                shadows.glass,
                                            ]}
                                            onPress={() => setShowModal(true)}
                                        >
                                            <Ionicons name={info.icon as any} size={18} color={theme.colors.workout} />
                                            <Text style={[styles.suggestionText, { color: theme.colors.text }]}>
                                                {info.label}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        </ScrollView>
                    </>
                )}

                {/* Today's Stats */}
                <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                    Today
                </Text>
                <View style={styles.todayStats}>
                    <GlassCard style={styles.todayStat} variant="card" noPadding>
                        <View style={styles.todayStatContent}>
                            <View style={[styles.todayStatIcon, { backgroundColor: theme.colors.workout + '20' }]}>
                                <Ionicons name="fitness-outline" size={22} color={theme.colors.workout} />
                            </View>
                            <Text style={[styles.todayValue, { color: theme.colors.text }]}>
                                {todayWorkouts.length}
                            </Text>
                            <Text style={[styles.todayLabel, { color: theme.colors.textSecondary }]}>
                                Workouts
                            </Text>
                        </View>
                    </GlassCard>
                    <GlassCard style={styles.todayStat} variant="card" noPadding>
                        <View style={styles.todayStatContent}>
                            <View style={[styles.todayStatIcon, { backgroundColor: theme.colors.primary + '20' }]}>
                                <Ionicons name="time-outline" size={22} color={theme.colors.primary} />
                            </View>
                            <Text style={[styles.todayValue, { color: theme.colors.text }]}>
                                {formatDuration(todayMinutes)}
                            </Text>
                            <Text style={[styles.todayLabel, { color: theme.colors.textSecondary }]}>
                                Duration
                            </Text>
                        </View>
                    </GlassCard>
                    <GlassCard style={styles.todayStat} variant="card" noPadding>
                        <View style={styles.todayStatContent}>
                            <View style={[styles.todayStatIcon, { backgroundColor: theme.colors.calories + '20' }]}>
                                <Ionicons name="flame-outline" size={22} color={theme.colors.calories} />
                            </View>
                            <Text style={[styles.todayValue, { color: theme.colors.text }]}>
                                {todayCalories}
                            </Text>
                            <Text style={[styles.todayLabel, { color: theme.colors.textSecondary }]}>
                                Calories
                            </Text>
                        </View>
                    </GlassCard>
                </View>

                {/* Today's Workouts List */}
                <View style={styles.listHeader}>
                    <Text style={[styles.sectionTitle, { color: theme.colors.text, marginBottom: 0 }]}>
                        Workout Log
                    </Text>
                    <TouchableOpacity
                        style={[styles.addButton, shadows.glow(theme.colors.primary)]}
                        onPress={() => setShowModal(true)}
                    >
                        <LinearGradient
                            colors={gradients.primary}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={StyleSheet.absoluteFill}
                        />
                        <Ionicons name="add" size={20} color="#000000" />
                        <Text style={styles.addButtonText}>Log</Text>
                    </TouchableOpacity>
                </View>

                {todayWorkouts.length === 0 ? (
                    <GlassCard style={styles.emptyState} variant="card">
                        <Ionicons name="barbell-outline" size={48} color={theme.colors.textSecondary} />
                        <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
                            No workouts logged today
                        </Text>
                        <Text style={[styles.emptySubtext, { color: theme.colors.textSecondary }]}>
                            Tap the button above to log your first workout
                        </Text>
                    </GlassCard>
                ) : (
                    todayWorkouts.map((workout) => (
                        <WorkoutCard
                            key={workout.id}
                            workout={workout}
                            onDelete={handleDeleteWorkout}
                        />
                    ))
                )}

                {/* Modal */}
                <AddWorkoutModal
                    visible={showModal}
                    onClose={() => setShowModal(false)}
                    onSave={handleAddWorkout}
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
    summaryCard: {
        padding: spacing.lg,
        borderRadius: borderRadius.lg,
        marginBottom: spacing.lg,
        overflow: 'hidden',
    },
    summaryTitle: {
        ...typography.bodySmall,
        color: 'rgba(255,255,255,0.9)',
        textAlign: 'center',
        marginBottom: spacing.md,
    },
    summaryStats: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    summaryStat: {
        alignItems: 'center',
    },
    summaryValue: {
        ...typography.h1,
        color: '#FFFFFF',
    },
    summaryLabel: {
        ...typography.caption,
        color: 'rgba(255,255,255,0.85)',
    },
    divider: {
        width: 1,
        height: 40,
    },
    sectionTitle: {
        ...typography.h3,
        marginBottom: spacing.md,
    },
    suggestionsScroll: {
        marginBottom: spacing.lg,
    },
    suggestions: {
        flexDirection: 'row',
        gap: spacing.sm,
        paddingRight: spacing.md,
    },
    suggestionChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        borderRadius: borderRadius.full,
        gap: spacing.xs,
    },
    suggestionText: {
        ...typography.bodySmall,
        fontWeight: '500',
    },
    todayStats: {
        flexDirection: 'row',
        gap: spacing.sm,
        marginBottom: spacing.lg,
    },
    todayStat: {
        flex: 1,
    },
    todayStatContent: {
        alignItems: 'center',
        padding: spacing.md,
        gap: spacing.xs,
    },
    todayStatIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.xs,
    },
    todayValue: {
        ...typography.h3,
    },
    todayLabel: {
        ...typography.caption,
    },
    listHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        borderRadius: borderRadius.full,
        gap: spacing.xs,
        overflow: 'hidden',
    },
    addButtonText: {
        ...typography.bodySmall,
        color: '#000000',
        fontWeight: '600',
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: spacing.xl,
    },
    emptyText: {
        ...typography.body,
        marginTop: spacing.md,
    },
    emptySubtext: {
        ...typography.caption,
        marginTop: spacing.xs,
        textAlign: 'center',
    },
});
