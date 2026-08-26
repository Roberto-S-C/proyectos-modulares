import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, Text, useWindowDimensions, View } from "react-native";
import Colors from "../constants/Colors";

interface Props {
    text: string
}

export default function NotFoundItem({ text }: Props) {
    const { width } = useWindowDimensions();

    const iconSize = Math.min(150, width * 0.5);
    const fontSize = Math.min(26, width * 0.1);

    return (
        <View style={styles.notFoundContainer}>
            <Ionicons name="alert-circle" size={iconSize} color={Colors.secondary} />
            <Text style={[styles.notFoundText, { fontSize }]}>{text}</Text>
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
        fontWeight: 'bold',
        color: Colors.textPrimary
    }
});