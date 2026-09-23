import RoundedText from "@/src/components/RoundedText";
import Colors from "@/src/constants/Colors";
import { Image, StyleSheet, Text, View } from "react-native";

interface PersonalInfo {
    name: string,
    lastname: string,
    email: string,
    role: string
    profilePicture: string
}

export default function AccountPersonalInfo({ name, lastname, email, profilePicture, role }: PersonalInfo) {
    return (
        <View style={styles.card}>
            <Image source={{ uri: profilePicture }} style={styles.profilePicture} />
            <View style={styles.info}>
                <Text style={styles.name}>{name} {lastname}</Text>
                <Text style={styles.email}>{email}</Text>
                <View style={styles.role}>
                    <RoundedText text={role} fontSize={14} />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        width: '92%',
        padding: 16,

        // iOS
        shadowColor: Colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 6,

        // Android
        elevation: 3,
    },
    profilePicture: {
        width: 100,
        height: 125,
        borderRadius: 8,
    },
    info: {
        flex: 1,
        gap: 6,
    },
    name: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.primary,
    },
    email: {
        fontSize: 14,
        color: Colors.textSecondary,
    },
    role: {
        alignSelf: 'flex-start',
        marginTop: 4,
    },
});
