import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { borderRadius, shadows, spacing, typography } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';
import { Meal } from '../types';
import { formatDateShort } from '../utils/dateUtils';

interface MealCardProps {
    meal: Meal;
    onDelete?: (id: string) => void;
    showDate?: boolean;
}

export default function MealCard({
    meal,
    onDelete,
    showDate = false,
}: MealCardProps) {
    const { theme } = useTheme();

    const getMealIcon = (mealType?: string) => {
        switch (mealType) {
            case 'breakfast': return 'sunny-outline';
            case 'lunch': return 'restaurant-outline';
            case 'dinner': return 'moon-outline';
            case 'snack': return 'cafe-outline';
            default: return 'fast-food-outline';
        }
    };

    return (
        <View
            style={[
                styles.container,
                {
                    backgroundColor: theme.colors.surface,
                    borderColor: theme.colors.border,
                },
                shadows.sm,
            ]}
        >
            <View style={[styles.iconContainer, { backgroundColor: theme.colors.calories + '15' }]}>
                <Ionicons
                    name={getMealIcon(meal.mealType) as any}
                    size={24}
                    color={theme.colors.calories}
                />
            </View>

            <View style={styles.content}>
                <Text style={[styles.title, { color: theme.colors.text }]} numberOfLines={1}>
                    {meal.food}
                </Text>
                <View style={styles.details}>
                    <View style={styles.detailItem}>
                        <Ionicons name="flame-outline" size={14} color={theme.colors.calories} />
                        <Text style={[styles.detailText, { color: theme.colors.textSecondary }]}>
                            {meal.calories} cal
                        </Text>
                    </View>
                    {meal.mealType && (
                        <Text style={[styles.mealType, { color: theme.colors.textSecondary }]}>
                            {meal.mealType.charAt(0).toUpperCase() + meal.mealType.slice(1)}
                        </Text>
                    )}
                </View>
                {showDate && (
                    <Text style={[styles.date, { color: theme.colors.textSecondary }]}>
                        {formatDateShort(meal.date)}
                    </Text>
                )}
            </View>

            {onDelete && (
                <TouchableOpacity
                    onPress={() => onDelete(meal.id)}
                    style={styles.deleteButton}
                >
                    <Ionicons name="trash-outline" size={20} color={theme.colors.error} />
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
        borderRadius: borderRadius.md,
        borderWidth: 1,
        marginBottom: spacing.sm,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: borderRadius.md,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.md,
    },
    content: {
        flex: 1,
    },
    title: {
        ...typography.body,
        fontWeight: '600',
        marginBottom: 4,
    },
    details: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    detailText: {
        ...typography.caption,
    },
    mealType: {
        ...typography.caption,
        fontStyle: 'italic',
    },
    date: {
        ...typography.caption,
        marginTop: 4,
    },
    deleteButton: {
        padding: spacing.sm,
    },
});
