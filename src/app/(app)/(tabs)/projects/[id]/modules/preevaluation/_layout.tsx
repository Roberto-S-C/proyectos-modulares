import { stackScreenOptions } from "@/src/constants/stackScreenOptions";
import { Stack } from "expo-router";


export default function ProjectPreevaluationLayout() {
    return (
        <Stack screenOptions={stackScreenOptions}>
            <Stack.Screen name="index" options={{title: "Preevaluación"}} />
            <Stack.Screen name="add" options={{title: "Añadir Preevaluación"}} />
        </Stack>
    );

}