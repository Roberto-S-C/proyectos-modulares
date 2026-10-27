import { stackScreenOptions } from "@/src/constants/stackScreenOptions";
import { Stack } from "expo-router";


export default function ProjectFileLayout() {
    return (
        <Stack screenOptions={stackScreenOptions}>
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