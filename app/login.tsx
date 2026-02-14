import Loading from '@/src/components/Loading';
import { useAuth } from '@/src/contexts/AuthContext';
import React from 'react';
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../src/constants/Colors';

export default function LoginScreen() {
  const { login, isLoading, error } = useAuth();

  const handleLogin = async () => {
    try {
      await login();
    } catch (err: any) {
      Alert.alert('Login Error', err.message || 'Failed to login');
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>

        <Image
          source={require('../assets/images/logo.png')}
          style={styles.logo}
        />

        {error && (
          <View>
            <Text>Unable to Login...</Text>
          </View>
        )}

        <TouchableOpacity
          onPress={handleLogin}
          disabled={isLoading}
          style={styles.googleButton}
        >
          <Image
            source={require('../assets/images/google_button.jpg')}
            style={styles.googleLogo}
          />
          <Text style={styles.googleButtonText}>Iniciar Sesión con Google</Text>
        </TouchableOpacity>

        {isLoading && <Loading />}

      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.secondary
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: '50%',
    height: '50%'
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
    backgroundColor: Colors.itemBackgroundColor,
    padding: 8,
    borderRadius: 16
  },
  googleLogo: {
    width: 40,
    height: 40 
  },
  googleButtonText: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16
  },
  errorContainer: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
  loaderContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
});

