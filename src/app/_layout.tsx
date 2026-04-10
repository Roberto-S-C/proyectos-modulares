import { AuthContext } from '@/src/contexts/AuthContext';
import { Stack } from 'expo-router';
import { useContext } from 'react';
import { AuthProvider } from '../contexts/AuthContext';
import SplashScreenController from './splash';

function RootNavigator() {
  const authContext = useContext(AuthContext);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={authContext.isAuthenticated}>
        <Stack.Screen name='(app)' />
      </Stack.Protected>

      <Stack.Protected guard={!authContext.isAuthenticated}>
        <Stack.Screen name='login' />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {

  return (
    <AuthProvider>
      <SplashScreenController />
      <RootNavigator />
    </AuthProvider>
  );
}
