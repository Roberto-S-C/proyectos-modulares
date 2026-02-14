import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import Colors from "../constants/Colors";

export default function ModifyRoleButton() {
    const router = useRouter();

    return (
        <TouchableOpacity style={styles.container} onPress={() => router.navigate('/modifyRoleModal')}>
            <Ionicons name="key" size={32} color={Colors.secondary} />
            <Text style={styles.text}>Modificar Rol</Text>
        </TouchableOpacity>

    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        padding: 8,
        gap: 8,
        elevation: 4,
        borderRadius: 12,
        backgroundColor: Colors.itemBackgroundColor,
    },
    text: {
        fontSize: 28,
        fontWeight: 'bold', 
        color: Colors.secondary
    }
});