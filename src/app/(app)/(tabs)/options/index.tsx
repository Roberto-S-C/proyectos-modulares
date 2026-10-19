import SettingsOptionButton from "@/src/components/SettingsOptionButton";
import Colors from "@/src/constants/Colors";
import { AuthContext } from "@/src/contexts/AuthContext";
import { removeTokens, revokeRefreshToken, signOutFromCognito } from "@/src/services/authService";
import { unregisterDevicePushToken } from "@/src/services/notificationService";
import { useRouter } from "expo-router";
import { useContext } from "react";
import { Image, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function OptionsScreen() {

    const authContext = useContext(AuthContext);
    const router = useRouter();

    return (
        <SafeAreaView style={styles.screen}>
            <Image source={require('@/src/assets/images/logo.png')} style={styles.logo} />
            <View style={styles.optionsContainer}>
                <SettingsOptionButton text="Perfil" iconName="person-circle" onPress={() => router.push("/(app)/(tabs)/options/profile")} />
                <SettingsOptionButton text="Contacto" iconName="mail" onPress={() => null} />
                <SettingsOptionButton text="Cerrar Sesión" iconName="exit" onPress={async () => {
                    const refreshToken = authContext.authState?.tokens.refresh_token;
                    // Needs the JWT, so before it's removed; never throws and waits at most a few seconds
                    await unregisterDevicePushToken();
                    await removeTokens();
                    authContext.setAuthState(null);

                    // After the app's own sign out, so it happens even if these fail or the
                    // user closes the browser
                    if (refreshToken) revokeRefreshToken(refreshToken);
                    signOutFromCognito();
                }} />
            </View>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.secondary
    },
    optionsContainer: {
        gap: 8
    },
    logo: {
        width: '85%',
        height: '70%',
        resizeMode: 'contain'
    }
});