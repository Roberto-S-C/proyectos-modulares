import { stackScreenOptions } from "@/src/constants/stackScreenOptions";
import { Stack } from "expo-router";

export default function ProjectCommentsLayout() {
    return (
        <Stack screenOptions={stackScreenOptions}>
            <Stack.Screen name="index" options={{ title: "Comentarios" }} />
            <Stack.Screen name="add" options={{ title: "Agregar Comentario" }} />
        </Stack>
    );
}
