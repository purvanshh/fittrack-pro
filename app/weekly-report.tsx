import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { BarChart, LineChart } from 'react-native-chart-kit';
import { borderRadius, shadows, spacing, typography } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';
import { DailyStats } from '../types';
import { formatWater, getDayName } from '../utils/dateUtils';
import { getWeeklyStats } from '../utils/storage';

const screenWidth = Dimensions.get('window').width - spacing.md * 2;

export default function WeeklyReportScreen() {
    const { theme } = useTheme();
    const [weeklyStats, setWeeklyStats] = useState<DailyStats[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const stats = await getWeeklyStats();
        setWeeklyStats(stats);
        setLoading(false);
    };

    // Calculate insights
    const totalWorkouts = weeklyStats.reduce((sum, day) => sum + day.workoutCount, 0);
    const totalWater = weeklyStats.reduce((sum, day) => sum + day.totalWater, 0);
    const totalCalories = weeklyStats.reduce((sum, day) => sum + day.totalCalories, 0);
    const avgWater = Math.round(totalWater / 7);
    const avgCalories = Math.round(totalCalories / 7);

    // Find best workout day
    const bestWorkoutDay = weeklyStats.reduce((best, day) =>
        day.workoutCount > (best?.workoutCount || 0) ? day : best,
        null as DailyStats | null
    );

    // Chart data
    const labels = weeklyStats.map(day => getDayName(day.date));

    const waterData = {
        labels,
        datasets: [{ data: weeklyStats.map(day => day.totalWater / 1000) }], // Convert to liters
    };

    const calorieData = {
        labels,
        datasets: [{ data: weeklyStats.map(day => day.totalCalories || 1) }], // Avoid 0
    };

    const chartConfig = {
        backgroundGradientFrom: theme.colors.surface,
        backgroundGradientTo: theme.colors.surface,
        color: (opacity = 1) => theme.colors.primary + Math.round(opacity * 255).toString(16).padStart(2, '0'),
        labelColor: () => theme.colors.textSecondary,
        decimalPlaces: 1,
        propsForBackgroundLines: {
            strokeDasharray: '5,5',
            stroke: theme.colors.border,
        },
    };

    if (loading) {
        return (
            <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
                <Text style={{ color: theme.colors.text }}>Loading...</Text>
            </View>
        );
    }

    return (
        <>
            <Stack.Screen
                options={{
                    headerShown: true,
                    title: 'Weekly Report',
                    headerStyle: { backgroundColor: theme.colors.surface },
                    headerTintColor: theme.colors.text,
                }}
            />
            <ScrollView
                style={[styles.container, { backgroundColor: theme.colors.background }]}
                contentContainerStyle={styles.content}
            >
                {/* Summary Cards */}
                <View style={styles.summaryGrid}>
                    <View style={[styles.summaryCard, { backgroundColor: theme.colors.workout }, shadows.md]}>
                        <Ionicons name="barbell" size={28} color="#FFFFFF" />
                        <Text style={styles.summaryValue}>{totalWorkouts}</Text>
                        <Text style={styles.summaryLabel}>Total Workouts</Text>
                    </View>
                    <View style={[styles.summaryCard, { backgroundColor: theme.colors.water }, shadows.md]}>
                        <Ionicons name="water" size={28} color="#FFFFFF" />
                        <Text style={styles.summaryValue}>{formatWater(totalWater)}</Text>
                        <Text style={styles.summaryLabel}>Total Water</Text>
                    </View>
                    <View style={[styles.summaryCard, { backgroundColor: theme.colors.calories }, shadows.md]}>
                        <Ionicons name="flame" size={28} color="#FFFFFF" />
                        <Text style={styles.summaryValue}>{totalCalories}</Text>
                        <Text style={styles.summaryLabel}>Total Calories</Text>
                    </View>
                </View>

                {/* Insights */}
                <View style={[styles.insightsCard, { backgroundColor: theme.colors.surface }, shadows.md]}>
                    <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                        Insights
                    </Text>

                    <View style={styles.insightRow}>
                        <View style={[styles.insightIcon, { backgroundColor: theme.colors.workout + '20' }]}>
                            <Ionicons name="trophy" size={20} color={theme.colors.workout} />
                        </View>
                        <View style={styles.insightContent}>
                            <Text style={[styles.insightLabel, { color: theme.colors.textSecondary }]}>
                                Best Workout Day
                            </Text>
                            <Text style={[styles.insightValue, { color: theme.colors.text }]}>
                                {bestWorkoutDay && bestWorkoutDay.workoutCount > 0
                                    ? `${getDayName(bestWorkoutDay.date)} - ${bestWorkoutDay.workoutCount} workouts`
                                    : 'No workouts this week'}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.insightRow}>
                        <View style={[styles.insightIcon, { backgroundColor: theme.colors.water + '20' }]}>
                            <Ionicons name="water" size={20} color={theme.colors.water} />
                        </View>
                        <View style={styles.insightContent}>
                            <Text style={[styles.insightLabel, { color: theme.colors.textSecondary }]}>
                                Avg. Water Intake
                            </Text>
                            <Text style={[styles.insightValue, { color: theme.colors.text }]}>
                                {formatWater(avgWater)} per day
                            </Text>
                        </View>
                    </View>

                    <View style={styles.insightRow}>
                        <View style={[styles.insightIcon, { backgroundColor: theme.colors.calories + '20' }]}>
                            <Ionicons name="flame" size={20} color={theme.colors.calories} />
                        </View>
                        <View style={styles.insightContent}>
                            <Text style={[styles.insightLabel, { color: theme.colors.textSecondary }]}>
                                Avg. Calories
                            </Text>
                            <Text style={[styles.insightValue, { color: theme.colors.text }]}>
                                {avgCalories} cal per day
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Water Chart */}
                <View style={[styles.chartCard, { backgroundColor: theme.colors.surface }, shadows.md]}>
                    <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                        Water Intake (L)
                    </Text>
                    <LineChart
                        data={waterData}
                        width={screenWidth - spacing.lg * 2}
                        height={180}
                        chartConfig={{
                            ...chartConfig,
                            color: () => theme.colors.water,
                        }}
                        bezier
                        style={styles.chart}
                        withInnerLines={false}
                        withOuterLines={false}
                    />
                </View>

                {/* Calories Chart */}
                <View style={[styles.chartCard, { backgroundColor: theme.colors.surface }, shadows.md]}>
                    <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                        Calories Consumed
                    </Text>
                    <BarChart
                        data={calorieData}
                        width={screenWidth - spacing.lg * 2}
                        height={180}
                        chartConfig={{
                            ...chartConfig,
                            color: () => theme.colors.calories,
                        }}
                        style={styles.chart}
                        showValuesOnTopOfBars
                        withInnerLines={false}
                        yAxisLabel=""
                        yAxisSuffix=""
                    />
                </View>
            </ScrollView>
        </>
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
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    summaryGrid: {
        flexDirection: 'row',
        gap: spacing.sm,
        marginBottom: spacing.md,
    },
    summaryCard: {
        flex: 1,
        alignItems: 'center',
        padding: spacing.md,
        borderRadius: borderRadius.lg,
    },
    summaryValue: {
        ...typography.h2,
        color: '#FFFFFF',
        marginTop: spacing.xs,
    },
    summaryLabel: {
        ...typography.caption,
        color: 'rgba(255,255,255,0.8)',
        textAlign: 'center',
    },
    sectionTitle: {
        ...typography.h3,
        marginBottom: spacing.md,
    },
    insightsCard: {
        padding: spacing.lg,
        borderRadius: borderRadius.lg,
        marginBottom: spacing.md,
    },
    insightRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    insightIcon: {
        width: 40,
        height: 40,
        borderRadius: borderRadius.md,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.md,
    },
    insightContent: {
        flex: 1,
    },
    insightLabel: {
        ...typography.caption,
    },
    insightValue: {
        ...typography.body,
        fontWeight: '600',
    },
    chartCard: {
        padding: spacing.lg,
        borderRadius: borderRadius.lg,
        marginBottom: spacing.md,
    },
    chart: {
        borderRadius: borderRadius.md,
        marginLeft: -spacing.md,
    },
});
