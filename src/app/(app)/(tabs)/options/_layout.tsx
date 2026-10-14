import Colors from "@/src/constants/Colors";
import { Stack } from "expo-router";

export default function OptionsLayout() {
    return (
        <Stack screenOptions={{
            headerTintColor: Colors.secondary,
            headerTitleStyle: { fontWeight: 'bold' },
            headerTitleAlign: 'center',
        }}>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="profile" options={{ title: "Perfil" }} />
        </Stack>
    );
}
