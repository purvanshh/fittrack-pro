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
import AddMealModal from '../../components/AddMealModal';
import MealCard from '../../components/MealCard';
import { borderRadius, shadows, spacing, typography } from '../../constants/theme';
import { useTheme } from '../../context/ThemeContext';
import { Meal, UserProfile } from '../../types';
import {
    deleteMeal,
    getProfile,
    getTodayMeals,
    saveMeal,
} from '../../utils/storage';

export default function MealsScreen() {
    const { theme } = useTheme();
    const [todayMeals, setTodayMeals] = useState<Meal[]>([]);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [refreshing, setRefreshing] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const loadData = async () => {
        const [meals, profileData] = await Promise.all([
            getTodayMeals(),
            getProfile(),
        ]);
        setTodayMeals(meals);
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

    const handleAddMeal = async (meal: Meal) => {
        await saveMeal(meal);
        await loadData();
    };

    const handleDeleteMeal = async (id: string) => {
        await deleteMeal(id);
        await loadData();
    };

    const totalCalories = todayMeals.reduce((sum, m) => sum + m.calories, 0);
    const goal = profile?.goals.dailyCalories || 2000;
    const progress = totalCalories / goal;
    const remaining = Math.max(goal - totalCalories, 0);

    const getProgressColor = () => {
        if (progress <= 0.8) return theme.colors.success;
        if (progress <= 1) return theme.colors.warning;
        return theme.colors.error;
    };

    return (
        <ScrollView
            style={[styles.container, { backgroundColor: theme.colors.background }]}
            contentContainerStyle={styles.content}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
        >
            {/* Calorie Overview */}
            <View style={[styles.overviewCard, { backgroundColor: theme.colors.surface }, shadows.md]}>
                <View style={styles.overviewHeader}>
                    <Text style={[styles.overviewTitle, { color: theme.colors.textSecondary }]}>
                        Today's Calories
                    </Text>
                    <View style={[styles.goalBadge, { backgroundColor: theme.colors.surfaceVariant }]}>
                        <Ionicons name="flag" size={14} color={theme.colors.textSecondary} />
                        <Text style={[styles.goalText, { color: theme.colors.textSecondary }]}>
                            Goal: {goal}
                        </Text>
                    </View>
                </View>

                <View style={styles.calorieDisplay}>
                    <Text style={[styles.calorieValue, { color: theme.colors.text }]}>
                        {totalCalories}
                    </Text>
                    <Text style={[styles.calorieUnit, { color: theme.colors.textSecondary }]}>
                        kcal
                    </Text>
                </View>

                {/* Progress Bar */}
                <View style={[styles.progressBarBg, { backgroundColor: theme.colors.surfaceVariant }]}>
                    <View
                        style={[
                            styles.progressBarFill,
                            {
                                backgroundColor: getProgressColor(),
                                width: `${Math.min(progress * 100, 100)}%`,
                            },
                        ]}
                    />
                </View>

                <View style={styles.progressLabels}>
                    <Text style={[styles.progressLabel, { color: theme.colors.textSecondary }]}>
                        {Math.round(progress * 100)}% of daily goal
                    </Text>
                    {remaining > 0 ? (
                        <Text style={[styles.remainingLabel, { color: theme.colors.success }]}>
                            {remaining} remaining
                        </Text>
                    ) : (
                        <Text style={[styles.remainingLabel, { color: theme.colors.error }]}>
                            {Math.abs(goal - totalCalories)} over
                        </Text>
                    )}
                </View>
            </View>

            {/* Meal Type Breakdown */}
            <View style={styles.breakdownRow}>
                {['breakfast', 'lunch', 'dinner', 'snack'].map((type) => {
                    const typeMeals = todayMeals.filter(m => m.mealType === type);
                    const typeCalories = typeMeals.reduce((sum, m) => sum + m.calories, 0);
                    return (
                        <View
                            key={type}
                            style={[
                                styles.breakdownItem,
                                { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
                            ]}
                        >
                            <Text style={[styles.breakdownType, { color: theme.colors.textSecondary }]}>
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                            </Text>
                            <Text style={[styles.breakdownValue, { color: theme.colors.text }]}>
                                {typeCalories}
                            </Text>
                        </View>
                    );
                })}
            </View>

            {/* Add Meal Button */}
            <TouchableOpacity
                style={[styles.addButton, { backgroundColor: theme.colors.primary }, shadows.md]}
                onPress={() => setShowModal(true)}
            >
                <Ionicons name="add-circle" size={24} color="#FFFFFF" />
                <Text style={styles.addButtonText}>Log Meal</Text>
            </TouchableOpacity>

            {/* Today's Meals List */}
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                Today's Meals
            </Text>
            {todayMeals.length === 0 ? (
                <View style={[styles.emptyState, { backgroundColor: theme.colors.surfaceVariant }]}>
                    <Ionicons name="restaurant-outline" size={48} color={theme.colors.textSecondary} />
                    <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
                        No meals logged today
                    </Text>
                    <Text style={[styles.emptySubtext, { color: theme.colors.textSecondary }]}>
                        Tap the button above to log your first meal
                    </Text>
                </View>
            ) : (
                todayMeals.slice().reverse().map((meal) => (
                    <MealCard
                        key={meal.id}
                        meal={meal}
                        onDelete={handleDeleteMeal}
                    />
                ))
            )}

            {/* Modal */}
            <AddMealModal
                visible={showModal}
                onClose={() => setShowModal(false)}
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
    overviewCard: {
        padding: spacing.lg,
        borderRadius: borderRadius.lg,
        marginBottom: spacing.md,
    },
    overviewHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    overviewTitle: {
        ...typography.body,
    },
    goalBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.full,
        gap: 4,
    },
    goalText: {
        ...typography.caption,
    },
    calorieDisplay: {
        flexDirection: 'row',
        alignItems: 'baseline',
        marginBottom: spacing.md,
    },
    calorieValue: {
        fontSize: 48,
        fontWeight: '700',
        lineHeight: 56,
    },
    calorieUnit: {
        ...typography.h3,
        marginLeft: spacing.xs,
    },
    progressBarBg: {
        height: 8,
        borderRadius: borderRadius.full,
        overflow: 'hidden',
        marginBottom: spacing.sm,
    },
    progressBarFill: {
        height: '100%',
        borderRadius: borderRadius.full,
    },
    progressLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    progressLabel: {
        ...typography.caption,
    },
    remainingLabel: {
        ...typography.caption,
        fontWeight: '600',
    },
    breakdownRow: {
        flexDirection: 'row',
        gap: spacing.xs,
        marginBottom: spacing.lg,
    },
    breakdownItem: {
        flex: 1,
        alignItems: 'center',
        padding: spacing.sm,
        borderRadius: borderRadius.sm,
        borderWidth: 1,
    },
    breakdownType: {
        ...typography.caption,
    },
    breakdownValue: {
        ...typography.body,
        fontWeight: '600',
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.md,
        borderRadius: borderRadius.md,
        marginBottom: spacing.lg,
        gap: spacing.sm,
    },
    addButtonText: {
        ...typography.button,
        color: '#FFFFFF',
    },
    sectionTitle: {
        ...typography.h3,
        marginBottom: spacing.md,
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
