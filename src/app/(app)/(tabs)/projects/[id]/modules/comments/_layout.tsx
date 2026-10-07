import Colors from "@/src/constants/Colors";
import { Stack } from "expo-router";

export default function ProjectCommentsLayout() {
    return (
        <Stack screenOptions={{
            headerTintColor: Colors.secondary,
            headerTitleStyle: { fontWeight: 'bold' },
            headerTitleAlign: 'center',
        }}>
            <Stack.Screen name="index" options={{ title: "Comentarios" }} />
            <Stack.Screen name="add" options={{ title: "Agregar Comentario" }} />
        </Stack>
    );
}
