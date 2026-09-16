import { Stack } from "expo-router";


export default function ProjectModuleEvaluationLayout() {
    return (
        <Stack>
            <Stack.Screen name="index" options={{ title: "Detalle de Evaluación" }} />
        </Stack>
    );
}
