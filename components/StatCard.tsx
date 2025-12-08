import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { borderRadius, shadows, spacing, typography } from '../constants/theme';
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
    const color = iconColor || theme.colors.primary;

    return (
        <View
            style={[
                styles.container,
                {
                    backgroundColor: theme.colors.surface,
                    borderColor: theme.colors.border,
                },
                shadows.sm,
                style,
            ]}
        >
            <View style={[styles.iconContainer, { backgroundColor: color + '15' }]}>
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
        borderRadius: borderRadius.md,
        borderWidth: 1,
    },
    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: borderRadius.sm,
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
