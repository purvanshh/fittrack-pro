# Supabase Authentication Setup

This document explains how to set up and use Supabase authentication in FitTrack Pro.

## Features

- ✅ Email/password sign-up and sign-in
- ✅ Session persistence with AsyncStorage
- ✅ Auto-redirect based on auth state
- ✅ Glass-themed login screen with fade-in animation
- ✅ Per-user data isolation (each user has separate data)
- ✅ Sign out functionality in Profile screen

---

## Installation

Dependencies are already installed. If you need to reinstall:

```bash
npm install @supabase/supabase-js react-native-url-polyfill react-native-get-random-values@1.11.0
```

---

## Environment Setup

1. **Create `.env` file** in project root (already gitignored):
   ```
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your-anon-key-here
   ```

2. **Never commit `.env`** — it's in `.gitignore`.

3. Use `.env.example` as a template for other developers.

---

## Supabase Dashboard Setup

### 1. Disable Email Confirmation (for development)

Go to **Authentication → Providers → Email** and toggle off "Confirm email" for easier testing.

### 2. Create Profiles Table

Run this SQL in **SQL Editor**:

```sql
-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  display_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own profile" 
  ON profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" 
  ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON profiles FOR UPDATE USING (auth.uid() = id);
```

---

## Running Locally

```bash
npx expo start
```

---

## How It Works

### Auth Flow
1. App starts → checks for existing session
2. No session → show Login screen
3. User signs in → fade animation → redirect to Dashboard
4. Session persisted → auto-sign-in on next launch

### Per-User Data Storage
Each user's data is stored with their unique ID:
- `@fittrack_{userId}_workouts`
- `@fittrack_{userId}_meals`
- `@fittrack_{userId}_water`
- `@fittrack_{userId}_profile`

This ensures complete data isolation between users.

---

## Files Overview

| File | Purpose |
|------|---------|
| `src/supabase/supabaseClient.ts` | Supabase client with AsyncStorage |
| `src/supabase/auth.ts` | Auth wrapper functions (signIn, signUp, signOut) |
| `context/AuthContext.tsx` | React context for auth state + user ID for storage |
| `app/login.tsx` | Glass-themed login/signup screen |
| `utils/storage.ts` | User-specific local storage helpers |
| `.env` | Environment variables (gitignored) |
| `.env.example` | Template for .env |

---

## CI/GitHub Secrets

If deploying or building in CI, add these secrets:

| Secret Name | Description |
|------------|-------------|
| `EXPO_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon/public key |

> ⚠️ **Never use `service_role` key in client apps or CI builds.**

---

## Troubleshooting

### "Invalid login credentials"
- User email may not be confirmed. Go to Supabase Dashboard → Authentication → Users → Click user → "Confirm user"
- Or disable email confirmation in Providers → Email

### "Failed to upsert profile" (RLS error)
- Make sure you've run the SQL above to create RLS policies
- Profile upsert happens on sign-in, not sign-up

### Package resolution errors
```bash
npm start --reset-cache
```
