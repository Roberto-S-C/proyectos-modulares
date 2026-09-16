import Colors from "@/src/constants/Colors";
import { StyleProp, StyleSheet, Text, TouchableOpacity, ViewStyle } from "react-native";

interface Props {
    text: string,
    onPress: () => void,
    disabled?: boolean,
    style?: StyleProp<ViewStyle>,
}

export default function PrimaryButton({ text, onPress, disabled = false, style }: Props) {
    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled}
            style={[styles.button, disabled && styles.buttonDisabled, style]}>
            <Text style={styles.buttonText}>{text}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '50%',
        padding: 8,
        backgroundColor: Colors.primary,
        borderRadius: 10
    },
    buttonDisabled: {
        opacity: 0.5
    },
    buttonText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.secondary
    }
});