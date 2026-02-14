import { Stack } from "expo-router";

export default function ProjectLayout() {
    return (
        <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="modules" options={{ headerShown: false }} />
        </Stack>
    );
}