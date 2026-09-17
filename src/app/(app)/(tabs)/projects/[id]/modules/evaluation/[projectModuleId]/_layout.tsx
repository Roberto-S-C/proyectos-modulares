import Colors from "@/src/constants/Colors";
import { Stack } from "expo-router";


export default function ProjectModuleEvaluationLayout() {
    return (
        <Stack screenOptions={{
            headerTintColor: Colors.secondary,
            headerTitleStyle: { fontWeight: 'bold' },
            headerTitleAlign: 'center',
        }}>
            <Stack.Screen name="index" options={{ title: "Detalle de Evaluación" }} />
        </Stack>
    );
}
