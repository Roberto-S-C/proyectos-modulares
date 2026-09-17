import Colors from "@/src/constants/Colors";
import { Stack } from "expo-router";


export default function ProjectEvaluationLayout() {
    return (
        <Stack screenOptions={{
            headerTintColor: Colors.secondary,
            headerTitleStyle: { fontWeight: 'bold' },
            headerTitleAlign: 'center',
        }}>
            <Stack.Screen name="index" options={{ title: "Evaluación" }} />
            <Stack.Screen name="add" options={{ title: "Añadir Evaluación" }} />
            <Stack.Screen name="[projectModuleId]" options={{ headerShown: false }} />
        </Stack>
    );
}
