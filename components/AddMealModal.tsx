import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { borderRadius, shadows, spacing, typography } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';
import { Meal } from '../types';
import { generateId, getToday } from '../utils/dateUtils';

interface AddMealModalProps {
    visible: boolean;
    onClose: () => void;
    onSave: (meal: Meal) => void;
}

type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

const MEAL_TYPES: { type: MealType; label: string; icon: string }[] = [
    { type: 'breakfast', label: 'Breakfast', icon: 'sunny-outline' },
    { type: 'lunch', label: 'Lunch', icon: 'restaurant-outline' },
    { type: 'dinner', label: 'Dinner', icon: 'moon-outline' },
    { type: 'snack', label: 'Snack', icon: 'cafe-outline' },
];

export default function AddMealModal({
    visible,
    onClose,
    onSave,
}: AddMealModalProps) {
    const { theme } = useTheme();
    const [food, setFood] = useState('');
    const [calories, setCalories] = useState('');
    const [mealType, setMealType] = useState<MealType>('lunch');

    const handleSave = () => {
        if (!food || !calories) return;

        const meal: Meal = {
            id: generateId(),
            food,
            calories: parseInt(calories, 10),
            date: getToday(),
            mealType,
        };

        onSave(meal);
        resetForm();
        onClose();
    };

    const resetForm = () => {
        setFood('');
        setCalories('');
        setMealType('lunch');
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.overlay}
            >
                <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={[styles.title, { color: theme.colors.text }]}>
                            Log Meal
                        </Text>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={24} color={theme.colors.textSecondary} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false}>
                        {/* Meal Type Selection */}
                        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                            Meal Type
                        </Text>
                        <View style={styles.typeRow}>
                            {MEAL_TYPES.map((item) => (
                                <TouchableOpacity
                                    key={item.type}
                                    style={[
                                        styles.typeButton,
                                        {
                                            backgroundColor: mealType === item.type
                                                ? theme.colors.primary + '20'
                                                : theme.colors.surfaceVariant,
                                            borderColor: mealType === item.type
                                                ? theme.colors.primary
                                                : theme.colors.border,
                                        },
                                    ]}
                                    onPress={() => setMealType(item.type)}
                                >
                                    <Ionicons
                                        name={item.icon as any}
                                        size={20}
                                        color={mealType === item.type ? theme.colors.primary : theme.colors.textSecondary}
                                    />
                                    <Text
                                        style={[
                                            styles.typeLabel,
                                            {
                                                color: mealType === item.type
                                                    ? theme.colors.primary
                                                    : theme.colors.text,
                                            },
                                        ]}
                                    >
                                        {item.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* Food Name Input */}
                        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                            Food Name
                        </Text>
                        <TextInput
                            style={[
                                styles.input,
                                {
                                    backgroundColor: theme.colors.surfaceVariant,
                                    color: theme.colors.text,
                                    borderColor: theme.colors.border,
                                },
                            ]}
                            placeholder="e.g., Chicken Salad"
                            placeholderTextColor={theme.colors.textSecondary}
                            value={food}
                            onChangeText={setFood}
                        />

                        {/* Calories Input */}
                        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                            Calories
                        </Text>
                        <TextInput
                            style={[
                                styles.input,
                                {
                                    backgroundColor: theme.colors.surfaceVariant,
                                    color: theme.colors.text,
                                    borderColor: theme.colors.border,
                                },
                            ]}
                            placeholder="e.g., 450"
                            placeholderTextColor={theme.colors.textSecondary}
                            keyboardType="number-pad"
                            value={calories}
                            onChangeText={setCalories}
                        />

                        {/* Save Button */}
                        <TouchableOpacity
                            style={[
                                styles.saveButton,
                                { backgroundColor: theme.colors.primary },
                                (!food || !calories) && { opacity: 0.5 },
                            ]}
                            onPress={handleSave}
                            disabled={!food || !calories}
                        >
                            <Ionicons name="checkmark" size={20} color="#FFFFFF" />
                            <Text style={styles.saveButtonText}>Save Meal</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    container: {
        borderTopLeftRadius: borderRadius.xl,
        borderTopRightRadius: borderRadius.xl,
        padding: spacing.lg,
        maxHeight: '90%',
        ...shadows.lg,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.lg,
    },
    title: {
        ...typography.h2,
    },
    sectionTitle: {
        ...typography.body,
        fontWeight: '600',
        marginBottom: spacing.sm,
        marginTop: spacing.md,
    },
    typeRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.sm,
    },
    typeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        borderRadius: borderRadius.md,
        borderWidth: 1.5,
        gap: spacing.xs,
    },
    typeLabel: {
        ...typography.bodySmall,
        fontWeight: '500',
    },
    input: {
        ...typography.body,
        padding: spacing.md,
        borderRadius: borderRadius.md,
        borderWidth: 1,
    },
    saveButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.md,
        borderRadius: borderRadius.md,
        marginTop: spacing.xl,
        marginBottom: spacing.lg,
        gap: spacing.xs,
    },
    saveButtonText: {
        ...typography.button,
        color: '#FFFFFF',
    },
});
