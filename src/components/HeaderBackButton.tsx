import Colors from "@/src/constants/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { TouchableOpacity } from "react-native";

interface Props {
    tintColor?: string
}

export default function HeaderBackButton({ tintColor = Colors.secondary }: Props) {
    const router = useRouter();

    return (
        <TouchableOpacity
            onPress={() => router.canGoBack() ? router.back() : router.replace('/(app)/(tabs)')}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
            <Ionicons name="arrow-back" size={24} color={tintColor} />
        </TouchableOpacity>
    );
}
