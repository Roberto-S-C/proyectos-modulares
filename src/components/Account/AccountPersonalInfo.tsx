import RoundedText from "@/src/components/RoundedText";
import Colors from "@/src/constants/Colors";
import { Image, StyleSheet, Text, View } from "react-native";

interface PersonalInfo {
    name: string,
    lastname: string,
    email: string,
    role: string
    profile_picture: string
}

export default function AccountPersonalInfo({ name, lastname, email, profile_picture, role  }: PersonalInfo) {
    return (
        <View style={styles.container}>
            <Image source={{ uri: profile_picture }} style={styles.profile_picture} />
            <Text style={styles.email}>{name} {lastname}</Text>
            <RoundedText text={role.split('_')[1]} fontSize={20} bgColor={Colors.primary} textColor={Colors.secondary} />
            <Text style={styles.email}>{email}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        gap: 8
    },
    profile_picture: {
        width: 200,
        height: 200,
        borderRadius: 100
    },
    email: {
        textAlign: 'center',
        fontSize: 16,
        color: Colors.primary
    },
});