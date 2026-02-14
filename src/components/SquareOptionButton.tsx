import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import Colors from "../constants/Colors";

const SIZE_MAP = {
    s: {
        icon: 50,
        font: 14,
        padding: 12,
        width: '33%',
    },
    m: {
        icon: 75,
        font: 18,
        padding: 16,
        width: '33%',
    },
    l: {
        icon: 100,
        font: 22,
        padding: 20,
        width: '55%',
    },
} as const;

interface Props {
    text: string,
    icon: string,
    navigationUrl: string,
    size: 's' | 'm' | 'l' 
}

export default function SquareOptionButton({
    text,
    icon,
    navigationUrl,
    size,
}: Props) {
    const router = useRouter();
    const sizes = SIZE_MAP[size];

    return (
        <TouchableOpacity
            style={[
                styles.button,
                {
                    width: sizes.width,
                    aspectRatio: 1,
                    padding: sizes.padding,
                },
            ]}
            onPress={() => router.navigate(navigationUrl)}
        >
            <Ionicons
                name={icon}
                size={sizes.icon}
                color={Colors.secondary}
            />

            <Text
                style={[
                    styles.buttonText,
                    { fontSize: sizes.font },
                ]}
            >
                {text}
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '50%',
        padding: 16,
        backgroundColor: Colors.itemBackgroundColor,
    },
    buttonText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.primary
    }
});