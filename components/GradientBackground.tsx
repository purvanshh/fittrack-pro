import { LinearGradient } from 'expo-linear-gradient';
import React, { ReactNode } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { gradients } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';

interface GradientBackgroundProps {
    children: ReactNode;
    style?: ViewStyle;
    variant?: 'default' | 'subtle' | 'vibrant';
}

/**
 * GradientBackground - A dynamic gradient background component
 * 
 * Automatically adapts to light/dark theme with beautiful gradients
 * that complement the glassmorphism design
 */
export default function GradientBackground({
    children,
    style,
    variant = 'default',
}: GradientBackgroundProps) {
    const { theme } = useTheme();
    const isDark = theme.mode === 'dark';

    const getGradientColors = () => {
        if (variant === 'subtle') {
            return isDark
                ? ['#0A0A0F', '#0F0F1A', '#0A0A0F'] as const
                : ['#F8FAFC', '#EEF2FF', '#F8FAFC'] as const;
        }

        if (variant === 'vibrant') {
            return isDark
                ? ['#0F0F1A', '#1A0F2E', '#0F1A2E', '#0A0A0F'] as const
                : ['#E0E7FF', '#FCE7F3', '#E0F2FE', '#F0FDF4'] as const;
        }

        // Default gradient
        return isDark
            ? gradients.darkBackground
            : gradients.lightBackground;
    };

    return (
        <View style={[styles.container, style]}>
            <LinearGradient
                colors={getGradientColors()}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradient}
            />
            {/* Subtle noise/texture overlay effect */}
            <View style={styles.noiseOverlay} />
            {/* Content */}
            <View style={styles.content}>
                {children}
            </View>
        </View>
    );
}

/**
 * Orb gradient decorations for background ambiance
 */
export function GradientOrb({
    color,
    size = 200,
    position,
    opacity = 0.3,
}: {
    color: string;
    size?: number;
    position: { top?: number; bottom?: number; left?: number; right?: number };
    opacity?: number;
}) {
    return (
        <View
            style={[
                styles.orb,
                {
                    width: size,
                    height: size,
                    borderRadius: size / 2,
                    backgroundColor: color,
                    opacity,
                    ...position,
                },
            ]}
        />
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative',
    },
    gradient: {
        ...StyleSheet.absoluteFillObject,
    },
    noiseOverlay: {
        ...StyleSheet.absoluteFillObject,
        opacity: 0.02,
    },
    content: {
        flex: 1,
        position: 'relative',
        zIndex: 1,
    },
    orb: {
        position: 'absolute',
        // Blur effect would be applied with BlurView on iOS
        // Using simple opacity for cross-platform
    },
});
