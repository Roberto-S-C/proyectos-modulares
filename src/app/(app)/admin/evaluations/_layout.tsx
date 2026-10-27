import { alwaysBackButtonOptions, stackScreenOptions } from "@/src/constants/stackScreenOptions";
import { Stack } from "expo-router";


export default function AdminEvaluationsLayout() {
    return (
        <Stack screenOptions={stackScreenOptions}>
            <Stack.Screen name="index" options={{ title: "Evaluaciones", ...alwaysBackButtonOptions }} />
        </Stack>
    );
}
