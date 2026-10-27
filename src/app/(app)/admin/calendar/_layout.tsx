import { alwaysBackButtonOptions, stackScreenOptions } from "@/src/constants/stackScreenOptions";
import { Stack } from "expo-router";


export default function AdminCalendarLayout() {
    return (
        <Stack screenOptions={stackScreenOptions}>
            <Stack.Screen name="index" options={{ title: "Calendario", ...alwaysBackButtonOptions }} />
            <Stack.Screen name="add" options={{ title: "Añadir Semestre" }} />
            <Stack.Screen name="[id]" options={{ title: "Semestre" }} />
        </Stack>
    );
}
