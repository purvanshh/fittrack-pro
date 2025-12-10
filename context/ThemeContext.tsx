import React, { createContext, ReactNode, useContext } from 'react';
import { darkTheme } from '../constants/theme';
import { Theme, ThemeMode } from '../types';

// ============================================
// FitTrack Pro - Theme Context (Dark Theme Only)
// ============================================

interface ThemeContextType {
    theme: Theme;
    themeMode: ThemeMode;
    toggleTheme: () => void;
    setThemeMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
    children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
    // Always use dark theme
    const themeMode: ThemeMode = 'dark';
    const theme = darkTheme;

    // These functions are kept for API compatibility but do nothing
    const toggleTheme = () => { };
    const setThemeMode = () => { };

    return (
        <ThemeContext.Provider value={{ theme, themeMode, toggleTheme, setThemeMode }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme(): ThemeContextType {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}

