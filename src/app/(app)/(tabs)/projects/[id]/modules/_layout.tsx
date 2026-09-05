import { Stack } from "expo-router";



export default function ProjectModulesLayout() {
    return(
        <Stack>
            <Stack.Screen name="index" options={{title: "Módulos"}} />
        </Stack>
    );
}