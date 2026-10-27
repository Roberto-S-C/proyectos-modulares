import { stackScreenOptions } from "@/src/constants/stackScreenOptions";
import { Stack } from "expo-router";


export default function ProjectEvaluationLayout() {
    return (
        <Stack screenOptions={stackScreenOptions}>
            <Stack.Screen name="index" options={{ title: "Evaluación" }} />
            <Stack.Screen name="add" options={{ title: "Añadir Evaluación" }} />
            <Stack.Screen name="[projectModuleId]" options={{ headerShown: false }} />
        </Stack>
    );
}
