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
    View,
} from 'react-native';
import GlassCard from '../../components/GlassCard';
import WaterBottle from '../../components/WaterBottle';
import { borderRadius, glassStyles, gradients, shadows, spacing, typography } from '../../constants/theme';
import { useTheme } from '../../context/ThemeContext';
import { UserProfile, WATER_PRESETS, WaterIntake } from '../../types';
import { formatWater, generateId, getCurrentTime, getToday } from '../../utils/dateUtils';
import {
    deleteWaterIntake,
    getProfile,
    getTodayWater,
    saveWaterIntake,
} from '../../utils/storage';

export default function WaterScreen() {
    const { theme } = useTheme();
    const isDark = theme.mode === 'dark';
    const [todayIntakes, setTodayIntakes] = useState<WaterIntake[]>([]);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [refreshing, setRefreshing] = useState(false);

    const loadData = async () => {
        const [intakes, profileData] = await Promise.all([
            getTodayWater(),
            getProfile(),
        ]);
        setTodayIntakes(intakes);
        setProfile(profileData);
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

    const handleAddWater = async (amount: number) => {
        await saveWaterIntake({
            id: generateId(),
            amount,
            date: getToday(),
            time: getCurrentTime(),
        });
        await loadData();
    };

    const handleDeleteIntake = async (id: string) => {
        await deleteWaterIntake(id);
        await loadData();
    };

    const totalWater = todayIntakes.reduce((sum, i) => sum + i.amount, 0);
    const goal = profile?.goals.dailyWater || 2500;
    const remaining = Math.max(goal - totalWater, 0);

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
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.water} />
                }
            >
                {/* Water Bottle Visualization */}
                <GlassCard style={styles.bottleSection} variant="surface">
                    <WaterBottle current={totalWater} goal={goal} size={200} />
                </GlassCard>

                {/* Remaining */}
                {remaining > 0 && (
                    <GlassCard style={styles.remainingCard} variant="subtle">
                        <View style={styles.remainingContent}>
                            <View style={[styles.remainingIcon, { backgroundColor: theme.colors.water + '20' }]}>
                                <Ionicons name="water" size={20} color={theme.colors.water} />
                            </View>
                            <Text style={[styles.remainingText, { color: theme.colors.text }]}>
                                {formatWater(remaining)} remaining to reach your goal
                            </Text>
                        </View>
                    </GlassCard>
                )}

                {/* Quick Add Buttons */}
                <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                    Quick Add
                </Text>
                <View style={styles.presetGrid}>
                    {WATER_PRESETS.map((amount) => (
                        <TouchableOpacity
                            key={amount}
                            style={[styles.presetButton, glassStyle.card, shadows.glass]}
                            onPress={() => handleAddWater(amount)}
                            activeOpacity={0.7}
                        >
                            <LinearGradient
                                colors={isDark
                                    ? ['rgba(255,255,255,0.08)', 'rgba(255,255,255,0.02)'] as const
                                    : ['rgba(255,255,255,0.6)', 'rgba(255,255,255,0.3)'] as const
                                }
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={StyleSheet.absoluteFill}
                            />
                            <View style={[styles.presetIcon, { backgroundColor: theme.colors.water + '20' }]}>
                                <Ionicons name="water" size={24} color={theme.colors.water} />
                            </View>
                            <Text style={[styles.presetAmount, { color: theme.colors.text }]}>
                                {formatWater(amount)}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Custom Amount Button */}
                <TouchableOpacity
                    style={[styles.customButton, shadows.glow(theme.colors.water)]}
                    onPress={() => handleAddWater(500)}
                    activeOpacity={0.8}
                >
                    <LinearGradient
                        colors={gradients.water}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={StyleSheet.absoluteFill}
                    />
                    <Ionicons name="add-circle" size={24} color="#FFFFFF" />
                    <Text style={styles.customButtonText}>Add Custom Amount</Text>
                </TouchableOpacity>

                {/* Today's Intake History */}
                <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                    Today's Intake
                </Text>
                {todayIntakes.length === 0 ? (
                    <GlassCard style={styles.emptyState} variant="card">
                        <Ionicons name="water-outline" size={48} color={theme.colors.textSecondary} />
                        <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
                            No water logged yet today
                        </Text>
                        <Text style={[styles.emptySubtext, { color: theme.colors.textSecondary }]}>
                            Tap the buttons above to log your water intake
                        </Text>
                    </GlassCard>
                ) : (
                    <View style={styles.intakeList}>
                        {todayIntakes.slice().reverse().map((intake) => (
                            <GlassCard
                                key={intake.id}
                                style={styles.intakeItem}
                                variant="card"
                                noPadding
                            >
                                <View style={styles.intakeItemContent}>
                                    <View style={[styles.intakeIcon, { backgroundColor: theme.colors.water + '15' }]}>
                                        <Ionicons name="water" size={18} color={theme.colors.water} />
                                    </View>
                                    <View style={styles.intakeInfo}>
                                        <Text style={[styles.intakeAmount, { color: theme.colors.text }]}>
                                            {formatWater(intake.amount)}
                                        </Text>
                                        <Text style={[styles.intakeTime, { color: theme.colors.textSecondary }]}>
                                            {intake.time}
                                        </Text>
                                    </View>
                                    <TouchableOpacity
                                        onPress={() => handleDeleteIntake(intake.id)}
                                        style={styles.deleteButton}
                                    >
                                        <Ionicons name="close-circle" size={22} color={theme.colors.error} />
                                    </TouchableOpacity>
                                </View>
                            </GlassCard>
                        ))}
                    </View>
                )}
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
    bottleSection: {
        alignItems: 'center',
        paddingVertical: spacing.lg,
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
    presetGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.sm,
        marginBottom: spacing.lg,
    },
    presetButton: {
        flex: 1,
        minWidth: '45%',
        alignItems: 'center',
        padding: spacing.lg,
        borderRadius: borderRadius.lg,
        gap: spacing.sm,
        overflow: 'hidden',
    },
    presetIcon: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
    },
    presetAmount: {
        ...typography.h3,
    },
    customButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.md,
        borderRadius: borderRadius.lg,
        marginBottom: spacing.lg,
        gap: spacing.sm,
        overflow: 'hidden',
    },
    customButtonText: {
        ...typography.button,
        color: '#FFFFFF',
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
    intakeList: {
        gap: spacing.sm,
    },
    intakeItem: {
        marginBottom: 0,
    },
    intakeItemContent: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
    },
    intakeIcon: {
        width: 36,
        height: 36,
        borderRadius: borderRadius.sm,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.md,
    },
    intakeInfo: {
        flex: 1,
    },
    intakeAmount: {
        ...typography.body,
        fontWeight: '600',
    },
    intakeTime: {
        ...typography.caption,
    },
    deleteButton: {
        padding: spacing.xs,
    },
});

