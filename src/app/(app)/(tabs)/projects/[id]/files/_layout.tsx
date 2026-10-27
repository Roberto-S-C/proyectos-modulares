import { stackScreenOptions } from "@/src/constants/stackScreenOptions";
import { Stack } from "expo-router";


export default function ProjectFilesLayout() {
    return (
        <Stack screenOptions={stackScreenOptions}>
            <Stack.Screen name="index" options={{ title: "Archivos" }} />
            <Stack.Screen name="add" options={{ title: "Añadir Archivos" }} />
            <Stack.Screen name="[fileId]" options={{ headerShown: false }} />
        </Stack>
    )
}