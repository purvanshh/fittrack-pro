import { LinearGradient } from 'expo-linear-gradient';
import React, { ReactNode } from 'react';
import {
    StyleSheet,
    View,
    ViewStyle
} from 'react-native';
import { borderRadius, glassStyles, shadows, spacing } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';

interface GlassCardProps {
    children: ReactNode;
    style?: ViewStyle;
    variant?: 'surface' | 'card' | 'subtle';
    glowColor?: string;
    noPadding?: boolean;
    noGradient?: boolean;
}

/**
 * GlassCard - A glassmorphism-styled card component
 * 
 * Features:
 * - Translucent background with gradient overlay
 * - Subtle border for depth
 * - Optional glow effect
 * - Adapts to light/dark theme
 */
export default function GlassCard({
    children,
    style,
    variant = 'card',
    glowColor,
    noPadding = false,
    noGradient = false,
}: GlassCardProps) {
    const { theme } = useTheme();
    const isDark = theme.mode === 'dark';

    const glassStyle = isDark
        ? glassStyles.dark[variant]
        : glassStyles.light[variant];

    const gradientColors = isDark
        ? ['rgba(255,255,255,0.08)', 'rgba(255,255,255,0.02)'] as const
        : ['rgba(255,255,255,0.6)', 'rgba(255,255,255,0.3)'] as const;

    const glowStyles = glowColor
        ? shadows.glow(glowColor)
        : shadows.glass;

    return (
        <View
            style={[
                styles.container,
                glassStyle,
                glowStyles,
                noPadding ? {} : styles.padding,
                style,
            ]}
        >
            {/* Gradient overlay for glass effect */}
            {!noGradient && (
                <LinearGradient
                    colors={gradientColors}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.gradientOverlay}
                />
            )}

            {/* Inner highlight line for glass depth */}
            <View
                style={[
                    styles.innerHighlight,
                    {
                        backgroundColor: isDark
                            ? 'rgba(255,255,255,0.1)'
                            : 'rgba(255,255,255,0.8)'
                    }
                ]}
            />

            {/* Content */}
            <View style={styles.content}>
                {children}
            </View>
        </View>
    );
}

/**
 * GlassButton - A glassmorphism-styled touchable button
 * Exported as a sub-component of GlassCard module
 */
export function GlassCardAccent({
    children,
    style,
    color,
}: {
    children: ReactNode;
    style?: ViewStyle;
    color?: string;
}) {
    const { theme } = useTheme();
    const accentColor = color || theme.colors.primary;
    const isDark = theme.mode === 'dark';

    return (
        <View
            style={[
                styles.accentCard,
                shadows.glow(accentColor),
                style,
            ]}
        >
            <LinearGradient
                colors={[
                    accentColor,
                    isDark ? `${accentColor}CC` : `${accentColor}DD`,
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.accentGradient}
            />
            <View style={styles.accentContent}>
                {children}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: borderRadius.lg,
        overflow: 'hidden',
        position: 'relative',
    },
    padding: {
        padding: spacing.md,
    },
    gradientOverlay: {
        ...StyleSheet.absoluteFillObject,
        borderRadius: borderRadius.lg,
    },
    innerHighlight: {
        position: 'absolute',
        top: 0,
        left: spacing.md,
        right: spacing.md,
        height: 1,
        borderRadius: 1,
    },
    content: {
        position: 'relative',
        zIndex: 1,
    },
    accentCard: {
        borderRadius: borderRadius.lg,
        overflow: 'hidden',
        position: 'relative',
    },
    accentGradient: {
        ...StyleSheet.absoluteFillObject,
    },
    accentContent: {
        padding: spacing.md,
        position: 'relative',
        zIndex: 1,
    },
});
