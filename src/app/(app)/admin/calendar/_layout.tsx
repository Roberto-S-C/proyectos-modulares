import HeaderBackButton from "@/src/components/HeaderBackButton";
import Colors from "@/src/constants/Colors";
import { Stack } from "expo-router";


export default function AdminCalendarLayout() {
    return (
        <Stack screenOptions={{
            headerTintColor: Colors.secondary,
            headerTitleStyle: { fontWeight: 'bold' },
            headerTitleAlign: 'center',
        }}>
            <Stack.Screen name="index" options={{ title: "Calendario", headerLeft: ({ tintColor }) => <HeaderBackButton tintColor={tintColor} /> }} />
            <Stack.Screen name="add" options={{ title: "Añadir Semestre" }} />
            <Stack.Screen name="[id]" options={{ title: "Semestre" }} />
        </Stack>
    );
}
