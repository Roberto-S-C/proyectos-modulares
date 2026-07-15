import AccountPersonalInfo from "@/src/components/Account/AccountPersonalInfo";
import ModifyRoleButton from "@/src/components/ModifyRoleButton";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


interface UserDetails {
    id: string,
    name: string,
    lastname: string,
    email: string,
    profile_picture: string
    role: string
}


export default function UserAccountDetailsScreen({ id, name, lastname, email, profile_picture, role }: UserDetails) {
    return (
        <SafeAreaView style={styles.screen}>
            <AccountPersonalInfo name={name} lastname={lastname} email={email} profile_picture={profile_picture} role={role} />
            <View style={styles.roleButtonContainer}>
                <ModifyRoleButton />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        width: '100%',
        gap: 16 
    },
    roleButtonContainer: {
        alignSelf: 'center',
        width: '60%'
    }
});