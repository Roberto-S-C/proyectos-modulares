import Colors from "@/src/constants/Colors";
import { Account } from "@/src/types/account.type";
import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Props {
    account: Account,
    isSelected: boolean,
    onPress: () => void
}

export default function AddMemberListItem({ account, isSelected, onPress }: Props) {

    return (
        <TouchableOpacity
            onPress={onPress}
            style={[styles.account, isSelected && styles.itemSelected]}
        >
            {isSelected && <Ionicons name="checkbox-sharp" size={38} color={Colors.secondary} />}
            {!isSelected && <Ionicons name="checkbox-outline" size={38} color={Colors.secondary} />}

            <View style={styles.info}>
                <Text style={styles.name}>{account.name} {account.lastname}</Text>
                <Text style={styles.role}>{account.role}</Text>
                <Text style={styles.email}>{account.email}</Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    itemSelected: {
        backgroundColor: Colors.selectedItemBackgroundColor
    },
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
