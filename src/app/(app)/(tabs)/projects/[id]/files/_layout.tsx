import { Stack } from "expo-router";


export default function ProjectFilesLayout () {
    return(
        <Stack>
            <Stack.Screen name="index" options={{headerShown: false}} />
            <Stack.Screen name="add" options={{headerShown: false}} />
            <Stack.Screen name="[fileId]" options={{headerShown: false}} />
        </Stack>
    )
}