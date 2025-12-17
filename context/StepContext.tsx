import { Pedometer } from 'expo-sensors';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Alert, Platform } from 'react-native';
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

        const setupPedometer = async () => {
            // Load goal from profile
            await loadGoalFromProfile();

            // 1. Check if Pedometer is available on the device
            try {
                const isAvailable = await Pedometer.isAvailableAsync();
                if (!isMounted) return;
                setIsPedometerAvailable(String(isAvailable));

                if (isAvailable) {
                    // 2. Request Permissions (Android specifically needs ACTIVITY_RECOGNITION)
                    if (Platform.OS === 'android') {
                        const { status } = await Pedometer.requestPermissionsAsync();
                        if (status !== 'granted') {
                            Alert.alert('Permission Denied', 'Step counting requires permission to access your activity data.');
                            return;
                        }
                    }

                    // 3. Get steps for today (so far)
                    const end = new Date();
                    const start = new Date();
                    start.setHours(0, 0, 0, 0);

                    const pastStepCountResult = await Pedometer.getStepCountAsync(start, end);
                    if (isMounted) {
                        setSteps(pastStepCountResult.steps);
                    }

                    // 4. Subscribe to real-time updates
                    const sub = Pedometer.watchStepCount(result => {
                        Pedometer.getStepCountAsync(start, new Date()).then(result => {
                            if (isMounted) setSteps(result.steps);
                        }).catch(err => console.log("Error fetching steps in watcher", err));
                    });

                    setSubscription(sub);
                }
            } catch (error) {
                if (isMounted) {
                    setIsPedometerAvailable('false');
                    console.log('Pedometer error:', error);
                }
            }
        };

        setupPedometer();

        return () => {
            isMounted = false;
            subscription && subscription.remove();
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
