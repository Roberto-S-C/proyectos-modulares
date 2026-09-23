import Colors from "@/src/constants/Colors";
import { Stack } from "expo-router";


export default function ProjectFilesLayout() {
    return (
        <Stack screenOptions={{
            headerTintColor: Colors.secondary,
            headerTitleStyle: { fontWeight: 'bold' },
            headerTitleAlign: 'center',
        }}>
            <Stack.Screen name="index" options={{ title: "Archivos" }} />
            <Stack.Screen name="add" options={{ title: "Añadir Archivos" }} />
            <Stack.Screen name="[fileId]" options={{ headerShown: false }} />
        </Stack>
    )
}