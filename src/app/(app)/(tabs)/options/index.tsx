import SettingsOptionButton from "@/src/components/SettingsOptionButton";
import Colors from "@/src/constants/Colors";
import { AuthContext } from "@/src/contexts/AuthContext";
import { removeTokens } from "@/src/services/authService";
import { useContext } from "react";
import { Image, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function OptionsScreen() {

    const authContext = useContext(AuthContext);


    return (
        <SafeAreaView style={styles.screen}>
            <Image source={require('@/src/assets/images/logo.png')} style={styles.logo} />
            <View style={styles.optionsContainer}>
                <SettingsOptionButton text="Perfil" iconName="person-circle" onPress={() => null} />
                <SettingsOptionButton text="Contacto" iconName="mail" onPress={() => null} />
                <SettingsOptionButton text="Cerrar Sesión" iconName="exit" onPress={async () => {
                    await removeTokens();
                    authContext.setAuthState(null);
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