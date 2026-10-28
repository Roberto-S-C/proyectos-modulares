import { stackScreenOptions } from "@/src/constants/stackScreenOptions";
import { Stack } from "expo-router";

export default function OptionsLayout() {
    return (
        <Stack screenOptions={stackScreenOptions}>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="profile" options={{ title: "Perfil" }} />
            <Stack.Screen name="contact" options={{ title: "Contacto" }} />
        </Stack>
    );
}
