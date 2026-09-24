import { AuthContext } from "@/src/contexts/AuthContext";
import { Role } from "@/src/types/account.type";
import { Stack } from "expo-router";
import { useContext } from "react";

export default function AdminLayout() {
    const authContext = useContext(AuthContext);
    const isAdmin = authContext.authState?.user?.role === Role.Admin;

    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Protected guard={isAdmin}>
                <Stack.Screen name="files" />
                <Stack.Screen name="modules" />
                <Stack.Screen name="evaluations" />
                <Stack.Screen name="calendar" />
            </Stack.Protected>
        </Stack>
    );
}
