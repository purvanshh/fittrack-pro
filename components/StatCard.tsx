import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { borderRadius, glassStyles, shadows, spacing, typography } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';

interface StatCardProps {
    icon: keyof typeof Ionicons.glyphMap;
    iconColor?: string;
    title: string;
    value: string | number;
    subtitle?: string;
    style?: ViewStyle;
}

export default function StatCard({
    icon,
    iconColor,
    title,
    value,
    subtitle,
    style,
}: StatCardProps) {
    const { theme } = useTheme();
    const isDark = theme.mode === 'dark';
    const color = iconColor || theme.colors.primary;
    const glassStyle = isDark ? glassStyles.dark.card : glassStyles.light.card;

    return (
        <View
            style={[
                styles.container,
                glassStyle,
                shadows.glass,
                style,
            ]}
        >
            {/* Glass gradient overlay */}
            <LinearGradient
                colors={isDark
                    ? ['rgba(255,255,255,0.08)', 'rgba(255,255,255,0.02)'] as const
                    : ['rgba(255,255,255,0.6)', 'rgba(255,255,255,0.3)'] as const
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
            />

            <View style={[styles.iconContainer, { backgroundColor: color + '20' }, isDark && shadows.neon(color)]}>
                <Ionicons name={icon} size={22} color={color} />
            </View>
            <View style={styles.content}>
                <Text style={[styles.title, { color: theme.colors.textSecondary }]}>
                    {title}
                </Text>
                <Text style={[styles.value, { color: theme.colors.text }]}>
                    {value}
                </Text>
                {subtitle && (
                    <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
                        {subtitle}
                    </Text>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
        borderRadius: borderRadius.lg,
        overflow: 'hidden',
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.md,
    },
    content: {
        flex: 1,
    },
    title: {
        ...typography.caption,
        marginBottom: 2,
    },
    value: {
        ...typography.h3,
    },
    subtitle: {
        ...typography.caption,
        marginTop: 2,
    },
});

