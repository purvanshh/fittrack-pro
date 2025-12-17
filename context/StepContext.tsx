import { Pedometer } from 'expo-sensors';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { getProfile } from '../utils/storage';

interface StepContextType {
    steps: number;
    isPedometerAvailable: string;
    goal: number;
    refreshGoal: () => Promise<void>;
}

const StepContext = createContext<StepContextType>({
    steps: 0,
    isPedometerAvailable: 'checking',
    goal: 10000,
    refreshGoal: async () => { },
});

export const useSteps = () => useContext(StepContext);

export function StepProvider({ children }: { children: React.ReactNode }) {
    const [steps, setSteps] = useState(0);
    const [isPedometerAvailable, setIsPedometerAvailable] = useState('checking');
    const [goal, setGoal] = useState(10000);
    const [subscription, setSubscription] = useState<any>(null);

    const loadGoalFromProfile = async () => {
        const profile = await getProfile();
        if (profile?.goals?.dailySteps) {
            setGoal(profile.goals.dailySteps);
        }
    };

    useEffect(() => {
        let isMounted = true;
        let sub: any = null;

        const setupPedometer = async () => {
            await loadGoalFromProfile();

            try {
                const isAvailable = await Pedometer.isAvailableAsync();
                if (!isMounted) return;
                setIsPedometerAvailable(String(isAvailable));

                if (isAvailable) {
                    if (Platform.OS === 'android') {
                        const { status } = await Pedometer.requestPermissionsAsync();
                        if (status !== 'granted') {
                            // User denied permission. We can't do anything.
                            // Maybe set available to 'false' to show UI warning?
                            // But usually we just let it be.
                            return;
                        }
                    }

                    // 1. Try to get historical steps for today
                    const start = new Date();
                    start.setHours(0, 0, 0, 0);
                    const end = new Date();

                    let initialSteps = 0;
                    try {
                        const history = await Pedometer.getStepCountAsync(start, end);
                        initialSteps = history.steps;
                    } catch (error) {
                        console.log('Failed to fetch step history:', error);
                        // If history fails, we essentially start fresh or from 0 for this session
                        // In a real production app, we might want to cache the last known steps in AsyncStorage
                    }

                    if (isMounted) {
                        setSteps(initialSteps);
                    }

                    // 2. Subscribe to real-time updates
                    // relying on 'result.steps' being the DELTA since last update
                    sub = Pedometer.watchStepCount(result => {
                        if (isMounted) {
                            setSteps(currentSteps => currentSteps + result.steps);
                        }
                    });

                    setSubscription(sub);
                }
            } catch (error) {
                if (isMounted) {
                    setIsPedometerAvailable('false');
                    console.log('Pedometer setup error:', error);
                }
            }
        };

        setupPedometer();

        return () => {
            isMounted = false;
            // Cleanup subscription
            if (sub) {
                sub.remove();
            } else if (subscription) {
                subscription.remove();
            }
        };
    }, []);

    const refreshGoal = async () => {
        await loadGoalFromProfile();
    };

    return (
        <StepContext.Provider value={{ steps, isPedometerAvailable, goal, refreshGoal }}>
            {children}
        </StepContext.Provider>
    );
}
