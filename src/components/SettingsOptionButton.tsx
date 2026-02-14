import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import Colors from "../constants/Colors";

interface Props {
    text: string,
    iconName: string ,
    onPress(): void  
}

export default function SettingsOptionButton({ text, iconName, onPress }: Props) {

    return(
        <TouchableOpacity style={styles.button} onPress={onPress}>
            <Ionicons name={iconName} size={32} color={Colors.textPrimary} />
            <Text style={styles.text}>{text}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4
    },
    text: {
        fontSize: 28,
        fontWeight: 'bold',
        color: Colors.textPrimary
    }
});