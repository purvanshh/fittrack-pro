import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { Dimensions, Modal, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { borderRadius, glassStyles, spacing, typography } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';
import GlassCard from './GlassCard';

interface CalendarMonthProps {
    visible: boolean;
    onClose: () => void;
    selectedDate: string; // YYYY-MM-DD
    onDateSelect: (date: string) => void;
}

const { width } = Dimensions.get('window');

export default function CalendarMonth({
    visible,
    onClose,
    selectedDate,
    onDateSelect,
}: CalendarMonthProps) {
    const { theme } = useTheme();
    const isDark = theme.mode === 'dark';
    const glassStyle = isDark ? glassStyles.dark : glassStyles.light;

    // State for the currently viewed month (independent of selected date)
    const [viewDate, setViewDate] = useState(new Date(selectedDate));

    // Reset view date when modal opens
    useEffect(() => {
        if (visible) {
            setViewDate(new Date(selectedDate));
        }
    }, [visible, selectedDate]);

    const getMonthData = () => {
        const year = viewDate.getFullYear();
        const month = viewDate.getMonth();

        // First day of the month
        const firstDay = new Date(year, month, 1);
        // Last day of the month
        const lastDay = new Date(year, month + 1, 0);

        // Days in previous month to fill the first row
        // 0 = Sunday, 1 = Monday, etc. Adjust for Monday start if preferred, 
        // sticking to Sunday start for standard view or Monday if matching app style.
        // CalendarWeek uses Monday start logic typically?
        // Let's check CalendarWeek: 
        // "monday.setDate(refDate.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));"
        // It seems CalendarWeek forces Monday start. Let's stick to Monday start.

        const startDayOfWeek = firstDay.getDay(); // 0 (Sun) to 6 (Sat)
        // Convert to Monday start: 0->6 (Sun->6), 1->0 (Mon->0)
        const adjustedStartDay = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;

        const days = [];

        // Previous month filler
        const prevMonthLastDay = new Date(year, month, 0).getDate();
        for (let i = adjustedStartDay - 1; i >= 0; i--) {
            const d = new Date(year, month - 1, prevMonthLastDay - i);
            days.push({
                date: d.toISOString().split('T')[0],
                dayNumber: d.getDate(),
                isCurrentMonth: false,
                isToday: d.toISOString().split('T')[0] === new Date().toISOString().split('T')[0]
            });
        }

        // Current month days
        for (let i = 1; i <= lastDay.getDate(); i++) {
            const d = new Date(year, month, i);
            days.push({
                date: d.toISOString().split('T')[0],
                dayNumber: i,
                isCurrentMonth: true,
                isToday: d.toISOString().split('T')[0] === new Date().toISOString().split('T')[0]
            });
        }

        // Next month filler
        const remainingCells = 42 - days.length; // 6 rows * 7 cols = 42
        for (let i = 1; i <= remainingCells; i++) {
            const d = new Date(year, month + 1, i);
            days.push({
                date: d.toISOString().split('T')[0],
                dayNumber: i,
                isCurrentMonth: false,
                isToday: d.toISOString().split('T')[0] === new Date().toISOString().split('T')[0]
            });
        }

        return days;
    };

    const days = getMonthData();
    const monthYear = viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

    const handlePrevMonth = () => {
        const newDate = new Date(viewDate);
        newDate.setMonth(newDate.getMonth() - 1);
        setViewDate(newDate);
    };

    const handleNextMonth = () => {
        const newDate = new Date(viewDate);
        newDate.setMonth(newDate.getMonth() + 1);
        setViewDate(newDate);
    };

    const handleToday = () => {
        const today = new Date();
        setViewDate(today);
        onDateSelect(today.toISOString().split('T')[0]);
    };

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.modalOverlay}>
                    <TouchableWithoutFeedback>
                        <View style={styles.modalContent}>
                            <GlassCard style={styles.card} variant="card">
                                {/* Header */}
                                <View style={styles.header}>
                                    <View style={styles.monthControls}>
                                        <TouchableOpacity onPress={handlePrevMonth} style={styles.navButton}>
                                            <Ionicons name="chevron-back" size={20} color={theme.colors.text} />
                                        </TouchableOpacity>
                                        <Text style={[styles.monthText, { color: theme.colors.text }]}>
                                            {monthYear}
                                        </Text>
                                        <TouchableOpacity onPress={handleNextMonth} style={styles.navButton}>
                                            <Ionicons name="chevron-forward" size={20} color={theme.colors.text} />
                                        </TouchableOpacity>
                                    </View>
                                    <TouchableOpacity onPress={handleToday}>
                                        <Text style={[styles.todayLink, { color: theme.colors.primary }]}>Today</Text>
                                    </TouchableOpacity>
                                </View>

                                {/* Week Days Header */}
                                <View style={styles.weekRow}>
                                    {weekDays.map((d, i) => (
                                        <Text key={i} style={[styles.weekDayText, { color: theme.colors.textSecondary }]}>
                                            {d}
                                        </Text>
                                    ))}
                                </View>

                                {/* Calendar Grid */}
                                <View style={styles.grid}>
                                    {days.map((day, index) => {
                                        const isSelected = day.date === selectedDate;
                                        return (
                                            <TouchableOpacity
                                                key={day.date}
                                                style={[
                                                    styles.dayCell,
                                                    isSelected && styles.selectedCell,
                                                    day.isToday && !isSelected && styles.todayCell,
                                                ]}
                                                onPress={() => onDateSelect(day.date)}
                                                disabled={!day.isCurrentMonth} // Optional: disable interactions for adjacent months
                                            >
                                                {isSelected && (
                                                    <LinearGradient
                                                        colors={[theme.colors.primary, theme.colors.primary + 'CC']}
                                                        style={StyleSheet.absoluteFill}
                                                    />
                                                )}
                                                <Text
                                                    style={[
                                                        styles.dayText,
                                                        {
                                                            color: isSelected
                                                                ? '#000'
                                                                : day.isCurrentMonth
                                                                    ? theme.colors.text
                                                                    : theme.colors.textSecondary + '50'
                                                        },
                                                        day.isToday && !isSelected && { color: theme.colors.primary, fontWeight: '700' }
                                                    ]}
                                                >
                                                    {day.dayNumber}
                                                </Text>
                                                {day.isToday && !isSelected && (
                                                    <View style={[styles.todayDot, { backgroundColor: theme.colors.primary }]} />
                                                )}
                                            </TouchableOpacity>
                                        );
                                    })}
                                </View>
                            </GlassCard>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: spacing.md,
    },
    modalContent: {
        width: '100%',
        maxWidth: 400,
    },
    card: {
        padding: spacing.md,
        borderRadius: borderRadius.xl,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.lg,
    },
    monthControls: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    monthText: {
        ...typography.h3,
        minWidth: 140,
        textAlign: 'center',
    },
    navButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255,255,255,0.05)',
    },
    todayLink: {
        ...typography.bodySmall,
        fontWeight: '600',
    },
    weekRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: spacing.sm,
    },
    weekDayText: {
        width: (width - 64) / 7, // Approximate width calculation accounting for padding
        textAlign: 'center',
        ...typography.caption,
        fontWeight: '600',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    dayCell: {
        width: '14.28%', // 100% / 7
        aspectRatio: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: borderRadius.md,
        overflow: 'hidden',
        position: 'relative',
    },
    selectedCell: {
        // borderRadius: borderRadius.md, // inherited
    },
    todayCell: {
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    dayText: {
        ...typography.body,
        fontWeight: '500',
    },
    todayDot: {
        position: 'absolute',
        bottom: 6,
        width: 4,
        height: 4,
        borderRadius: 2,
    },
});
