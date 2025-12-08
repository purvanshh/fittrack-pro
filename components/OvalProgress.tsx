import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { spacing, typography } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';

interface OvalProgressProps {
    current: number;
    goal: number;
    type: 'water' | 'calories' | 'workout';
    size?: number;
    label?: string;
    unit?: string;
}

export default function OvalProgress({
    current,
    goal,
    type,
    size = 100,
    label,
    unit
}: OvalProgressProps) {
    const { theme } = useTheme();
    const fillAnim = useRef(new Animated.Value(0)).current;

    const progress = Math.min(current / goal, 1);
    const percentage = Math.round(progress * 100);

    useEffect(() => {
        Animated.timing(fillAnim, {
            toValue: progress,
            duration: 800,
            useNativeDriver: false,
        }).start();
    }, [progress]);

    const fillHeight = fillAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%'],
    });

    // Colors and icons based on type
    const config = {
        water: {
            color: theme.colors.water,
            icon: 'water' as const,
            defaultLabel: 'Water',
            defaultUnit: current >= 1000 ? 'L' : 'ml',
        },
        calories: {
            color: theme.colors.calories,
            icon: 'flame' as const,
            defaultLabel: 'Calories',
            defaultUnit: 'kcal',
        },
        workout: {
            color: theme.colors.workout,
            icon: 'barbell' as const,
            defaultLabel: 'Workout',
            defaultUnit: '',
        },
    }[type];

    const displayValue = type === 'water' && current >= 1000
        ? (current / 1000).toFixed(1)
        : current.toString();

    const ovalWidth = size * 0.7;
    const ovalHeight = size;

    return (
        <View style={[styles.container, { width: size, height: size + 50 }]}>
            {/* Oval container */}
            <View
                style={[
                    styles.oval,
                    {
                        width: ovalWidth,
                        height: ovalHeight,
                        borderRadius: ovalWidth / 2,
                        backgroundColor: theme.colors.border,
                    }
                ]}
            >
                {/* Fill */}
                <Animated.View
                    style={[
                        styles.fill,
                        {
                            backgroundColor: config.color,
                            height: fillHeight,
                            borderRadius: ovalWidth / 2,
                        },
                    ]}
                />

                {/* Icon */}
                <View style={styles.iconContainer}>
                    <Ionicons name={config.icon} size={size * 0.28} color="#FFFFFF" />
                </View>
            </View>

            {/* Value */}
            <Text style={[styles.value, { color: config.color }]}>
                {displayValue}
                {config.defaultUnit && <Text style={styles.unit}> {unit || config.defaultUnit}</Text>}
            </Text>

            {/* Label */}
            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
                {percentage}% of {type === 'water' && goal >= 1000 ? `${(goal / 1000).toFixed(1)}L` : goal} {label || config.defaultLabel}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    oval: {
        position: 'relative',
        overflow: 'hidden',
    },
    fill: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
    iconContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
    },
    value: {
        fontSize: 18,
        fontWeight: '700',
        marginTop: spacing.sm,
    },
    unit: {
        fontSize: 12,
        fontWeight: '400',
    },
    label: {
        ...typography.caption,
        textAlign: 'center',
    },
});
