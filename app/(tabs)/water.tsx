import { Ionicons } from '@expo/vector-icons';
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
import WaterBottle from '../../components/WaterBottle';
import { borderRadius, shadows, spacing, typography } from '../../constants/theme';
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

    return (
        <ScrollView
            style={[styles.container, { backgroundColor: theme.colors.background }]}
            contentContainerStyle={styles.content}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
        >
            {/* Water Bottle Visualization */}
            <View style={[styles.bottleSection, { backgroundColor: theme.colors.surface }, shadows.md]}>
                <WaterBottle current={totalWater} goal={goal} size={200} />
            </View>

            {/* Remaining */}
            {remaining > 0 && (
                <View style={[styles.remainingCard, { backgroundColor: theme.colors.water + '15' }]}>
                    <Ionicons name="water" size={20} color={theme.colors.water} />
                    <Text style={[styles.remainingText, { color: theme.colors.text }]}>
                        {formatWater(remaining)} remaining to reach your goal
                    </Text>
                </View>
            )}

            {/* Quick Add Buttons */}
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                Quick Add
            </Text>
            <View style={styles.presetGrid}>
                {WATER_PRESETS.map((amount) => (
                    <TouchableOpacity
                        key={amount}
                        style={[
                            styles.presetButton,
                            { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
                            shadows.sm,
                        ]}
                        onPress={() => handleAddWater(amount)}
                    >
                        <Ionicons name="water" size={24} color={theme.colors.water} />
                        <Text style={[styles.presetAmount, { color: theme.colors.text }]}>
                            {formatWater(amount)}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Custom Amount */}
            <TouchableOpacity
                style={[
                    styles.customButton,
                    { backgroundColor: theme.colors.water },
                    shadows.md,
                ]}
                onPress={() => handleAddWater(500)}
            >
                <Ionicons name="add-circle" size={24} color="#FFFFFF" />
                <Text style={styles.customButtonText}>Add Custom Amount</Text>
            </TouchableOpacity>

            {/* Today's Intake History */}
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                Today's Intake
            </Text>
            {todayIntakes.length === 0 ? (
                <View style={[styles.emptyState, { backgroundColor: theme.colors.surfaceVariant }]}>
                    <Ionicons name="water-outline" size={48} color={theme.colors.textSecondary} />
                    <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
                        No water logged yet today
                    </Text>
                    <Text style={[styles.emptySubtext, { color: theme.colors.textSecondary }]}>
                        Tap the buttons above to log your water intake
                    </Text>
                </View>
            ) : (
                <View style={styles.intakeList}>
                    {todayIntakes.slice().reverse().map((intake) => (
                        <View
                            key={intake.id}
                            style={[
                                styles.intakeItem,
                                { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
                            ]}
                        >
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
                    ))}
                </View>
            )}
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
    bottleSection: {
        alignItems: 'center',
        padding: spacing.lg,
        borderRadius: borderRadius.lg,
        marginBottom: spacing.md,
    },
    remainingCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
        borderRadius: borderRadius.md,
        marginBottom: spacing.lg,
        gap: spacing.sm,
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
        borderRadius: borderRadius.md,
        borderWidth: 1,
        gap: spacing.xs,
    },
    presetAmount: {
        ...typography.h3,
    },
    customButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.md,
        borderRadius: borderRadius.md,
        marginBottom: spacing.lg,
        gap: spacing.sm,
    },
    customButtonText: {
        ...typography.button,
        color: '#FFFFFF',
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
    intakeList: {
        gap: spacing.sm,
    },
    intakeItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
        borderRadius: borderRadius.md,
        borderWidth: 1,
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
