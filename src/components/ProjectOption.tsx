import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Colors from "../constants/Colors";

interface Props {
    text: string,
    iconName: string,
    navigationUrl: string
    navigationUrlProjectIdParam: number
}

export default function ProjectOption({ text, iconName, navigationUrl, navigationUrlProjectIdParam }: Props) {
    const router = useRouter();

    return (
        <TouchableOpacity onPress={() => router.navigate({ pathname: navigationUrl, params: { id: navigationUrlProjectIdParam } })} style={styles.container}>
            <View style={styles.iconContainer}>
                <Ionicons name={iconName} size={40} color={Colors.secondary} />
            </View>
            <Text style={styles.text}>{text}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 8,
        backgroundColor: '#fff',
        borderRadius: 12,
        marginVertical: 8,
        marginHorizontal: 8,
        // Shadow for iOS
        shadowColor: Colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        // Elevation for Android
        elevation: 3,
    },
    iconContainer: {
        position: 'absolute',
        left: 12,
    },
    text: {
        textAlign: 'center',
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.primary,
    }
});

