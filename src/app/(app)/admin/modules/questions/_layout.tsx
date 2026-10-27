import { stackScreenOptions } from "@/src/constants/stackScreenOptions";
import { Stack } from "expo-router";


export default function QuestionsLayout() {
    return (
        <Stack screenOptions={stackScreenOptions}>
            <Stack.Screen name="add" options={{ title: "Añadir Pregunta" }} />
            <Stack.Screen name="[id]" options={{ title: "Pregunta" }} />
        </Stack>
    );
}
