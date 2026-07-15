import { Role } from "@/src/types/account.type";
import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Colors from "../../constants/Colors";

export default function AccountListItem({ id, name, lastname, email, role, onPress }: any) {

    return (
        <TouchableOpacity onPress={onPress}
            style={styles.account}
        >
            <View>
                {role == Role.Admin && <Ionicons name="shield-checkmark" size={48} color={Colors.secondary} />}
                {role == Role.Alumno && <Ionicons name="school" size={48} color={Colors.secondary} />}
                {role == Role.Evaluador && <Ionicons name="document-text" size={48} color={Colors.secondary} />}
                {role == Role.Asesor && <Ionicons name="briefcase-sharp" size={48} color={Colors.secondary} />}
                {role == Role.Usuario && <Ionicons name="person" size={48} color={Colors.secondary} />}
            </View>
            <View style={styles.info}>
                <Text style={styles.name}>{name} {lastname}</Text>
                <Text style={styles.role}>{role.split('_')[1]}</Text>
                <Text style={styles.email}>{email}</Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    account: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 2,
        gap: 12,
        padding: 4,
        backgroundColor: Colors.itemBackgroundColor,

        // iOS
        shadowColor: Colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,

        // Android
        elevation: 4,
    },
    info: {
        gap: 4
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.textPrimary
    },
    role: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.primary
    },
    email: {
        fontSize: 12,
        color: Colors.textSecondary
    }
});