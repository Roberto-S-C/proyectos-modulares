import Colors from "@/src/constants/Colors";
import { Stack } from "expo-router";


export default function ProjectMembersLayout () {
    return(
        <Stack screenOptions={{
            headerTintColor: Colors.secondary,
            headerTitleStyle: { fontWeight: 'bold' },
            headerTitleAlign: 'center',
        }}>
            <Stack.Screen name="index" options={{title: "Miembros"}} />
            <Stack.Screen name="addMembers" options={{title: "Añadir Miembro"}} />
            <Stack.Screen name="addEvaluators" options={{title: "Añadir Evaluador"}} />
        </Stack>
    )
}