import SettingsOptionButton from "@/src/components/SettingsOptionButton";
import Colors from "@/src/constants/Colors";
import { useAuth } from "@/src/contexts/AuthContext";
import { useEffect } from "react";
import { Image, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function OptionsScreen() {

    let authContext = useAuth();

    useEffect(() => {

    }, []);

    return (
        <SafeAreaView style={styles.screen}>
            <Image source={require('../../../assets/images/logo.png')} style={styles.logo} />
            <View style={styles.optionsContainer}>
                <SettingsOptionButton text="Perfil" iconName="person-circle" onPress={() => null} />
                <SettingsOptionButton text="Contacto" iconName="mail" onPress={() => null} />
                <SettingsOptionButton text="Cerrar Sesión" iconName="exit" onPress={authContext.logout} />
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
        width: '50%',
        height: '50%'
    }
});