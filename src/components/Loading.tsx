import Colors from "@/src/constants/Colors";
import { ActivityIndicator, StyleSheet, View } from "react-native";

interface LoadingProps {
    size?: number | 'small' | 'large';
    fullScreen?: boolean;
}

export default function Loading({ size = 'large', fullScreen = false }: LoadingProps) {
    return (
        <View style={[styles.container, fullScreen && styles.fullScreen]}>
            <ActivityIndicator size={size} color={Colors.secondary} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    fullScreen: {
        flex: 1,
    },
});
