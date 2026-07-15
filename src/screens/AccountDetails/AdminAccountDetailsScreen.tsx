import AccountPersonalInfo from "@/src/components/Account/AccountPersonalInfo";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


interface AdminDetails {
    id: string,
    name: string,
    lastname: string,
    email: string,
    profile_picture: string
    role: string
}


export default function AdminAccountDetailsScreen({ id, name, lastname, email, profile_picture, role }: AdminDetails) {
    return (
        <SafeAreaView style={styles.screen}>
            <AccountPersonalInfo name={name} lastname={lastname} email={email} profile_picture={profile_picture} role={role} />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        width: '100%',
    },
});