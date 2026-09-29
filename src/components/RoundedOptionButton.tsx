import Ionicons from "@expo/vector-icons/Ionicons";
import { ComponentProps } from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import Colors from "../constants/Colors";

interface Props {
    text: string,
    icon: ComponentProps<typeof Ionicons>['name'],
    onPress: () => void,
    disabled?: boolean
}

export default function RoundedOptionButton({
    text,
    icon,
    onPress,
    disabled = false
}: Props) {

    return (
        <TouchableOpacity
            style={[styles.button, disabled && styles.buttonDisabled]}
            onPress={onPress}
            disabled={disabled}
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
    buttonDisabled: {
        opacity: 0.5
    },
    buttonText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.secondary
    }
});