// Supabase Client for React Native
// IMPORTANT: Import polyfills FIRST before anything else
import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// Environment variables - in production, use react-native-config or expo-constants
// For Expo, we read directly. In managed workflow, these are build-time constants.
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://jbcpvbragixuttugbcru.supabase.co';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpiY3B2YnJhZ2l4dXR0dWdiY3J1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU0NzcyNTgsImV4cCI6MjA4MTA1MzI1OH0.piuQZDNiOljzEHuPJqvaRebEt7WoGmxw89e9IQDipU0';

// Security check: Warn if service_role key is accidentally included
if (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.EXPO_PUBLIC_SUPABASE_SERVICE_ROLE_KEY) {
    console.warn(
        '⚠️ WARNING: Service role key detected in environment. ' +
        'Never use service_role key in client-side code. It has been ignored.'
    );
}

// Create Supabase client with AsyncStorage for session persistence
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false, // Important for React Native
    },
});

export { SUPABASE_URL };
