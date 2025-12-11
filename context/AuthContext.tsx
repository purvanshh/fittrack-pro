import { Session, User } from '@supabase/supabase-js';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { signIn as authSignIn, signOut as authSignOut, signUp as authSignUp, getErrorMessage, getSession, onAuthStateChange } from '../src/supabase/auth';
import { setCurrentUserId } from '../utils/storage';

// ============================================
// FitTrack Pro - Auth Context
// ============================================

interface AuthContextType {
    user: User | null;
    session: Session | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<{ error: string | null }>;
    signUp: (email: string, password: string) => Promise<{ error: string | null }>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for existing session on mount
        async function loadSession() {
            try {
                const existingSession = await getSession();
                if (existingSession) {
                    setSession(existingSession);
                    setUser(existingSession.user);
                    // Set user ID for storage isolation
                    setCurrentUserId(existingSession.user.id);
                }
            } catch (error) {
                console.error('Error loading session:', error);
            } finally {
                setLoading(false);
            }
        }

        loadSession();

        // Subscribe to auth state changes
        const { data: { subscription } } = onAuthStateChange((event, newSession) => {
            setSession(newSession);
            setUser(newSession?.user ?? null);

            // Update user ID for storage isolation
            if (newSession?.user) {
                setCurrentUserId(newSession.user.id);
            }

            if (event === 'SIGNED_OUT') {
                setUser(null);
                setSession(null);
                // Clear user ID on sign out
                setCurrentUserId(null);
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const signIn = async (email: string, password: string) => {
        const result = await authSignIn(email, password);
        if (result.error) {
            return { error: getErrorMessage(result.error) };
        }
        return { error: null };
    };

    const signUp = async (email: string, password: string) => {
        const result = await authSignUp(email, password);
        if (result.error) {
            return { error: getErrorMessage(result.error) };
        }
        return { error: null };
    };

    const signOut = async () => {
        await authSignOut();
    };

    return (
        <AuthContext.Provider value={{ user, session, loading, signIn, signUp, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

