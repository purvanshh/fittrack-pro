import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { StyleSheet, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";

type TabIconName = "home" | "barbell" | "water" | "restaurant" | "person";

export default function TabLayout() {
    const { theme } = useTheme();

    return (
        <Tabs
            screenOptions={{
                headerShown: true,
                headerStyle: {
                    backgroundColor: theme.colors.surface,
                },
                headerTitleStyle: {
                    color: theme.colors.text,
                    fontWeight: "600",
                    fontSize: 18,
                },
                tabBarActiveTintColor: theme.colors.primary,
                tabBarInactiveTintColor: theme.colors.textSecondary,
                tabBarStyle: {
                    backgroundColor: theme.colors.surface,
                    borderTopColor: theme.colors.border,
                    borderTopWidth: 1,
                    paddingTop: 8,
                    paddingBottom: 8,
                    height: 70,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: "500",
                    marginTop: 4,
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Dashboard",
                    headerTitle: "FitTrack Pro",
                    tabBarIcon: ({ color, focused }) => (
                        <TabIcon name="home" color={color} focused={focused} />
                    ),
                }}
            />
            <Tabs.Screen
                name="workout"
                options={{
                    title: "Workout",
                    headerTitle: "Workout Tracker",
                    tabBarIcon: ({ color, focused }) => (
                        <TabIcon name="barbell" color={color} focused={focused} />
                    ),
                }}
            />
            <Tabs.Screen
                name="water"
                options={{
                    title: "Water",
                    headerTitle: "Water Tracker",
                    tabBarIcon: ({ color, focused }) => (
                        <TabIcon name="water" color={color} focused={focused} />
                    ),
                }}
            />
            <Tabs.Screen
                name="meals"
                options={{
                    title: "Meals",
                    headerTitle: "Meal Tracker",
                    tabBarIcon: ({ color, focused }) => (
                        <TabIcon name="restaurant" color={color} focused={focused} />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: "Profile",
                    headerTitle: "Your Profile",
                    tabBarIcon: ({ color, focused }) => (
                        <TabIcon name="person" color={color} focused={focused} />
                    ),
                }}
            />
        </Tabs>
    );
}

function TabIcon({ name, color, focused }: { name: TabIconName; color: string; focused: boolean }) {
    const { theme } = useTheme();

    return (
        <View style={[
            styles.iconContainer,
            focused && { backgroundColor: theme.colors.primaryLight + '20' }
        ]}>
            <Ionicons
                name={focused ? name : `${name}-outline` as any}
                size={24}
                color={color}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    iconContainer: {
        width: 48,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
