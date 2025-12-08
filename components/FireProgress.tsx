import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { spacing, typography } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';

interface FireProgressProps {
    current: number;
    goal: number;
    size?: number;
}

export default function FireProgress({ current, goal, size = 120 }: FireProgressProps) {
    const { theme } = useTheme();
    const fillAnim = useRef(new Animated.Value(0)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;

    const progress = Math.min(current / goal, 1);
    const percentage = Math.round(progress * 100);

    useEffect(() => {
        Animated.timing(fillAnim, {
            toValue: progress,
            duration: 800,
            useNativeDriver: false,
        }).start();

        // Pulse animation for fire effect
        if (progress > 0) {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, {
                        toValue: 1.05,
                        duration: 600,
                        useNativeDriver: true,
                    }),
                    Animated.timing(pulseAnim, {
                        toValue: 1,
                        duration: 600,
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        }
    }, [progress]);

    const fillHeight = fillAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%'],
    });

    const flameColor = fillAnim.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [theme.colors.border, '#FFB347', theme.colors.calories],
    });

    return (
        <View style={[styles.container, { width: size, height: size + 30 }]}>
            {/* Flame container */}
            <Animated.View
                style={[
                    styles.flameContainer,
                    {
                        width: size * 0.75,
                        height: size,
                        transform: [{ scale: pulseAnim }],
                    }
                ]}
            >
                {/* Background flame shape */}
                <View
                    style={[
                        styles.flameBg,
                        { backgroundColor: theme.colors.border }
                    ]}
                />

                {/* Fill flame */}
                <Animated.View
                    style={[
                        styles.flameFill,
                        {
                            backgroundColor: theme.colors.calories,
                            height: fillHeight,
                        },
                    ]}
                />

                {/* Icon */}
                <View style={styles.iconContainer}>
                    <Ionicons name="flame" size={size * 0.4} color="#FFFFFF" />
                </View>
            </Animated.View>

            {/* Label */}
            <Text style={[styles.value, { color: theme.colors.calories }]}>
                {current}
            </Text>
            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
                {percentage}% of {goal} kcal
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    flameContainer: {
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 999,
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
    },
    flameBg: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        borderRadius: 999,
    },
    flameFill: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        borderBottomLeftRadius: 999,
        borderBottomRightRadius: 999,
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
        ...typography.h3,
        fontWeight: '700',
        marginTop: spacing.xs,
    },
    label: {
        ...typography.caption,
    },
});
