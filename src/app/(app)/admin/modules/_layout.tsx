import Colors from "@/src/constants/Colors";
import { Stack } from "expo-router";


export default function ModulesLayout() {
    return (
        <Stack screenOptions={{
            headerTintColor: Colors.secondary,
            headerTitleStyle: { fontWeight: 'bold' },
            headerTitleAlign: 'center',
        }}>
            <Stack.Screen name="[id]" options={{ title: 'Módulo' }} />
        </Stack>
    );
}