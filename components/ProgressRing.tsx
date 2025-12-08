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

    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;

    useEffect(() => {
        if (animated) {
            Animated.timing(animatedProgress, {
                toValue: Math.min(progress, 1),
                duration: 1000,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: false,
            }).start();
        } else {
            animatedProgress.setValue(Math.min(progress, 1));
        }
    }, [progress, animated]);

    const strokeDashoffset = animatedProgress.interpolate({
        inputRange: [0, 1],
        outputRange: [circumference, 0],
    });

    const percentage = Math.round(Math.min(progress, 1) * 100);

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

            {/* Progress Ring using animated rotation technique */}
            <Animated.View
                style={[
                    styles.progressRing,
                    {
                        width: size,
                        height: size,
                        borderRadius: size / 2,
                        borderWidth: strokeWidth,
                        borderColor: ringColor,
                        borderTopColor: 'transparent',
                        borderRightColor: progress > 0.25 ? ringColor : 'transparent',
                        borderBottomColor: progress > 0.5 ? ringColor : 'transparent',
                        borderLeftColor: progress > 0.75 ? ringColor : 'transparent',
                        transform: [{ rotate: '-90deg' }],
                    },
                ]}
            />

            {/* Center Content */}
            <View style={styles.centerContent}>
                {value ? (
                    <Text style={[styles.value, { color: theme.colors.text }]}>
                        {value}
                    </Text>
                ) : (
                    <Text style={[styles.percentage, { color: theme.colors.text }]}>
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
    progressRing: {
        position: 'absolute',
    },
    centerContent: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    value: {
        ...typography.h3,
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
