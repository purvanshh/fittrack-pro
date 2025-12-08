import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { borderRadius, spacing, typography } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';

interface DumbbellProgressProps {
    current: number;
    goal: number;
    size?: number;
}

export default function DumbbellProgress({ current, goal, size = 120 }: DumbbellProgressProps) {
    const { theme } = useTheme();
    const fillAnim = useRef(new Animated.Value(0)).current;

    const progress = Math.min(current / goal, 1);

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

    const weightWidth = size * 0.35;
    const barWidth = size * 0.15;
    const barHeight = size * 0.5;

    return (
        <View style={[styles.container, { width: size, height: size + 30 }]}>
            {/* Dumbbell */}
            <View style={[styles.dumbbell, { height: size }]}>
                {/* Top weight */}
                <View
                    style={[
                        styles.weight,
                        {
                            width: weightWidth,
                            height: weightWidth * 0.6,
                            backgroundColor: theme.colors.border,
                            borderRadius: borderRadius.sm,
                        }
                    ]}
                >
                    <Animated.View
                        style={[
                            styles.weightFill,
                            {
                                backgroundColor: theme.colors.workout,
                                height: fillHeight,
                                borderRadius: borderRadius.sm - 2,
                            },
                        ]}
                    />
                </View>

                {/* Bar */}
                <View
                    style={[
                        styles.bar,
                        {
                            width: barWidth,
                            height: barHeight,
                            backgroundColor: theme.colors.border,
                        }
                    ]}
                >
                    <Animated.View
                        style={[
                            styles.barFill,
                            {
                                backgroundColor: theme.colors.workout,
                                height: fillHeight,
                            },
                        ]}
                    />
                </View>

                {/* Bottom weight */}
                <View
                    style={[
                        styles.weight,
                        {
                            width: weightWidth,
                            height: weightWidth * 0.6,
                            backgroundColor: theme.colors.border,
                            borderRadius: borderRadius.sm,
                        }
                    ]}
                >
                    <Animated.View
                        style={[
                            styles.weightFill,
                            {
                                backgroundColor: theme.colors.workout,
                                height: fillHeight,
                                borderRadius: borderRadius.sm - 2,
                            },
                        ]}
                    />
                </View>

                {/* Icon overlay */}
                <View style={styles.iconContainer}>
                    <Ionicons name="barbell" size={size * 0.2} color="#FFFFFF" />
                </View>
            </View>

            {/* Label */}
            <Text style={[styles.value, { color: theme.colors.workout }]}>
                {current}
            </Text>
            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
                of {goal} workouts
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    dumbbell: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    weight: {
        position: 'relative',
        overflow: 'hidden',
    },
    weightFill: {
        position: 'absolute',
        bottom: 0,
        left: 2,
        right: 2,
    },
    bar: {
        position: 'relative',
        overflow: 'hidden',
        marginVertical: 2,
    },
    barFill: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
    iconContainer: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
    },
    value: {
        ...typography.h3,
        fontWeight: '700',
        marginTop: spacing.xs,
    },
    label: {
        ...typography.caption,
    },
});
