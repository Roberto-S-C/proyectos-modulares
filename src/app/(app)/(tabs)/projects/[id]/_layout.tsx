import Colors from "@/src/constants/Colors";
import { Stack, useLocalSearchParams } from "expo-router";

export const unstable_settings = {
    initialRouteName: "index",
};

export default function ProjectLayout() {
    const { id } = useLocalSearchParams();

    // When "index" is loaded as the anchor (navigating straight to a nested screen with
    // withAnchor) it only gets its initialParams, so it needs the project id from here
    return (
        <Stack screenOptions={{
            headerTintColor: Colors.secondary,
            headerTitleStyle: { fontWeight: 'bold' },
            headerTitleAlign: 'center',
        }}>
            <Stack.Screen name="index" options={{ title: "Proyecto"}} initialParams={{ id }} />
            <Stack.Screen name="description" options={{ title: "Descripción"}} />
            <Stack.Screen name="files" options={{ headerShown: false }} />
            <Stack.Screen name="modules" options={{ headerShown: false }} />
            <Stack.Screen name="members" options={{ headerShown: false }} />
        </Stack>
    );
}