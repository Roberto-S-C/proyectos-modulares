import Colors from "@/src/constants/Colors";
import { Stack } from "expo-router";


export default function QuestionsLayout() {
    return (
        <Stack screenOptions={{
            headerTintColor: Colors.secondary,
            headerTitleStyle: { fontWeight: 'bold' },
            headerTitleAlign: 'center',
        }}>
            <Stack.Screen name="add" options={{ title: "Añadir Pregunta" }} />
            <Stack.Screen name="[id]" options={{ title: "Pregunta" }} />
        </Stack>
    );
}
