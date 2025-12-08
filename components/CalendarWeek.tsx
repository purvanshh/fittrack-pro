import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { borderRadius, spacing, typography } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';

interface CalendarWeekProps {
    currentDate: string; // YYYY-MM-DD
    onDateSelect?: (date: string) => void;
    activeDays?: string[]; // Array of dates that have activity
}

export default function CalendarWeek({ currentDate, onDateSelect, activeDays = [] }: CalendarWeekProps) {
    const { theme } = useTheme();

    // Get current week dates
    const getWeekDates = () => {
        const today = new Date(currentDate);
        const dayOfWeek = today.getDay();
        const monday = new Date(today);
        monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));

        const dates = [];
        for (let i = 0; i < 7; i++) {
            const date = new Date(monday);
            date.setDate(monday.getDate() + i);
            dates.push({
                date: date.toISOString().split('T')[0],
                dayName: ['M', 'T', 'W', 'T', 'F', 'S', 'S'][i],
                dayNumber: date.getDate(),
                isToday: date.toISOString().split('T')[0] === currentDate,
                hasActivity: activeDays.includes(date.toISOString().split('T')[0]),
            });
        }
        return dates;
    };

    const weekDates = getWeekDates();

    // Get month and year
    const currentDateObj = new Date(currentDate);
    const monthYear = currentDateObj.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
            {/* Month Header */}
            <View style={styles.header}>
                <Text style={[styles.monthText, { color: theme.colors.text }]}>
                    {monthYear}
                </Text>
                <View style={styles.navButtons}>
                    <TouchableOpacity style={[styles.navButton, { backgroundColor: theme.colors.surfaceVariant }]}>
                        <Ionicons name="chevron-back" size={18} color={theme.colors.text} />
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.navButton, { backgroundColor: theme.colors.surfaceVariant }]}>
                        <Ionicons name="chevron-forward" size={18} color={theme.colors.text} />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Week Days */}
            <View style={styles.weekContainer}>
                {weekDates.map((day) => (
                    <TouchableOpacity
                        key={day.date}
                        style={[
                            styles.dayContainer,
                            day.isToday && [styles.todayContainer, { backgroundColor: theme.colors.primary }],
                        ]}
                        onPress={() => onDateSelect?.(day.date)}
                    >
                        <Text
                            style={[
                                styles.dayName,
                                { color: day.isToday ? '#000000' : theme.colors.textSecondary },
                            ]}
                        >
                            {day.dayName}
                        </Text>
                        <Text
                            style={[
                                styles.dayNumber,
                                { color: day.isToday ? '#000000' : theme.colors.text },
                            ]}
                        >
                            {day.dayNumber}
                        </Text>
                        {day.hasActivity && !day.isToday && (
                            <View style={[styles.activityDot, { backgroundColor: theme.colors.primary }]} />
                        )}
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        marginBottom: spacing.md,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    monthText: {
        ...typography.h3,
    },
    navButtons: {
        flexDirection: 'row',
        gap: spacing.xs,
    },
    navButton: {
        width: 32,
        height: 32,
        borderRadius: borderRadius.full,
        alignItems: 'center',
        justifyContent: 'center',
    },
    weekContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    dayContainer: {
        alignItems: 'center',
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.sm,
        borderRadius: borderRadius.lg,
        minWidth: 40,
    },
    todayContainer: {
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.sm,
    },
    dayName: {
        ...typography.caption,
        marginBottom: spacing.xs,
    },
    dayNumber: {
        ...typography.body,
        fontWeight: '600',
    },
    activityDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        marginTop: spacing.xs,
    },
});
