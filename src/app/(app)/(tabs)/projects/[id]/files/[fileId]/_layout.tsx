import Colors from "@/src/constants/Colors";
import { Stack } from "expo-router";


export default function ProjectFileLayout() {
    return (
        <Stack screenOptions={{
            headerTintColor: Colors.secondary,
            headerTitleStyle: { fontWeight: 'bold' },
            headerTitleAlign: 'center',
        }}>
            <Stack.Screen name="index" options={{ headerShown: true , title: "Archivo"}} />
            <Stack.Screen name="pdf" options={
                {
                    headerShown: true,
                    presentation: "modal"
                }
            } />
            <Stack.Screen name="addReview" options={{ headerShown: true, title: "Evaluación Archivo" }} />
        </Stack>
    )
}