import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { spacing, typography } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';

interface WaterDropletProps {
    current: number;
    goal: number;
    size?: number;
}

export default function WaterDroplet({ current, goal, size = 120 }: WaterDropletProps) {
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

    const dropletWidth = size * 0.7;
    const dropletHeight = size;

    return (
        <View style={[styles.container, { width: size, height: size + 30 }]}>
            {/* Droplet shape */}
            <View style={[styles.droplet, { width: dropletWidth, height: dropletHeight }]}>
                {/* Background */}
                <View
                    style={[
                        styles.dropletBg,
                        {
                            backgroundColor: theme.colors.border,
                            borderRadius: dropletWidth / 2,
                        }
                    ]}
                />

                {/* Fill */}
                <Animated.View
                    style={[
                        styles.dropletFill,
                        {
                            backgroundColor: theme.colors.water,
                            height: fillHeight,
                            borderBottomLeftRadius: dropletWidth / 2,
                            borderBottomRightRadius: dropletWidth / 2,
                        },
                    ]}
                />

                {/* Droplet point (top) */}
                <View
                    style={[
                        styles.dropletPoint,
                        {
                            borderBottomColor: progress > 0.85 ? theme.colors.water : theme.colors.border,
                            borderBottomWidth: dropletWidth * 0.4,
                            borderLeftWidth: dropletWidth * 0.25,
                            borderRightWidth: dropletWidth * 0.25,
                        }
                    ]}
                />

                {/* Icon overlay */}
                <View style={styles.iconContainer}>
                    <Ionicons name="water" size={size * 0.25} color="#FFFFFF" />
                </View>
            </View>

            {/* Label */}
            <Text style={[styles.value, { color: theme.colors.water }]}>
                {current >= 1000 ? `${(current / 1000).toFixed(1)}L` : `${current}ml`}
            </Text>
            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
                {percentage}% of {goal >= 1000 ? `${(goal / 1000).toFixed(1)}L` : `${goal}ml`}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    droplet: {
        position: 'relative',
        overflow: 'hidden',
    },
    dropletBg: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '70%',
    },
    dropletFill: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
    dropletPoint: {
        position: 'absolute',
        top: 0,
        alignSelf: 'center',
        width: 0,
        height: 0,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
    },
    iconContainer: {
        position: 'absolute',
        top: '40%',
        left: 0,
        right: 0,
        alignItems: 'center',
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
