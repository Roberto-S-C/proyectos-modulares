import Colors from "@/src/constants/Colors";
import { Stack } from "expo-router";

export default function NotificationsLayout() {
    return (
        <Stack screenOptions={{
            headerTintColor: Colors.secondary,
            headerTitleStyle: { fontWeight: 'bold' },
            headerTitleAlign: 'center',
        }}>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="add" options={{ title: "Nueva Notificación" }} />
        </Stack>
    );
}
