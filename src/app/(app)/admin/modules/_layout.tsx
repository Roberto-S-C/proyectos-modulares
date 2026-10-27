import { alwaysBackButtonOptions, stackScreenOptions } from "@/src/constants/stackScreenOptions";
import { Stack } from "expo-router";


export default function ModulesLayout() {
    return (
        <Stack screenOptions={stackScreenOptions}>
            <Stack.Screen name="index" options={{ title: "Módulos", ...alwaysBackButtonOptions }} />
            <Stack.Screen name="add" options={{ title: 'Añadir Módulo' }} />
            <Stack.Screen name="questions" options={{ headerShown: false }} />
            <Stack.Screen name="[id]" options={{ title: 'Módulo' }} />
        </Stack>
    );
}