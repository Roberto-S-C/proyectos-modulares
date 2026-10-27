import { stackScreenOptions } from "@/src/constants/stackScreenOptions";
import { Stack } from "expo-router";


export default function UsersLayout() {
    return (
        <Stack screenOptions={{ ...stackScreenOptions, headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="[id]" options={{ headerShown: true, title: 'Detalles Cuenta' }} />
        </Stack>
    );
}