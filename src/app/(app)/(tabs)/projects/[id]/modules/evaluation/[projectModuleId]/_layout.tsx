import { stackScreenOptions } from "@/src/constants/stackScreenOptions";
import { Stack } from "expo-router";


export default function ProjectModuleEvaluationLayout() {
    return (
        <Stack screenOptions={stackScreenOptions}>
            <Stack.Screen name="index" options={{ title: "Detalle de Evaluación" }} />
        </Stack>
    );
}
