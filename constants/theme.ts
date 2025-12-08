import { Theme } from '../types';

// ============================================
// FitTrack Pro - Neo-Futuristic Theme
// ============================================

export const lightTheme: Theme = {
    mode: 'light',
    colors: {
        // Core backgrounds
        background: '#F5F5F7',
        surface: '#FFFFFF',
        surfaceVariant: '#F0F0F2',

        // Primary accents - Lime neon
        primary: '#9ACD32',        // Softer lime for light mode
        primaryLight: '#C8F549',

        // Secondary - Lavender
        secondary: '#B794F6',

        // Accent - Pink
        accent: '#FF9ECD',

        // Text
        text: '#1A1A1A',
        textSecondary: '#6B6B6B',

        // Borders
        border: '#E0E0E0',

        // Status colors
        success: '#4CAF50',
        warning: '#FF9800',
        error: '#F44336',

        // Tracker colors
        water: '#42A5F5',        // Sky blue
        calories: '#FF7043',      // Orange-red
        workout: '#7E57C2',       // Purple
    },
};

export const darkTheme: Theme = {
    mode: 'dark',
    colors: {
        // Core backgrounds - Deep dark
        background: '#0D0D0D',
        surface: '#1A1A1A',
        surfaceVariant: '#222222',

        // Primary accents - Neon lime
        primary: '#D6FF63',
        primaryLight: '#E9FF8C',

        // Secondary - Lavender
        secondary: '#DCC7FF',

        // Accent - Pink
        accent: '#FFCDEB',

        // Text
        text: '#FFFFFF',
        textSecondary: '#A1A1A1',

        // Borders
        border: '#303030',

        // Status colors
        success: '#A7FF4F',
        warning: '#F9D94A',
        error: '#FF6B6B',

        // Tracker colors
        water: '#7BC6FF',         // Sky blue
        calories: '#E7F57A',      // Yellow-green for fire
        workout: '#A98BFF',       // Purple
    },
};

// Gradient definitions for use with LinearGradient
export const gradients = {
    lime: ['#C8F549', '#E9FF8C'],
    lavenderPink: ['#DCC7FF', '#FFCDEB'],
    purple: ['#CFA9FF', '#9F72D8'],
    fire: ['#FFB347', '#FF6B6B'],
    water: ['#7BC6FF', '#42A5F5'],
    cardOverlay: ['transparent', 'rgba(0,0,0,0.4)'],
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

// Border radius - Rounded, bubbly shapes
export const borderRadius = {
    sm: 12,
    md: 16,
    lg: 24,
    xl: 32,
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

// Shadow styles - Soft glow for dark theme
export const shadows = {
    sm: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 2,
    },
    md: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    lg: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 16,
        elevation: 8,
    },
    glow: (color: string) => ({
        shadowColor: color,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 12,
        elevation: 6,
    }),
};
