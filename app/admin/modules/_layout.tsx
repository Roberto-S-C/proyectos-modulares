import { Stack } from "expo-router";


export default function ModulesLayout() {
    return (
        <Stack>
            <Stack.Screen name="[id]" options={{ title: 'Módulo' }} />
        </Stack>
    );
}