import { Stack } from "expo-router";


export default function ProjectFileLayout() {
    return (
        <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="pdf" options={
                {
                    headerShown: true,
                    presentation: "modal" 
                }
            }
            />
        </Stack>
    )
}