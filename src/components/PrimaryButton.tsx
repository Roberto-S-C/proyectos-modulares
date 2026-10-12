import Colors from "@/src/constants/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ComponentProps } from "react";
import { StyleProp, StyleSheet, Text, TouchableOpacity, ViewStyle } from "react-native";

interface Props {
    text: string,
    onPress: () => void,
    icon?: ComponentProps<typeof Ionicons>['name'],
    disabled?: boolean,
    style?: StyleProp<ViewStyle>,
}

export default function PrimaryButton({ text, onPress, icon, disabled = false, style }: Props) {
    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled}
            style={[styles.button, disabled && styles.buttonDisabled, style]}>
            {icon && <Ionicons name={icon} size={28} color={Colors.secondary} />}
            <Text style={styles.buttonText}>{text}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
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
