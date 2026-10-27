import { alwaysBackButtonOptions, stackScreenOptions } from "@/src/constants/stackScreenOptions";
import { Stack } from "expo-router";


export default function AdminFilesLayout() {
    return (
        <Stack screenOptions={stackScreenOptions}>
            <Stack.Screen name="index" options={{ title: "Archivos", ...alwaysBackButtonOptions }} />
            <Stack.Screen name="add" options={{ title: "Añadir Archivo" }} />
            <Stack.Screen name="[id]" options={{ title: "Archivo" }} />
        </Stack>
    );
}
