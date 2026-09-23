import AccountPersonalInfo from "@/src/components/Account/AccountPersonalInfo";
import ModifyRoleButton from "@/src/components/ModifyRoleButton";
import { AccountDetails } from "@/src/types/account.type";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


export default function UserAccountDetailsScreen({ name, lastname, email, profilePicture, role }: AccountDetails) {
    return (
        <SafeAreaView style={styles.screen}>
            <AccountPersonalInfo name={name} lastname={lastname} email={email} profilePicture={profilePicture} role={role} />
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
        alignItems: 'center',
        gap: 16
    },
    roleButtonContainer: {
        alignSelf: 'center',
        width: '60%'
    }
});
