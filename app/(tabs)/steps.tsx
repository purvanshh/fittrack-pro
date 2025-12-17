import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback } from 'react';
import {
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import GlassCard from '../../components/GlassCard';
import ProgressRing from '../../components/ProgressRing';
import { glassStyles, gradients, spacing, typography } from '../../constants/theme';
import { useSteps } from '../../context/StepContext';
import { useTheme } from '../../context/ThemeContext';

export default function StepsScreen() {
    const { theme } = useTheme();
    const { steps, goal, refreshGoal } = useSteps();
    const isDark = theme.mode === 'dark';
    const [refreshing, setRefreshing] = React.useState(false);

    // Refresh goal when screen comes into focus (in case user changed it in profile)
    useFocusEffect(
        useCallback(() => {
            refreshGoal();
        }, [])
    );

    const onRefresh = async () => {
        setRefreshing(true);
        await refreshGoal();
        setRefreshing(false);
    };

    const percentage = goal > 0 ? steps / goal : 0;
    const remaining = Math.max(goal - steps, 0);
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
                {/* Progress Ring Section */}
                <GlassCard style={styles.ringSection} variant="surface">
                    <ProgressRing
                        progress={percentage}
                        size={220}
                        strokeWidth={20}
                        color={theme.colors.primary}
                        label="of daily goal"
                        value={steps.toLocaleString()}
                    />
                </GlassCard>

                {/* Remaining Steps */}
                {remaining > 0 && (
                    <GlassCard style={styles.remainingCard} variant="subtle">
                        <View style={styles.remainingContent}>
                            <View style={[styles.remainingIcon, { backgroundColor: theme.colors.primary + '20' }]}>
                                <Ionicons name="walk" size={20} color={theme.colors.primary} />
                            </View>
                            <Text style={[styles.remainingText, { color: theme.colors.text }]}>
                                {remaining.toLocaleString()} steps remaining to reach your goal
                            </Text>
                        </View>
                    </GlassCard>
                )}

                {/* Goal Card */}
                <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                    Daily Goal
                </Text>
                <TouchableOpacity
                    onPress={() => router.push('/(tabs)/profile')}
                    activeOpacity={0.8}
                >
                    <GlassCard style={styles.goalCard} variant="card">
                        <View style={styles.goalContent}>
                            <View style={[styles.goalIcon, { backgroundColor: theme.colors.primary + '20' }]}>
                                <Ionicons name="flag" size={24} color={theme.colors.primary} />
                            </View>
                            <View style={styles.goalInfo}>
                                <Text style={[styles.goalValue, { color: theme.colors.text }]}>
                                    {goal.toLocaleString()} steps
                                </Text>
                                <Text style={[styles.goalHint, { color: theme.colors.textSecondary }]}>
                                    Tap to edit
                                </Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
                        </View>
                    </GlassCard>
                </TouchableOpacity>
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
    ringSection: {
        alignItems: 'center',
        paddingVertical: spacing.xl,
        marginBottom: spacing.md,
    },
    remainingCard: {
        marginBottom: spacing.lg,
    },
    remainingContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    remainingIcon: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    remainingText: {
        ...typography.body,
        flex: 1,
    },
    sectionTitle: {
        ...typography.h3,
        marginBottom: spacing.md,
    },
    goalCard: {
        marginBottom: spacing.lg,
    },
    goalContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
    },
    goalIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    goalInfo: {
        flex: 1,
    },
    goalValue: {
        ...typography.h3,
        fontWeight: '700',
    },
    goalHint: {
        ...typography.caption,
        marginTop: 2,
    },
    statusCard: {
        marginBottom: spacing.md,
    },
    statusContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
    },
    statusIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    statusInfo: {
        flex: 1,
    },
    statusLabel: {
        ...typography.body,
        fontWeight: '600',
    },
    statusHint: {
        ...typography.caption,
        marginTop: 2,
    },
});
