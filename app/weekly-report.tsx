import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
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
import GlassCard from '../components/GlassCard';
import { borderRadius, gradients, shadows, spacing, typography } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';
import { DailyStats } from '../types';
import { formatWater, getDayName } from '../utils/dateUtils';
import { getWeeklyStats } from '../utils/storage';

const screenWidth = Dimensions.get('window').width - spacing.md * 2;

export default function WeeklyReportScreen() {
    const { theme } = useTheme();
    const isDark = theme.mode === 'dark';
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
        backgroundGradientFrom: 'transparent',
        backgroundGradientTo: 'transparent',
        color: (opacity = 1) => theme.colors.primary + Math.round(opacity * 255).toString(16).padStart(2, '0'),
        labelColor: () => theme.colors.textSecondary,
        decimalPlaces: 1,
        propsForBackgroundLines: {
            strokeDasharray: '5,5',
            stroke: theme.colors.border,
        },
        fillShadowGradient: theme.colors.primary,
        fillShadowGradientOpacity: 0.3,
    };

    if (loading) {
        return (
            <View style={styles.wrapper}>
                <LinearGradient
                    colors={isDark ? gradients.darkBackground : gradients.lightBackground}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={StyleSheet.absoluteFill}
                />
                <View style={styles.loadingContainer}>
                    <Text style={{ color: theme.colors.text }}>Loading...</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.wrapper}>
            <Stack.Screen
                options={{
                    headerShown: true,
                    title: 'Weekly Report',
                    headerTransparent: true,
                    headerStyle: { backgroundColor: 'transparent' },
                    headerTintColor: theme.colors.text,
                }}
            />

            {/* Gradient Background */}
            <LinearGradient
                colors={isDark ? gradients.darkBackground : gradients.lightBackground}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
            />

            {/* Decorative Orbs */}
            <View style={[styles.gradientOrb, styles.orbPrimary, { backgroundColor: theme.colors.primary }]} />
            <View style={[styles.gradientOrb, styles.orbSecondary, { backgroundColor: theme.colors.secondary }]} />

            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.content}
            >
                {/* Summary Cards */}
                <View style={styles.summaryGrid}>
                    <View style={[styles.summaryCard, shadows.glow(theme.colors.workout)]}>
                        <LinearGradient
                            colors={gradients.workout}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={StyleSheet.absoluteFill}
                        />
                        <Ionicons name="barbell" size={28} color="#FFFFFF" />
                        <Text style={styles.summaryValue}>{totalWorkouts}</Text>
                        <Text style={styles.summaryLabel}>Total Workouts</Text>
                    </View>
                    <View style={[styles.summaryCard, shadows.glow(theme.colors.water)]}>
                        <LinearGradient
                            colors={gradients.water}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={StyleSheet.absoluteFill}
                        />
                        <Ionicons name="water" size={28} color="#FFFFFF" />
                        <Text style={styles.summaryValue}>{formatWater(totalWater)}</Text>
                        <Text style={styles.summaryLabel}>Total Water</Text>
                    </View>
                    <View style={[styles.summaryCard, shadows.glow(theme.colors.calories)]}>
                        <LinearGradient
                            colors={gradients.calories}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={StyleSheet.absoluteFill}
                        />
                        <Ionicons name="flame" size={28} color="#FFFFFF" />
                        <Text style={styles.summaryValue}>{totalCalories}</Text>
                        <Text style={styles.summaryLabel}>Total Calories</Text>
                    </View>
                </View>

                {/* Insights */}
                <GlassCard style={styles.insightsCard} variant="surface">
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

                    <View style={[styles.insightRow, { marginBottom: 0 }]}>
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
                </GlassCard>

                {/* Water Chart */}
                <GlassCard style={styles.chartCard} variant="surface">
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
                            fillShadowGradient: theme.colors.water,
                        }}
                        bezier
                        style={styles.chart}
                        withInnerLines={false}
                        withOuterLines={false}
                    />
                </GlassCard>

                {/* Calories Chart */}
                <GlassCard style={styles.chartCard} variant="surface">
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
                            fillShadowGradient: theme.colors.calories,
                        }}
                        style={styles.chart}
                        showValuesOnTopOfBars
                        withInnerLines={false}
                        yAxisLabel=""
                        yAxisSuffix=""
                    />
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
        padding: spacing.md,
        paddingTop: 100,
        paddingBottom: spacing.xxl,
    },
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
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
        top: -50,
        right: -100,
    },
    orbSecondary: {
        width: 200,
        height: 200,
        bottom: 100,
        left: -80,
    },
    summaryGrid: {
        flexDirection: 'row',
        gap: spacing.sm,
        marginBottom: spacing.lg,
    },
    summaryCard: {
        flex: 1,
        alignItems: 'center',
        padding: spacing.md,
        borderRadius: borderRadius.lg,
        overflow: 'hidden',
    },
    summaryValue: {
        ...typography.h2,
        color: '#FFFFFF',
        marginTop: spacing.xs,
    },
    summaryLabel: {
        ...typography.caption,
        color: 'rgba(255,255,255,0.85)',
        textAlign: 'center',
    },
    sectionTitle: {
        ...typography.h3,
        marginBottom: spacing.md,
    },
    insightsCard: {
        marginBottom: spacing.md,
    },
    insightRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    insightIcon: {
        width: 44,
        height: 44,
        borderRadius: 22,
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
        marginBottom: spacing.md,
    },
    chart: {
        borderRadius: borderRadius.md,
        marginLeft: -spacing.md,
    },
});

