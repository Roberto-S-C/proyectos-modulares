import Loading from "@/src/components/Loading";
import Colors from '@/src/constants/Colors';
import { AuthContext } from "@/src/contexts/AuthContext";
import { exchangeCodeForTokens, initAuthState, storeTokens, useGetAuthCode } from "@/src/services/authService";
import { useContext, useEffect, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen() {
  const [isButtonEnabled, setIsButtonEnabled] = useState(true);

  const { request, response, promptAsync } = useGetAuthCode();

  const authContext = useContext(AuthContext);

  useEffect(() => {
    if (request && response?.type == 'success') {
      const { codeVerifier } = request;
      const { code } = response.params;
      if (code && codeVerifier) {
        exchangeCodeForTokens(code, codeVerifier).then(tokens => {
          if (tokens) {
            storeTokens(tokens);
            initAuthState().then(res => authContext?.setAuthState(res));
          }
        })
      }
    }
    else {
      setIsButtonEnabled(true);
    }
  }, [response])

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>

        <Image
          source={require('@/src/assets/images/logo.png')}
          style={styles.logo}
        />

        {!authContext.isLoading && isButtonEnabled &&

          <TouchableOpacity
            onPress={() => {
              setIsButtonEnabled(false);
              promptAsync()
            }}
            style={styles.googleButton}
          >
            <Image
              source={require('@/src/assets/images/google_button.jpg')}
              style={styles.googleLogo}
            />
            <Text style={styles.googleButtonText}>Iniciar Sesión con Google</Text>
          </TouchableOpacity>
        }

        {authContext.isLoading && <Loading />}

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
    width: '85%',
    height: '70%',
    resizeMode: 'contain'
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

