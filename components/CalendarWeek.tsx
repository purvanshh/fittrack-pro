import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { borderRadius, glassStyles, shadows, spacing, typography } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';

interface CalendarWeekProps {
    currentDate: string; // YYYY-MM-DD - the reference date for the week
    selectedDate: string; // YYYY-MM-DD - the currently selected date
    onDateSelect?: (date: string) => void;
    onWeekChange?: (newDate: string) => void; // Navigate to previous/next week
    onMonthPress?: () => void; // Open monthly view
    activeDays?: string[]; // Array of dates that have activity
}

export default function CalendarWeek({
    currentDate,
    selectedDate,
    onDateSelect,
    onWeekChange,
    onMonthPress,
    activeDays = []
}: CalendarWeekProps) {
    const { theme } = useTheme();
    const isDark = theme.mode === 'dark';
    const today = new Date().toISOString().split('T')[0];
    const glassStyle = isDark ? glassStyles.dark : glassStyles.light;

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
        <View style={[styles.container, glassStyle.surface, shadows.glass]}>
            {/* Glass gradient overlay */}
            <LinearGradient
                colors={isDark
                    ? ['rgba(255,255,255,0.08)', 'rgba(255,255,255,0.02)'] as const
                    : ['rgba(255,255,255,0.6)', 'rgba(255,255,255,0.3)'] as const
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
            />

            {/* Month Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={onMonthPress}
                    style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}
                    activeOpacity={0.7}
                >
                    <Text style={[styles.monthText, { color: theme.colors.text }]}>
                        {monthYear}
                    </Text>
                    <Ionicons name="chevron-down" size={16} color={theme.colors.textSecondary} />
                </TouchableOpacity>
                <View style={styles.navButtons}>
                    <TouchableOpacity
                        style={[styles.navButton, glassStyle.subtle]}
                        onPress={goToPreviousWeek}
                    >
                        <Ionicons name="chevron-back" size={18} color={theme.colors.text} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.navButton, glassStyle.subtle]}
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
                            day.isSelected && styles.selectedContainer,
                            day.isSelected && shadows.glow(theme.colors.primary),
                            day.isToday && !day.isSelected && styles.todayBorder,
                            day.isToday && !day.isSelected && { borderColor: theme.colors.primary },
                        ]}
                        onPress={() => onDateSelect?.(day.date)}
                        activeOpacity={0.7}
                    >
                        {/* Selected Background Gradient */}
                        {day.isSelected && (
                            <View style={[StyleSheet.absoluteFill, { zIndex: -1, borderRadius: borderRadius.lg, overflow: 'hidden' }]}>
                                <LinearGradient
                                    colors={[theme.colors.primary, `${theme.colors.primary}DD`] as const}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    style={StyleSheet.absoluteFill}
                                />
                            </View>
                        )}

                        {/* Day Content */}
                        <View style={[styles.dayContent, { elevation: 5, zIndex: 10, backgroundColor: 'transparent' }]}>
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
                        </View>
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
        overflow: 'hidden',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.md,
        zIndex: 1,
        elevation: 2,
    },
    monthText: {
        ...typography.h3,
    },
    navButtons: {
        flexDirection: 'row',
        gap: spacing.xs,
    },
    navButton: {
        width: 38,
        height: 38,
        borderRadius: 19,
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
        minWidth: 42,
        overflow: 'hidden',
    },
    selectedContainer: {
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.sm,
        borderWidth: 0, // Explicitly remove border when selected
    },
    todayBorder: {
        borderWidth: 2,
        backgroundColor: 'rgba(0, 255, 209, 0.1)', // Subtle background for today
    },
    dayName: {
        ...typography.caption,
        marginBottom: spacing.xs,
        fontWeight: '500',
    },
    dayNumber: {
        ...typography.body,
        fontWeight: '700',
    },
    dayContent: {
        alignItems: 'center',
        zIndex: 1,
    },
    activityDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        marginTop: spacing.xs,
    },
});

