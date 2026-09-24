import Title from "@/src/components/Title";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AdminEvaluationsScreen() {
    return (
        <SafeAreaView style={styles.screen}>
            <Title text="Evaluaciones" />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        justifyContent: 'center',
    },
});
