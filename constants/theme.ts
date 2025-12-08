import { Theme } from '../types';

// ============================================
// FitTrack Pro - Theme Configuration
// ============================================

export const lightTheme: Theme = {
    mode: 'light',
    colors: {
        primary: '#6366F1',      // Indigo
        primaryLight: '#A5B4FC', // Light indigo
        secondary: '#8B5CF6',    // Purple
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
        water: '#3B82F6',        // Blue
        calories: '#F97316',     // Orange
        workout: '#8B5CF6',      // Purple
    },
};

export const darkTheme: Theme = {
    mode: 'dark',
    colors: {
        primary: '#818CF8',      // Lighter indigo
        primaryLight: '#6366F1',
        secondary: '#A78BFA',    // Lighter purple
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
        water: '#60A5FA',        // Lighter blue
        calories: '#FB923C',     // Lighter orange
        workout: '#A78BFA',      // Lighter purple
    },
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
