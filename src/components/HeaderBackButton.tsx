import Colors from "@/src/constants/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { StyleSheet, TouchableOpacity } from "react-native";

interface Props {
    tintColor?: string
}

export default function HeaderBackButton({ tintColor = Colors.secondary }: Props) {
    const router = useRouter();

    return (
        <TouchableOpacity
            onPress={() => router.canGoBack() ? router.back() : router.replace('/(app)/(tabs)')}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            style={styles.button}
        >
            <Ionicons name="arrow-back" size={24} color={tintColor} />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    // An explicit size: iOS header items without one can collapse and not show
    button: {
        width: 32,
        height: 32,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
