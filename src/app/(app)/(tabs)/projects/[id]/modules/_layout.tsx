import Colors from "@/src/constants/Colors";
import { Stack } from "expo-router";



export default function ProjectModulesLayout() {
    return(
        <Stack screenOptions={{
            headerTintColor: Colors.secondary,
            headerTitleStyle: { fontWeight: 'bold' },
            headerTitleAlign: 'center',
        }}>
            <Stack.Screen name="index" options={{title: "Módulos"}} />
            <Stack.Screen name="preevaluation" options={{headerShown: false}} />
            <Stack.Screen name="evaluation" options={{headerShown: false}} />
        </Stack>
    );
}