import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native';
import { borderRadius, shadows, spacing, typography } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';

interface QuickActionButtonProps {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    color?: string;
    onPress: () => void;
    style?: ViewStyle;
}

export default function QuickActionButton({
    icon,
    label,
    color,
    onPress,
    style,
}: QuickActionButtonProps) {
    const { theme } = useTheme();
    const buttonColor = color || theme.colors.primary;

    return (
        <TouchableOpacity
            style={[
                styles.container,
                {
                    backgroundColor: theme.colors.surface,
                    borderColor: theme.colors.border,
                },
                shadows.md,
                style,
            ]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <Ionicons
                name={icon}
                size={28}
                color={buttonColor}
                style={styles.icon}
            />
            <Text style={[styles.label, { color: theme.colors.text }]}>
                {label}
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.md,
        borderRadius: borderRadius.lg,
        borderWidth: 1,
        minWidth: 100,
    },
    icon: {
        marginBottom: spacing.xs,
    },
    label: {
        ...typography.bodySmall,
        fontWeight: '500',
        textAlign: 'center',
    },
});
