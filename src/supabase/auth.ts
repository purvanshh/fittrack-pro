// Auth wrapper functions for Supabase
import { AuthError, Session, User } from '@supabase/supabase-js';
import { supabase } from './supabaseClient';

export interface AuthResult {
    user: User | null;
    session: Session | null;
    error: AuthError | null;
}

/**
 * Sign up a new user with email and password
 */
export async function signUp(email: string, password: string): Promise<AuthResult> {
    try {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) {
            return { user: null, session: null, error };
        }

        // Profile will be created on first sign-in (when session is confirmed)
        return { user: data.user, session: data.session, error: null };
    } catch (err) {
        return {
            user: null,
            session: null,
            error: { message: 'An unexpected error occurred', name: 'UnexpectedError' } as AuthError,
        };
    }
}

/**
 * Sign in user with email and password
 */
export async function signIn(email: string, password: string): Promise<AuthResult> {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            return { user: null, session: null, error };
        }

        // Create/update profile on successful sign-in (session is guaranteed here)
        if (data.user) {
            await upsertProfile(data.user);
        }

        return { user: data.user, session: data.session, error: null };
    } catch (err) {
        return {
            user: null,
            session: null,
            error: { message: 'An unexpected error occurred', name: 'UnexpectedError' } as AuthError,
        };
    }
}

/**
 * Sign out the current user
 */
export async function signOut(): Promise<{ error: AuthError | null }> {
    try {
        const { error } = await supabase.auth.signOut();
        return { error };
    } catch (err) {
        return {
            error: { message: 'Failed to sign out', name: 'SignOutError' } as AuthError,
        };
    }
}

/**
 * Get the current user (if logged in)
 */
export async function getUser(): Promise<User | null> {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        return user;
    } catch {
        return null;
    }
}

/**
 * Get the current session
 */
export async function getSession(): Promise<Session | null> {
    try {
        const { data: { session } } = await supabase.auth.getSession();
        return session;
    } catch {
        return null;
    }
}

/**
 * Subscribe to auth state changes
 */
export function onAuthStateChange(
    callback: (event: string, session: Session | null) => void
) {
    return supabase.auth.onAuthStateChange((event, session) => {
        callback(event, session);
    });
}

/**
 * Upsert user profile to profiles table
 * Note: Table must be created in Supabase. See README_SUPABASE.md
 */
async function upsertProfile(user: User): Promise<void> {
    try {
        const { error } = await supabase.from('profiles').upsert({
            id: user.id,
            email: user.email,
            updated_at: new Date().toISOString(),
        }, {
            onConflict: 'id',
        });

        if (error) {
            console.warn('Failed to upsert profile:', error.message);
        }
    } catch (err) {
        console.warn('Profile upsert error:', err);
    }
}

/**
 * Map Supabase error messages to user-friendly messages
 */
export function getErrorMessage(error: AuthError | null): string {
    if (!error) return '';

    const errorMap: Record<string, string> = {
        'Invalid login credentials': 'Incorrect email or password. Please try again.',
        'Email not confirmed': 'Please check your email to confirm your account.',
        'User already registered': 'An account with this email already exists.',
        'Password should be at least 6 characters': 'Password must be at least 6 characters long.',
        'Unable to validate email address: invalid format': 'Please enter a valid email address.',
        'Signup requires a valid password': 'Please enter a password.',
        'Anonymous sign-ins are disabled': 'Please provide your email and password.',
    };

    // Check for partial matches
    for (const [key, value] of Object.entries(errorMap)) {
        if (error.message?.toLowerCase().includes(key.toLowerCase())) {
            return value;
        }
    }

    // Default message
    return error.message || 'Something went wrong. Please try again.';
}
