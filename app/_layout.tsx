import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { AuthProvider } from '@/src/contexts/AuthContext';

export default function RootLayout() {

  return (
    <AuthProvider>
        <Stack>
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="callback" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="admin" options={{ headerShown: false }} />
          <Stack.Screen name="member" options={{ headerShown: false }} />
          <Stack.Screen name="modifyRoleModal" options={{ presentation: 'modal', title: 'Modificar Rol' }} />
        </Stack>
        <StatusBar style="auto" />
    </AuthProvider>
  );
}
