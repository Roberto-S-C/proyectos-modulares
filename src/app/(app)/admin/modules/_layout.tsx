import HeaderBackButton from "@/src/components/HeaderBackButton";
import Colors from "@/src/constants/Colors";
import { Stack } from "expo-router";


export default function ModulesLayout() {
    return (
        <Stack screenOptions={{
            headerTintColor: Colors.secondary,
            headerTitleStyle: { fontWeight: 'bold' },
            headerTitleAlign: 'center',
        }}>
            <Stack.Screen name="index" options={{ title: "Módulos", headerLeft: ({ tintColor }) => <HeaderBackButton tintColor={tintColor} /> }} />
            <Stack.Screen name="add" options={{ title: 'Añadir Módulo' }} />
            <Stack.Screen name="[id]" options={{ title: 'Módulo' }} />
        </Stack>
    );
}