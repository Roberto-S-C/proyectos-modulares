import { Stack } from "expo-router";


export default function ProjectPreevaluationLayout() {
    return (
        <Stack>
            <Stack.Screen name="index" options={{title: "Preevaluación"}} />
            <Stack.Screen name="add" options={{title: "Añadir Preevaluación"}} />
        </Stack>
    );

}