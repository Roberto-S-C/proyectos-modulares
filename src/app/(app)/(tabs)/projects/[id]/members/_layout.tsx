import { stackScreenOptions } from "@/src/constants/stackScreenOptions";
import { Stack } from "expo-router";


export default function ProjectMembersLayout () {
    return(
        <Stack screenOptions={stackScreenOptions}>
            <Stack.Screen name="index" options={{title: "Miembros"}} />
            <Stack.Screen name="addMembers" options={{title: "Añadir Miembro"}} />
            <Stack.Screen name="addEvaluators" options={{title: "Añadir Evaluador"}} />
        </Stack>
    )
}