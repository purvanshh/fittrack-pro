import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { typography } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';

interface ProgressRingProps {
    progress: number; // 0 to 1
    size?: number;
    strokeWidth?: number;
    color?: string;
    backgroundColor?: string;
    label?: string;
    value?: string;
    animated?: boolean;
}

export default function ProgressRing({
    progress,
    size = 120,
    strokeWidth = 10,
    color,
    backgroundColor,
    label,
    value,
    animated = true,
}: ProgressRingProps) {
    const { theme } = useTheme();
    const animatedProgress = useRef(new Animated.Value(0)).current;

    const ringColor = color || theme.colors.primary;
    const bgColor = backgroundColor || theme.colors.border;

    // Clamp progress between 0 and 1
    const clampedProgress = Math.min(Math.max(progress, 0), 1);

    useEffect(() => {
        if (animated) {
            Animated.timing(animatedProgress, {
                toValue: clampedProgress,
                duration: 1000,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: false,
            }).start();
        } else {
            animatedProgress.setValue(clampedProgress);
        }
    }, [clampedProgress, animated]);

    const percentage = Math.round(clampedProgress * 100);

    // For the visual representation, we'll use multiple overlapping half-circles
    const innerSize = size - strokeWidth * 2;

    return (
        <View style={[styles.container, { width: size, height: size }]}>
            {/* Background Ring */}
            <View
                style={[
                    styles.ring,
                    {
                        width: size,
                        height: size,
                        borderRadius: size / 2,
                        borderWidth: strokeWidth,
                        borderColor: bgColor,
                    },
                ]}
            />

            {/* Progress Ring - Left Half (0-50%) */}
            <View style={[styles.halfContainer, { width: size / 2, height: size, left: 0 }]}>
                <Animated.View
                    style={[
                        styles.halfCircle,
                        {
                            width: size,
                            height: size,
                            borderRadius: size / 2,
                            borderWidth: strokeWidth,
                            borderColor: ringColor,
                            borderRightColor: 'transparent',
                            borderTopColor: 'transparent',
                            left: 0,
                            transform: [
                                {
                                    rotate: animatedProgress.interpolate({
                                        inputRange: [0, 0.5, 1],
                                        outputRange: ['0deg', '180deg', '180deg'],
                                    }),
                                },
                            ],
                        },
                    ]}
                />
            </View>

            {/* Progress Ring - Right Half (50-100%) */}
            <View style={[styles.halfContainer, { width: size / 2, height: size, right: 0 }]}>
                <Animated.View
                    style={[
                        styles.halfCircle,
                        {
                            width: size,
                            height: size,
                            borderRadius: size / 2,
                            borderWidth: strokeWidth,
                            borderColor: ringColor,
                            borderLeftColor: 'transparent',
                            borderBottomColor: 'transparent',
                            right: 0,
                            transform: [
                                {
                                    rotate: animatedProgress.interpolate({
                                        inputRange: [0, 0.5, 1],
                                        outputRange: ['0deg', '0deg', '180deg'],
                                    }),
                                },
                            ],
                        },
                    ]}
                />
            </View>

            {/* Center Content */}
            <View style={[styles.centerContent, { width: innerSize, height: innerSize }]}>
                {value ? (
                    <Text style={[styles.value, { color: ringColor }]} numberOfLines={1} adjustsFontSizeToFit>
                        {value}
                    </Text>
                ) : (
                    <Text style={[styles.percentage, { color: ringColor }]}>
                        {percentage}%
                    </Text>
                )}
                {label && (
                    <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
                        {label}
                    </Text>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    ring: {
        position: 'absolute',
    },
    halfContainer: {
        position: 'absolute',
        overflow: 'hidden',
    },
    halfCircle: {
        position: 'absolute',
    },
    centerContent: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    value: {
        fontSize: 18,
        fontWeight: '700',
    },
    percentage: {
        ...typography.h2,
        fontWeight: '700',
    },
    label: {
        ...typography.caption,
        marginTop: 2,
    },
});
