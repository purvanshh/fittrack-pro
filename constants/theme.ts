import { Theme } from '../types';

// ============================================
// FitTrack Pro - Glassmorphism Theme
// ============================================

export const lightTheme: Theme = {
    mode: 'light',
    colors: {
        // Core backgrounds - Ethereal gradient base
        background: '#E8EEF5',
        surface: 'rgba(255, 255, 255, 0.65)',
        surfaceVariant: 'rgba(255, 255, 255, 0.45)',

        // Glass surface (for components that need explicit glass)
        glassSurface: 'rgba(255, 255, 255, 0.25)',
        glassBackground: 'rgba(248, 250, 252, 0.85)',

        // Primary accents - Vibrant cyan/teal
        primary: '#00D9B8',
        primaryLight: '#5BFFE3',

        // Secondary - Electric violet
        secondary: '#A855F7',

        // Accent - Warm coral
        accent: '#FF6B9D',

        // Text
        text: '#1A1A2E',
        textSecondary: '#64748B',

        // Borders - Subtle glass edges
        border: 'rgba(255, 255, 255, 0.5)',
        glassBorder: 'rgba(255, 255, 255, 0.3)',

        // Status colors
        success: '#22C55E',
        warning: '#F59E0B',
        error: '#EF4444',

        // Tracker colors - Vibrant glass-friendly
        water: '#38BDF8',
        calories: '#FB923C',
        workout: '#A78BFA',
    },
};

export const darkTheme: Theme = {
    mode: 'dark',
    colors: {
        // Core backgrounds - Deep space gradient base
        background: '#0A0A0F',
        surface: 'rgba(30, 30, 45, 0.65)',
        surfaceVariant: 'rgba(40, 40, 60, 0.55)',

        // Glass surface
        glassSurface: 'rgba(255, 255, 255, 0.08)',
        glassBackground: 'rgba(20, 20, 30, 0.75)',

        // Primary accents - Neon cyan
        primary: '#00FFD1',
        primaryLight: '#7DFFEA',

        // Secondary - Neon purple
        secondary: '#C084FC',

        // Accent - Neon pink
        accent: '#FF7EB3',

        // Text
        text: '#FFFFFF',
        textSecondary: '#94A3B8',

        // Borders - Glowing edges
        border: 'rgba(255, 255, 255, 0.12)',
        glassBorder: 'rgba(255, 255, 255, 0.08)',

        // Status colors
        success: '#4ADE80',
        warning: '#FBBF24',
        error: '#F87171',

        // Tracker colors - Neon glass-friendly
        water: '#38BDF8',
        calories: '#FACC15',
        workout: '#C4B5FD',
    },
};

// Enhanced gradient definitions for glassmorphism
// Using 'as const' to ensure proper typing for LinearGradient
export const gradients = {
    // Background gradients
    lightBackground: ['#E0E7FF', '#FCE7F3', '#E0F2FE'] as const,
    darkBackground: ['#0F0F1A', '#1A0F2E', '#0F1A2E'] as const,

    // Accent gradients
    primary: ['#00FFD1', '#00D9B8', '#00B4A8'] as const,
    secondary: ['#E879F9', '#A855F7', '#7C3AED'] as const,
    accent: ['#FF7EB3', '#FF6B9D', '#FF5287'] as const,

    // Tracker gradients
    water: ['#67E8F9', '#38BDF8', '#0EA5E9'] as const,
    calories: ['#FDE68A', '#FACC15', '#FB923C'] as const,
    workout: ['#DDD6FE', '#C4B5FD', '#A78BFA'] as const,

    // Glass overlays
    glassLight: ['rgba(255,255,255,0.4)', 'rgba(255,255,255,0.1)'] as const,
    glassDark: ['rgba(255,255,255,0.15)', 'rgba(255,255,255,0.02)'] as const,

    // Shimmer effects
    shimmer: ['transparent', 'rgba(255,255,255,0.3)', 'transparent'] as const,

    // Legacy
    cardOverlay: ['transparent', 'rgba(0,0,0,0.4)'] as const,
    lime: ['#C8F549', '#E9FF8C'] as const,
    lavenderPink: ['#DCC7FF', '#FFCDEB'] as const,
    purple: ['#E879F9', '#A855F7'] as const,
    fire: ['#FBBF24', '#F87171'] as const,
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
    xxl: 40,
    full: 9999,
};

// Typography
export const typography = {
    h1: {
        fontSize: 32,
        fontWeight: '700' as const,
        lineHeight: 40,
        letterSpacing: -0.5,
    },
    h2: {
        fontSize: 24,
        fontWeight: '600' as const,
        lineHeight: 32,
        letterSpacing: -0.3,
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

// Glass morphism specific styles
export const glassStyles = {
    // Light mode glass
    light: {
        surface: {
            backgroundColor: 'rgba(255, 255, 255, 0.65)',
            borderColor: 'rgba(255, 255, 255, 0.5)',
            borderWidth: 1,
        },
        card: {
            backgroundColor: 'rgba(255, 255, 255, 0.45)',
            borderColor: 'rgba(255, 255, 255, 0.3)',
            borderWidth: 1,
        },
        subtle: {
            backgroundColor: 'rgba(255, 255, 255, 0.25)',
            borderColor: 'rgba(255, 255, 255, 0.15)',
            borderWidth: 1,
        },
    },
    // Dark mode glass
    dark: {
        surface: {
            backgroundColor: 'rgba(30, 30, 45, 0.65)',
            borderColor: 'rgba(255, 255, 255, 0.12)',
            borderWidth: 1,
        },
        card: {
            backgroundColor: 'rgba(40, 40, 60, 0.55)',
            borderColor: 'rgba(255, 255, 255, 0.08)',
            borderWidth: 1,
        },
        subtle: {
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            borderColor: 'rgba(255, 255, 255, 0.05)',
            borderWidth: 1,
        },
    },
};

// Shadow styles - Enhanced for glass effect
export const shadows = {
    sm: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
    },
    md: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 12,
        elevation: 4,
    },
    lg: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.18,
        shadowRadius: 24,
        elevation: 8,
    },
    // Glass-specific shadows with bloom
    glass: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 32,
        elevation: 10,
    },
    // Colored glow effects
    glow: (color: string) => ({
        shadowColor: color,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.4,
        shadowRadius: 16,
        elevation: 8,
    }),
    // Neon glow for dark mode (iOS only - Android elevation causes artifacts)
    neon: (color: string) => ({
        shadowColor: color,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 20,
        elevation: 0, // Disabled on Android to prevent dot artifact
    }),
    // Inner highlight for glass
    innerGlow: {
        shadowColor: '#FFF',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1,
    },
};
