import { Stack } from "expo-router";

export const unstable_settings = {
    initialRouteName: "index",
};

export default function ProjectsLayout() {
    return (
        <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} dangerouslySingular />
            <Stack.Screen name="[id]" options={{ headerShown: false }} dangerouslySingular />
            <Stack.Screen name="create" options={{ headerShown: false }} />
        </Stack>
    );
}