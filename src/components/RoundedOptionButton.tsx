import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import Colors from "../constants/Colors";

interface Props {
    text: string,
    icon: string,
    navigationUrl: string,
}

export default function RoundedOptionButton({
    text,
    icon,
    navigationUrl,
}: Props) {
    const router = useRouter();

    return (
        <TouchableOpacity
            style={styles.button}
            onPress={() => router.navigate(navigationUrl)}
        >
            <Ionicons
                name={icon}
                size={32}
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
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        padding: 8,
        borderRadius: 12,
        backgroundColor: Colors.itemBackgroundColor
    },
    buttonText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.primary
    }
});