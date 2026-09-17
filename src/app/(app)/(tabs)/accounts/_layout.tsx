import Colors from "@/src/constants/Colors";
import { Stack } from "expo-router";


export default function UsersLayout() {
    return (
        <Stack screenOptions={{
            headerShown: false,
            headerTintColor: Colors.secondary,
            headerTitleStyle: { fontWeight: 'bold' },
            headerTitleAlign: 'center',
        }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="[id]" options={{ headerShown: true, title: 'Detalles Cuenta' }} />
        </Stack>
    );
}