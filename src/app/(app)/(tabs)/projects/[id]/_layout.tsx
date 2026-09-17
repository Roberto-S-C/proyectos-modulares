import Colors from "@/src/constants/Colors";
import { Stack } from "expo-router";

export const unstable_settings = {
    initialRouteName: "index",
};

export default function ProjectLayout() {
    return (
        <Stack screenOptions={{
            headerTintColor: Colors.secondary,
            headerTitleStyle: { fontWeight: 'bold' },
            headerTitleAlign: 'center',
        }}>
            <Stack.Screen name="index" options={{ title: "Proyecto"}} />
            <Stack.Screen name="description" options={{ title: "Descripción"}} />
            <Stack.Screen name="files" options={{ headerShown: false }} />
            <Stack.Screen name="modules" options={{ headerShown: false }} />
            <Stack.Screen name="members" options={{ headerShown: false }} />
        </Stack>
    );
}