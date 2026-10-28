import AccountPersonalInfo from "@/src/components/Account/AccountPersonalInfo";
import ModifyRoleButton from "@/src/components/ModifyRoleButton";
import { AuthContext } from "@/src/contexts/AuthContext";
import { AccountDetails, Role } from "@/src/types/account.type";
import { useContext } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Props extends AccountDetails {
    onRoleUpdated: () => void,
}

export default function UserAccountDetailsScreen({ id, name, lastname, email, profilePicture, role, onRoleUpdated }: Props) {
    const authContext = useContext(AuthContext);
    const isAdmin = authContext.authState?.user?.role === Role.Admin;

    return (
        <SafeAreaView style={styles.screen}>
            <AccountPersonalInfo name={name} lastname={lastname} email={email} profilePicture={profilePicture} role={role} />
            {isAdmin &&
                <View style={styles.roleButtonContainer}>
                    <ModifyRoleButton accountId={id} currentRole={role} onRoleUpdated={onRoleUpdated} />
                </View>
            }
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
        width: '80%'
    }
});
