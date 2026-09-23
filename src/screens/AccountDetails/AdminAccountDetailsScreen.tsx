import AccountPersonalInfo from "@/src/components/Account/AccountPersonalInfo";
import { AccountDetails } from "@/src/types/account.type";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


export default function AdminAccountDetailsScreen({ name, lastname, email, profilePicture, role }: AccountDetails) {
    return (
        <SafeAreaView style={styles.screen}>
            <AccountPersonalInfo name={name} lastname={lastname} email={email} profilePicture={profilePicture} role={role} />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
    },
});
