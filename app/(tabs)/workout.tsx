import { Ionicons } from '@expo/vector-icons';
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
import WorkoutCard from '../../components/WorkoutCard';
import { borderRadius, shadows, spacing, typography } from '../../constants/theme';
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
    const [todayWorkouts, setTodayWorkouts] = useState<Workout[]>([]);
    const [weeklyMinutes, setWeeklyMinutes] = useState(0);
    const [weeklyCount, setWeeklyCount] = useState(0);
    const [refreshing, setRefreshing] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [recentTypes, setRecentTypes] = useState<WorkoutType[]>([]);

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
        <ScrollView
            style={[styles.container, { backgroundColor: theme.colors.background }]}
            contentContainerStyle={styles.content}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
        >
            {/* Weekly Summary */}
            <View style={[styles.summaryCard, { backgroundColor: theme.colors.workout }, shadows.md]}>
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
                                            { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
                                            shadows.sm,
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
                <View style={[styles.todayStat, { backgroundColor: theme.colors.surface }, shadows.sm]}>
                    <Ionicons name="fitness-outline" size={24} color={theme.colors.workout} />
                    <Text style={[styles.todayValue, { color: theme.colors.text }]}>
                        {todayWorkouts.length}
                    </Text>
                    <Text style={[styles.todayLabel, { color: theme.colors.textSecondary }]}>
                        Workouts
                    </Text>
                </View>
                <View style={[styles.todayStat, { backgroundColor: theme.colors.surface }, shadows.sm]}>
                    <Ionicons name="time-outline" size={24} color={theme.colors.primary} />
                    <Text style={[styles.todayValue, { color: theme.colors.text }]}>
                        {formatDuration(todayMinutes)}
                    </Text>
                    <Text style={[styles.todayLabel, { color: theme.colors.textSecondary }]}>
                        Duration
                    </Text>
                </View>
                <View style={[styles.todayStat, { backgroundColor: theme.colors.surface }, shadows.sm]}>
                    <Ionicons name="flame-outline" size={24} color={theme.colors.calories} />
                    <Text style={[styles.todayValue, { color: theme.colors.text }]}>
                        {todayCalories}
                    </Text>
                    <Text style={[styles.todayLabel, { color: theme.colors.textSecondary }]}>
                        Calories
                    </Text>
                </View>
            </View>

            {/* Today's Workouts List */}
            <View style={styles.listHeader}>
                <Text style={[styles.sectionTitle, { color: theme.colors.text, marginBottom: 0 }]}>
                    Workout Log
                </Text>
                <TouchableOpacity
                    style={[styles.addButton, { backgroundColor: theme.colors.primary }]}
                    onPress={() => setShowModal(true)}
                >
                    <Ionicons name="add" size={20} color="#FFFFFF" />
                    <Text style={styles.addButtonText}>Log</Text>
                </TouchableOpacity>
            </View>

            {todayWorkouts.length === 0 ? (
                <View style={[styles.emptyState, { backgroundColor: theme.colors.surfaceVariant }]}>
                    <Ionicons name="barbell-outline" size={48} color={theme.colors.textSecondary} />
                    <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
                        No workouts logged today
                    </Text>
                    <Text style={[styles.emptySubtext, { color: theme.colors.textSecondary }]}>
                        Tap the button above to log your first workout
                    </Text>
                </View>
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
    summaryCard: {
        padding: spacing.lg,
        borderRadius: borderRadius.lg,
        marginBottom: spacing.lg,
    },
    summaryTitle: {
        ...typography.bodySmall,
        color: 'rgba(255,255,255,0.8)',
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
        color: 'rgba(255,255,255,0.8)',
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
        borderWidth: 1,
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
        alignItems: 'center',
        padding: spacing.md,
        borderRadius: borderRadius.md,
        gap: spacing.xs,
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
    },
    addButtonText: {
        ...typography.bodySmall,
        color: '#FFFFFF',
        fontWeight: '600',
    },
    emptyState: {
        alignItems: 'center',
        padding: spacing.xl,
        borderRadius: borderRadius.lg,
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
