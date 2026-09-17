import Colors from "@/src/constants/Colors";
import { Stack } from "expo-router";


export default function ProjectPreevaluationLayout() {
    return (
        <Stack screenOptions={{
            headerTintColor: Colors.secondary,
            headerTitleStyle: { fontWeight: 'bold' },
            headerTitleAlign: 'center',
        }}>
            <Stack.Screen name="index" options={{title: "Preevaluación"}} />
            <Stack.Screen name="add" options={{title: "Añadir Preevaluación"}} />
        </Stack>
    );

}