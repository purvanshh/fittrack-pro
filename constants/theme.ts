import { Theme } from '../types';

// ============================================
// FitTrack Pro - Theme Configuration
// ============================================

export const lightTheme: Theme = {
    mode: 'light',
    colors: {
        primary: '#7C3AED',      // Vibrant Violet
        primaryLight: '#A78BFA', // Light violet
        secondary: '#EC4899',    // Pink
        accent: '#F59E0B',       // Amber
        background: '#F8FAFC',   // Slate 50
        surface: '#FFFFFF',
        surfaceVariant: '#F1F5F9', // Slate 100
        text: '#1E293B',         // Slate 800
        textSecondary: '#64748B', // Slate 500
        border: '#E2E8F0',       // Slate 200
        success: '#10B981',      // Emerald
        warning: '#F59E0B',      // Amber
        error: '#EF4444',        // Red
        water: '#0EA5E9',        // Vibrant Sky Blue
        calories: '#F97316',     // Vibrant Orange
        workout: '#8B5CF6',      // Vibrant Purple
    },
};

export const darkTheme: Theme = {
    mode: 'dark',
    colors: {
        primary: '#A78BFA',      // Light violet
        primaryLight: '#8B5CF6', // Violet
        secondary: '#F472B6',    // Light pink
        accent: '#FBBF24',       // Lighter amber
        background: '#0F172A',   // Slate 900
        surface: '#1E293B',      // Slate 800
        surfaceVariant: '#334155', // Slate 700
        text: '#F1F5F9',         // Slate 100
        textSecondary: '#94A3B8', // Slate 400
        border: '#475569',       // Slate 600
        success: '#34D399',      // Lighter emerald
        warning: '#FBBF24',      // Lighter amber
        error: '#F87171',        // Lighter red
        water: '#38BDF8',        // Bright sky blue
        calories: '#FB923C',     // Bright orange
        workout: '#C4B5FD',      // Light purple
    },
};

// Gradient colors for special effects
export const gradients = {
    water: ['#0EA5E9', '#06B6D4'],    // Sky to Cyan
    calories: ['#F97316', '#EF4444'], // Orange to Red
    workout: ['#8B5CF6', '#EC4899'], // Purple to Pink
    primary: ['#7C3AED', '#EC4899'], // Violet to Pink
    success: ['#10B981', '#06B6D4'], // Emerald to Cyan
};

// Spacing scale
export const spacing = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
};

// Border radius
export const borderRadius = {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999,
};

// Typography
export const typography = {
    h1: {
        fontSize: 32,
        fontWeight: '700' as const,
        lineHeight: 40,
    },
    h2: {
        fontSize: 24,
        fontWeight: '600' as const,
        lineHeight: 32,
    },
    h3: {
        fontSize: 20,
        fontWeight: '600' as const,
        lineHeight: 28,
    },
    body: {
        fontSize: 16,
        fontWeight: '400' as const,
        lineHeight: 24,
    },
    bodySmall: {
        fontSize: 14,
        fontWeight: '400' as const,
        lineHeight: 20,
    },
    caption: {
        fontSize: 12,
        fontWeight: '400' as const,
        lineHeight: 16,
    },
    button: {
        fontSize: 16,
        fontWeight: '600' as const,
        lineHeight: 24,
    },
};

// Shadow styles
export const shadows = {
    sm: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    md: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },
    lg: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.15,
        shadowRadius: 15,
        elevation: 5,
    },
};
