import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { borderRadius, spacing, typography } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';

interface CalendarWeekProps {
    currentDate: string; // YYYY-MM-DD - the reference date for the week
    selectedDate: string; // YYYY-MM-DD - the currently selected date
    onDateSelect?: (date: string) => void;
    onWeekChange?: (newDate: string) => void; // Navigate to previous/next week
    activeDays?: string[]; // Array of dates that have activity
}

export default function CalendarWeek({
    currentDate,
    selectedDate,
    onDateSelect,
    onWeekChange,
    activeDays = []
}: CalendarWeekProps) {
    const { theme } = useTheme();
    const today = new Date().toISOString().split('T')[0];

    // Get current week dates based on the reference date
    const getWeekDates = () => {
        const refDate = new Date(currentDate);
        const dayOfWeek = refDate.getDay();
        const monday = new Date(refDate);
        monday.setDate(refDate.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));

        const dates = [];
        for (let i = 0; i < 7; i++) {
            const date = new Date(monday);
            date.setDate(monday.getDate() + i);
            const dateStr = date.toISOString().split('T')[0];
            dates.push({
                date: dateStr,
                dayName: ['M', 'T', 'W', 'T', 'F', 'S', 'S'][i],
                dayNumber: date.getDate(),
                isToday: dateStr === today,
                isSelected: dateStr === selectedDate,
                hasActivity: activeDays.includes(dateStr),
            });
        }
        return dates;
    };

    const weekDates = getWeekDates();

    // Get month and year from the first day of the week
    const firstDayOfWeek = new Date(weekDates[0].date);
    const monthYear = firstDayOfWeek.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    // Navigate to previous week
    const goToPreviousWeek = () => {
        const refDate = new Date(currentDate);
        refDate.setDate(refDate.getDate() - 7);
        onWeekChange?.(refDate.toISOString().split('T')[0]);
    };

    // Navigate to next week
    const goToNextWeek = () => {
        const refDate = new Date(currentDate);
        refDate.setDate(refDate.getDate() + 7);
        onWeekChange?.(refDate.toISOString().split('T')[0]);
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
            {/* Month Header */}
            <View style={styles.header}>
                <Text style={[styles.monthText, { color: theme.colors.text }]}>
                    {monthYear}
                </Text>
                <View style={styles.navButtons}>
                    <TouchableOpacity
                        style={[styles.navButton, { backgroundColor: theme.colors.surfaceVariant }]}
                        onPress={goToPreviousWeek}
                    >
                        <Ionicons name="chevron-back" size={18} color={theme.colors.text} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.navButton, { backgroundColor: theme.colors.surfaceVariant }]}
                        onPress={goToNextWeek}
                    >
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
                            day.isSelected && [styles.selectedContainer, { backgroundColor: theme.colors.primary }],
                            day.isToday && !day.isSelected && [styles.todayBorder, { borderColor: theme.colors.primary }],
                        ]}
                        onPress={() => onDateSelect?.(day.date)}
                    >
                        <Text
                            style={[
                                styles.dayName,
                                { color: day.isSelected ? '#000000' : theme.colors.textSecondary },
                            ]}
                        >
                            {day.dayName}
                        </Text>
                        <Text
                            style={[
                                styles.dayNumber,
                                { color: day.isSelected ? '#000000' : theme.colors.text },
                                day.isToday && !day.isSelected && { color: theme.colors.primary },
                            ]}
                        >
                            {day.dayNumber}
                        </Text>
                        {day.hasActivity && !day.isSelected && (
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
        width: 36,
        height: 36,
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
    selectedContainer: {
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.sm,
    },
    todayBorder: {
        borderWidth: 2,
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
