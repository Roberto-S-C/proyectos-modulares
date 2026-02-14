import Loading from '@/src/components/Loading';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

/**
 * Callback screen - kept for deep link compatibility
 */
export default function CallbackScreen() {
  const router = useRouter();

  useEffect(() => {
    // Give a moment for the login to complete, then redirect
    const timer = setTimeout(() => {
      router.replace('/(tabs)');
    }, 1500);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <SafeAreaView style={styles.screen}>
      <Loading />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  }
});

