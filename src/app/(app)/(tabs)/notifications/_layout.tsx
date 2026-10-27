import { stackScreenOptions } from "@/src/constants/stackScreenOptions";
import { Stack } from "expo-router";

export default function NotificationsLayout() {
    return (
        <Stack screenOptions={stackScreenOptions}>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="add" options={{ title: "Nueva Notificación" }} />
        </Stack>
    );
}
