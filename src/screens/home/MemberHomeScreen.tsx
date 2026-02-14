import SquareOptionButton from "@/src/components/SquareOptionButton";
import Title from "@/src/components/Title";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MemberHomeScreen() {
    return (
        <SafeAreaView style={styles.screen}>
            <View style={styles.container}>
                <Title text="Proyecto" />
                <View style={styles.optionButtonsContainer}>
                    <SquareOptionButton text="Información" icon="information-circle" navigationUrl="/" size="l" />
                    <SquareOptionButton text="Miembros" icon="people-circle" navigationUrl="/" size="l" />
                    <SquareOptionButton text="Archivos" icon="folder" navigationUrl="/" size="l" />
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        padding: 16
    },
    container: {
        padding: 8,
        gap: 16 
    },
    optionButtonsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 16,
    },
});