import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import Colors from "../constants/Colors";

interface Props {
    text: string,
    icon: string,
    onPress: () => void
}

export default function RoundedOptionButton({
    text,
    icon,
    onPress
}: Props) {

    return (
        <TouchableOpacity
            style={styles.button}
            onPress={onPress}
        >
            <Ionicons
                name={icon}
                size={28}
                color={Colors.secondary}
            />

            <Text style={styles.buttonText}>
                {text}
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        padding: 8,
        borderRadius: 12,
        backgroundColor: Colors.primary
    },
    buttonText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.secondary
    }
});