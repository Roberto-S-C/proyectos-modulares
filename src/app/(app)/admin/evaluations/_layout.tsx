import HeaderBackButton from "@/src/components/HeaderBackButton";
import Colors from "@/src/constants/Colors";
import { Stack } from "expo-router";


export default function AdminEvaluationsLayout() {
    return (
        <Stack screenOptions={{
            headerTintColor: Colors.secondary,
            headerTitleStyle: { fontWeight: 'bold' },
            headerTitleAlign: 'center',
        }}>
            <Stack.Screen name="index" options={{ title: "Evaluaciones", headerLeft: ({ tintColor }) => <HeaderBackButton tintColor={tintColor} /> }} />
        </Stack>
    );
}
