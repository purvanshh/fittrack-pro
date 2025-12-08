import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { borderRadius, shadows, spacing, typography } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';
import { Workout, WORKOUT_TYPES } from '../types';
import { formatDateShort, formatDuration } from '../utils/dateUtils';

interface WorkoutCardProps {
    workout: Workout;
    onDelete?: (id: string) => void;
    showDate?: boolean;
}

export default function WorkoutCard({
    workout,
    onDelete,
    showDate = false,
}: WorkoutCardProps) {
    const { theme } = useTheme();
    const workoutInfo = WORKOUT_TYPES[workout.type];

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
            <View style={[styles.iconContainer, { backgroundColor: theme.colors.workout + '15' }]}>
                <Ionicons
                    name={workoutInfo.icon as any}
                    size={24}
                    color={theme.colors.workout}
                />
            </View>

            <View style={styles.content}>
                <Text style={[styles.title, { color: theme.colors.text }]}>
                    {workoutInfo.label}
                </Text>
                <View style={styles.details}>
                    <View style={styles.detailItem}>
                        <Ionicons name="time-outline" size={14} color={theme.colors.textSecondary} />
                        <Text style={[styles.detailText, { color: theme.colors.textSecondary }]}>
                            {formatDuration(workout.duration)}
                        </Text>
                    </View>
                    <View style={styles.detailItem}>
                        <Ionicons name="flame-outline" size={14} color={theme.colors.calories} />
                        <Text style={[styles.detailText, { color: theme.colors.textSecondary }]}>
                            {workout.calories} cal
                        </Text>
                    </View>
                </View>
                {showDate && (
                    <Text style={[styles.date, { color: theme.colors.textSecondary }]}>
                        {formatDateShort(workout.date)}
                    </Text>
                )}
            </View>

            {onDelete && (
                <TouchableOpacity
                    onPress={() => onDelete(workout.id)}
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
    date: {
        ...typography.caption,
        marginTop: 4,
    },
    deleteButton: {
        padding: spacing.sm,
    },
});
