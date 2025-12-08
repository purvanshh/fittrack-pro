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
import { Workout, WORKOUT_TYPES, WorkoutType } from '../types';
import { generateId, getToday } from '../utils/dateUtils';

interface AddWorkoutModalProps {
    visible: boolean;
    onClose: () => void;
    onSave: (workout: Workout) => void;
}

export default function AddWorkoutModal({
    visible,
    onClose,
    onSave,
}: AddWorkoutModalProps) {
    const { theme } = useTheme();
    const [selectedType, setSelectedType] = useState<WorkoutType>('running');
    const [duration, setDuration] = useState('');
    const [calories, setCalories] = useState('');

    const handleSave = () => {
        if (!duration || !calories) return;

        const workout: Workout = {
            id: generateId(),
            type: selectedType,
            duration: parseInt(duration, 10),
            calories: parseInt(calories, 10),
            date: getToday(),
        };

        onSave(workout);
        resetForm();
        onClose();
    };

    const resetForm = () => {
        setSelectedType('running');
        setDuration('');
        setCalories('');
    };

    const workoutTypes = Object.entries(WORKOUT_TYPES) as [WorkoutType, { label: string; icon: string }][];

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
                            Log Workout
                        </Text>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={24} color={theme.colors.textSecondary} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false}>
                        {/* Workout Type Selection */}
                        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                            Workout Type
                        </Text>
                        <View style={styles.typeGrid}>
                            {workoutTypes.map(([type, info]) => (
                                <TouchableOpacity
                                    key={type}
                                    style={[
                                        styles.typeButton,
                                        {
                                            backgroundColor: selectedType === type
                                                ? theme.colors.primary + '20'
                                                : theme.colors.surfaceVariant,
                                            borderColor: selectedType === type
                                                ? theme.colors.primary
                                                : theme.colors.border,
                                        },
                                    ]}
                                    onPress={() => setSelectedType(type)}
                                >
                                    <Ionicons
                                        name={info.icon as any}
                                        size={24}
                                        color={selectedType === type ? theme.colors.primary : theme.colors.textSecondary}
                                    />
                                    <Text
                                        style={[
                                            styles.typeLabel,
                                            {
                                                color: selectedType === type
                                                    ? theme.colors.primary
                                                    : theme.colors.text,
                                            },
                                        ]}
                                    >
                                        {info.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* Duration Input */}
                        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                            Duration (minutes)
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
                            placeholder="e.g., 30"
                            placeholderTextColor={theme.colors.textSecondary}
                            keyboardType="number-pad"
                            value={duration}
                            onChangeText={setDuration}
                        />

                        {/* Calories Input */}
                        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                            Calories Burned
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
                            placeholder="e.g., 250"
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
                                (!duration || !calories) && { opacity: 0.5 },
                            ]}
                            onPress={handleSave}
                            disabled={!duration || !calories}
                        >
                            <Ionicons name="checkmark" size={20} color="#FFFFFF" />
                            <Text style={styles.saveButtonText}>Save Workout</Text>
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
    typeGrid: {
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
