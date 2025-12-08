// ============================================
// FitTrack Pro - Date Utilities
// ============================================

/**
 * Get today's date as YYYY-MM-DD string
 */
export function getToday(): string {
    return new Date().toISOString().split('T')[0];
}

/**
 * Get current time as HH:mm string
 */
export function getCurrentTime(): string {
    return new Date().toTimeString().slice(0, 5);
}

/**
 * Check if a date string is today
 */
export function isToday(dateString: string): boolean {
    return dateString === getToday();
}

/**
 * Check if we've crossed midnight since last check
 */
export function hasCrossedMidnight(lastDate: string): boolean {
    return lastDate !== getToday();
}

/**
 * Get the start of the week (Monday) for a given date
 */
export function getWeekStart(date: Date = new Date()): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    d.setDate(diff);
    d.setHours(0, 0, 0, 0);
    return d;
}

/**
 * Get the last 7 days including today
 */
export function getLast7Days(): string[] {
    const days: string[] = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        days.push(date.toISOString().split('T')[0]);
    }

    return days;
}

/**
 * Format date for display (e.g., "Mon, Dec 8")
 */
export function formatDateShort(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
    });
}

/**
 * Format date for display (e.g., "December 8, 2024")
 */
export function formatDateLong(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    });
}

/**
 * Get day name (e.g., "Mon", "Tue")
 */
export function getDayName(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
}

/**
 * Calculate streak based on consecutive active days
 */
export function calculateStreak(lastActiveDate: string, currentStreak: number): number {
    const today = getToday();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    if (lastActiveDate === today) {
        // Already logged today, keep streak
        return currentStreak;
    } else if (lastActiveDate === yesterdayStr) {
        // Last active was yesterday, increment streak
        return currentStreak + 1;
    } else {
        // Streak broken, start over
        return 1;
    }
}

/**
 * Generate a unique ID
 */
export function generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Format duration in minutes to display string
 */
export function formatDuration(minutes: number): string {
    if (minutes < 60) {
        return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

/**
 * Format water amount for display
 */
export function formatWater(ml: number): string {
    if (ml >= 1000) {
        return `${(ml / 1000).toFixed(1)}L`;
    }
    return `${ml}ml`;
}
