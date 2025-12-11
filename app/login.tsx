import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Animated,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import GlassCard from '../components/GlassCard';
import { borderRadius, glassStyles, gradients, shadows, spacing, typography } from '../constants/theme';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function LoginScreen() {
    const { theme } = useTheme();
    const { signIn, signUp, session } = useAuth();
    const isDark = theme.mode === 'dark';
    const glassStyle = isDark ? glassStyles.dark : glassStyles.light;

    // Form state
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    // Animation refs
    const fadeAnim = useRef(new Animated.Value(1)).current;
    const successFadeAnim = useRef(new Animated.Value(0)).current;
    const emailInputRef = useRef<TextInput>(null);

    // Auto-focus email on mount
    useEffect(() => {
        const timer = setTimeout(() => {
            emailInputRef.current?.focus();
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    // Redirect if already logged in
    useEffect(() => {
        if (session) {
            // Animate and navigate
            playSuccessAnimation();
        }
    }, [session]);

    const playSuccessAnimation = () => {
        // Fade out login form, fade in success
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }),
            Animated.timing(successFadeAnim, {
                toValue: 1,
                duration: 350,
                useNativeDriver: true,
            }),
        ]).start(() => {
            // Navigate after animation completes
            setTimeout(() => {
                router.replace('/(tabs)');
            }, 150);
        });
    };

    // Validation
    const isValidEmail = (emailStr: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailStr);
    };

    const isFormValid = email.trim().length > 0 && password.length >= 6 && isValidEmail(email);

    const handleSubmit = async () => {
        Keyboard.dismiss();
        setError(null);

        // Validate
        if (!email.trim()) {
            setError('Please enter your email address.');
            return;
        }
        if (!isValidEmail(email)) {
            setError('Please enter a valid email address.');
            return;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }

        setLoading(true);

        try {
            console.log(`Attempting ${isSignUp ? 'signUp' : 'signIn'} for:`, email.trim());

            const result = isSignUp
                ? await signUp(email.trim(), password)
                : await signIn(email.trim(), password);

            console.log('Auth result:', result.error ? result.error : 'Success');

            if (result.error) {
                setError(result.error);
                setLoading(false);
            } else {
                // Success - loading will be reset when session changes
                // But we should also reset it here in case there's no session yet
                console.log('Auth successful, waiting for session...');
                // Keep loading true, session useEffect will handle navigation
            }
        } catch (err) {
            console.error('Auth error:', err);
            setError('Something went wrong. Please try again.');
            setLoading(false);
        }
    };

    const toggleMode = () => {
        setIsSignUp(!isSignUp);
        setError(null);
    };

    return (
        <View style={styles.wrapper}>
            {/* Gradient Background */}
            <LinearGradient
                colors={isDark ? gradients.darkBackground : gradients.lightBackground}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
            />

            {/* Decorative Gradient Orbs */}
            <View style={[styles.gradientOrb, styles.orbPrimary, { backgroundColor: theme.colors.primary }]} />
            <View style={[styles.gradientOrb, styles.orbSecondary, { backgroundColor: theme.colors.secondary }]} />
            <View style={[styles.gradientOrb, styles.orbAccent, { backgroundColor: theme.colors.accent }]} />

            {/* Success Overlay with Fade-In */}
            <Animated.View
                style={[
                    styles.successOverlay,
                    { opacity: successFadeAnim },
                ]}
                pointerEvents="none"
            >
                <View style={styles.successContent}>
                    <Ionicons name="checkmark-circle" size={80} color={theme.colors.primary} />
                    <Text style={[styles.successText, { color: theme.colors.text }]}>Welcome!</Text>
                </View>
            </Animated.View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
                        {/* Logo / Brand */}
                        <View style={styles.header}>
                            <View style={[styles.logoContainer, shadows.glow(theme.colors.primary)]}>
                                <Ionicons name="fitness" size={48} color={theme.colors.primary} />
                            </View>
                            <Text style={[styles.title, { color: theme.colors.text }]}>
                                FitTrack Pro
                            </Text>
                            <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
                                {isSignUp ? 'Create your account' : 'Sign in to continue'}
                            </Text>
                        </View>

                        {/* Login Form */}
                        <GlassCard style={styles.formCard} variant="surface">
                            {/* Error Message */}
                            {error && (
                                <View style={[styles.errorContainer, { backgroundColor: theme.colors.error + '20' }]}>
                                    <Ionicons name="alert-circle" size={18} color={theme.colors.error} />
                                    <Text style={[styles.errorText, { color: theme.colors.error }]}>
                                        {error}
                                    </Text>
                                </View>
                            )}

                            {/* Email Input */}
                            <View style={styles.inputWrapper}>
                                <Text style={[styles.inputLabel, { color: theme.colors.textSecondary }]}>
                                    Email
                                </Text>
                                <View style={[styles.inputContainer, glassStyle.card]}>
                                    <Ionicons name="mail-outline" size={20} color={theme.colors.textSecondary} />
                                    <TextInput
                                        ref={emailInputRef}
                                        style={[styles.input, { color: theme.colors.text }]}
                                        placeholder="your@email.com"
                                        placeholderTextColor={theme.colors.textSecondary + '80'}
                                        value={email}
                                        onChangeText={setEmail}
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        autoComplete="email"
                                        autoCorrect={false}
                                        editable={!loading}
                                        accessibilityLabel="Email address"
                                    />
                                </View>
                            </View>

                            {/* Password Input */}
                            <View style={styles.inputWrapper}>
                                <Text style={[styles.inputLabel, { color: theme.colors.textSecondary }]}>
                                    Password
                                </Text>
                                <View style={[styles.inputContainer, glassStyle.card]}>
                                    <Ionicons name="lock-closed-outline" size={20} color={theme.colors.textSecondary} />
                                    <TextInput
                                        style={[styles.input, { color: theme.colors.text }]}
                                        placeholder="••••••••"
                                        placeholderTextColor={theme.colors.textSecondary + '80'}
                                        value={password}
                                        onChangeText={setPassword}
                                        secureTextEntry={!showPassword}
                                        autoCapitalize="none"
                                        autoComplete="password"
                                        editable={!loading}
                                        accessibilityLabel="Password"
                                    />
                                    <TouchableOpacity
                                        onPress={() => setShowPassword(!showPassword)}
                                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                    >
                                        <Ionicons
                                            name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                                            size={20}
                                            color={theme.colors.textSecondary}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* Submit Button */}
                            <TouchableOpacity
                                style={[
                                    styles.submitButton,
                                    shadows.glow(theme.colors.primary),
                                    (!isFormValid || loading) && styles.submitButtonDisabled,
                                ]}
                                onPress={handleSubmit}
                                disabled={!isFormValid || loading}
                                activeOpacity={0.8}
                            >
                                <LinearGradient
                                    colors={[theme.colors.primary, isDark ? `${theme.colors.primary}CC` : `${theme.colors.primary}DD`]}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    style={[
                                        styles.submitGradient,
                                        (!isFormValid || loading) && styles.submitGradientDisabled,
                                    ]}
                                >
                                    {loading ? (
                                        <ActivityIndicator color="#000" size="small" />
                                    ) : (
                                        <Text style={styles.submitText}>
                                            {isSignUp ? 'Create Account' : 'Sign In'}
                                        </Text>
                                    )}
                                </LinearGradient>
                            </TouchableOpacity>

                            {/* Toggle Sign Up / Sign In */}
                            <View style={styles.toggleContainer}>
                                <Text style={[styles.toggleText, { color: theme.colors.textSecondary }]}>
                                    {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                                </Text>
                                <TouchableOpacity onPress={toggleMode} disabled={loading}>
                                    <Text style={[styles.toggleLink, { color: theme.colors.primary }]}>
                                        {isSignUp ? 'Sign In' : 'Create Account'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </GlassCard>
                    </Animated.View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
    },
    keyboardView: {
        flex: 1,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: spacing.lg,
    },
    // Decorative gradient orbs
    gradientOrb: {
        position: 'absolute',
        borderRadius: 200,
        opacity: 0.15,
    },
    orbPrimary: {
        width: 300,
        height: 300,
        top: -100,
        right: -100,
    },
    orbSecondary: {
        width: 250,
        height: 250,
        bottom: 200,
        left: -100,
    },
    orbAccent: {
        width: 200,
        height: 200,
        bottom: -50,
        right: -50,
    },
    // Success overlay
    successOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
    successContent: {
        alignItems: 'center',
        gap: spacing.md,
    },
    successText: {
        ...typography.h1,
    },
    // Header
    header: {
        alignItems: 'center',
        marginBottom: spacing.xl,
    },
    logoContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(0, 255, 209, 0.15)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    title: {
        ...typography.h1,
        marginBottom: spacing.xs,
    },
    subtitle: {
        ...typography.body,
    },
    // Form
    formCard: {
        padding: spacing.lg,
    },
    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        padding: spacing.md,
        borderRadius: borderRadius.md,
        marginBottom: spacing.md,
    },
    errorText: {
        ...typography.bodySmall,
        flex: 1,
    },
    inputWrapper: {
        marginBottom: spacing.md,
    },
    inputLabel: {
        ...typography.caption,
        fontWeight: '600',
        marginBottom: spacing.xs,
        marginLeft: spacing.xs,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.md,
        gap: spacing.sm,
    },
    input: {
        flex: 1,
        ...typography.body,
        paddingVertical: spacing.xs,
    },
    submitButton: {
        marginTop: spacing.md,
        borderRadius: borderRadius.lg,
        overflow: 'hidden',
    },
    submitButtonDisabled: {
        opacity: 0.6,
    },
    submitGradient: {
        paddingVertical: spacing.md,
        alignItems: 'center',
        justifyContent: 'center',
    },
    submitGradientDisabled: {
        opacity: 0.7,
    },
    submitText: {
        ...typography.button,
        color: '#000',
        fontWeight: '700',
    },
    toggleContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: spacing.xs,
        marginTop: spacing.lg,
    },
    toggleText: {
        ...typography.bodySmall,
    },
    toggleLink: {
        ...typography.bodySmall,
        fontWeight: '600',
    },
});
