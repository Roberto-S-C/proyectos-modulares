import { Stack } from "expo-router";


export default function ProjectEvaluationLayout() {
    return (
        <Stack>
            <Stack.Screen name="index" options={{ title: "Evaluación" }} />
            <Stack.Screen name="add" options={{ title: "Añadir Evaluación" }} />
            <Stack.Screen name="[projectModuleId]" options={{ headerShown: false }} />
        </Stack>
    );
}
