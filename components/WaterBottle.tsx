import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { borderRadius, spacing, typography } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';
import { formatWater } from '../utils/dateUtils';

interface WaterBottleProps {
    current: number; // ml
    goal: number; // ml
    size?: number;
}

export default function WaterBottle({
    current,
    goal,
    size = 180,
}: WaterBottleProps) {
    const { theme } = useTheme();
    const animatedHeight = useRef(new Animated.Value(0)).current;

    const fillPercentage = Math.min(current / goal, 1);
    const bottleHeight = size;
    const bottleWidth = size * 0.5;
    const neckHeight = size * 0.15;
    const neckWidth = bottleWidth * 0.4;

    useEffect(() => {
        Animated.timing(animatedHeight, {
            toValue: fillPercentage,
            duration: 800,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: false,
        }).start();
    }, [fillPercentage]);

    const waterHeight = animatedHeight.interpolate({
        inputRange: [0, 1],
        outputRange: [0, bottleHeight * 0.75],
    });

    return (
        <View style={styles.container}>
            {/* Bottle Neck */}
            <View
                style={[
                    styles.neck,
                    {
                        width: neckWidth,
                        height: neckHeight,
                        backgroundColor: theme.colors.surfaceVariant,
                        borderColor: theme.colors.border,
                    },
                ]}
            />

            {/* Bottle Body */}
            <View
                style={[
                    styles.bottle,
                    {
                        width: bottleWidth,
                        height: bottleHeight * 0.8,
                        backgroundColor: theme.colors.surfaceVariant,
                        borderColor: theme.colors.border,
                    },
                ]}
            >
                {/* Water Fill */}
                <Animated.View
                    style={[
                        styles.water,
                        {
                            width: '100%',
                            height: waterHeight,
                            backgroundColor: theme.colors.water,
                        },
                    ]}
                />

                {/* Water Level Lines */}
                {[0.25, 0.5, 0.75].map((level) => (
                    <View
                        key={level}
                        style={[
                            styles.levelLine,
                            {
                                bottom: `${level * 100}%`,
                                backgroundColor: theme.colors.border,
                            },
                        ]}
                    />
                ))}
            </View>

            {/* Stats */}
            <View style={styles.stats}>
                <Text style={[styles.currentValue, { color: theme.colors.water }]}>
                    {formatWater(current)}
                </Text>
                <Text style={[styles.goalValue, { color: theme.colors.textSecondary }]}>
                    / {formatWater(goal)}
                </Text>
            </View>

            <Text style={[styles.percentage, { color: theme.colors.text }]}>
                {Math.round(fillPercentage * 100)}% of daily goal
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        paddingVertical: spacing.lg,
    },
    neck: {
        borderTopLeftRadius: borderRadius.sm,
        borderTopRightRadius: borderRadius.sm,
        borderWidth: 2,
        borderBottomWidth: 0,
        marginBottom: -2,
    },
    bottle: {
        borderRadius: borderRadius.lg,
        borderWidth: 2,
        overflow: 'hidden',
        justifyContent: 'flex-end',
    },
    water: {
        borderTopLeftRadius: borderRadius.sm,
        borderTopRightRadius: borderRadius.sm,
        opacity: 0.8,
    },
    levelLine: {
        position: 'absolute',
        left: 0,
        right: 0,
        height: 1,
        opacity: 0.5,
    },
    stats: {
        flexDirection: 'row',
        alignItems: 'baseline',
        marginTop: spacing.md,
    },
    currentValue: {
        ...typography.h1,
    },
    goalValue: {
        ...typography.h3,
        marginLeft: spacing.xs,
    },
    percentage: {
        ...typography.bodySmall,
        marginTop: spacing.xs,
    },
});
