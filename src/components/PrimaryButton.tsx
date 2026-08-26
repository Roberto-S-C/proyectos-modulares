import Colors from "@/src/constants/Colors";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

interface Props {
    text: string,
    onPress: () => void  
}

export default function PrimaryButton({ text, onPress }: Props) {
    return (
        <TouchableOpacity
            onPress={onPress}
            style={styles.button}>
            <Text style={styles.buttonText}>{text}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '50%',
        padding: 16,
        backgroundColor: Colors.primary,
        borderRadius: 10
    },
    buttonText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.secondary
    }
});