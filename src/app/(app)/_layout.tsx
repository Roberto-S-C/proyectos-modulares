import { AuthContext } from '@/src/contexts/AuthContext';
import { configureNotificationHandler, registerDevicePushToken } from '@/src/services/notificationService';
import { Stack } from 'expo-router';
import { useContext, useEffect } from 'react';

configureNotificationHandler();

export default function AppLayout() {
    const authContext = useContext(AuthContext);
    const userId = authContext.authState?.user?.id;

    // Only rendered while signed in. Registers this device's push token on every launch and
    // sign-in, so the backend keeps it current and assigns it to whoever is signed in now
    useEffect(() => {
        if (!userId) return;

        // Best-effort: the app works without notifications, and the next launch retries
        registerDevicePushToken().catch(() => { });
    }, [userId]);

    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="admin" />
        </Stack>
    );
}
