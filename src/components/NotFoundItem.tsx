import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, Text, View } from "react-native";
import Colors from "../constants/Colors";

interface Props {
    text: string
}

export default function NotFoundItem({ text }: Props) {
    return (
        <View style={styles.notFoundContainer}>
            <Ionicons name="alert-circle" size={200} color={Colors.secondary} />
            <Text style={styles.notFoundText}>{text}</Text>
        </View >
    );

}

const styles = StyleSheet.create({
    notFoundContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    notFoundText: {
        textAlign: 'center',
        fontSize: 40,
        fontWeight: 'bold',
        color: Colors.textPrimary
    }
});