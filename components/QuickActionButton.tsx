import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import { borderRadius, glassStyles, shadows, spacing, typography } from '../constants/theme';
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
    const isDark = theme.mode === 'dark';
    const buttonColor = color || theme.colors.primary;
    const glassStyle = isDark ? glassStyles.dark.card : glassStyles.light.card;

    return (
        <TouchableOpacity
            style={[
                styles.container,
                glassStyle,
                shadows.glass,
                style,
            ]}
            onPress={onPress}
            activeOpacity={0.7}
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

            {/* Icon container with background */}
            <View style={[styles.iconContainer, { backgroundColor: buttonColor + '20' }]}>
                <Ionicons
                    name={icon}
                    size={26}
                    color={buttonColor}
                />
            </View>
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
        minWidth: 100,
        overflow: 'hidden',
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.sm,
    },
    label: {
        ...typography.bodySmall,
        fontWeight: '600',
        textAlign: 'center',
    },
});

