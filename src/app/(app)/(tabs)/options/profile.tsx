import AccountPersonalInfo from '@/src/components/Account/AccountPersonalInfo';
import Loading from '@/src/components/Loading';
import NotFoundItem from '@/src/components/NotFoundItem';
import { AuthContext } from '@/src/contexts/AuthContext';
import { getAccountDetails } from '@/src/services/accountService';
import { AccountDetails } from '@/src/types/account.type';
import { useFocusEffect } from "expo-router";
import { useCallback, useContext, useState } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// The signed-in user's own info, with the same card as accounts/[id] but no related projects
export default function ProfileScreen() {
    const [account, setAccount] = useState<AccountDetails | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const authContext = useContext(AuthContext);
    const userId = authContext.authState?.user?.id;

    const fetchAccountDetails = useCallback(async () => {
        if (!userId) {
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setAccount(null);
        try {
            const res = await getAccountDetails(userId);
            if (res.status === 200 && res.data) {
                setAccount(res.data);
            }
        }
        catch (e) { }
        finally {
            setIsLoading(false);
        }
    }, [userId]);

    useFocusEffect(
        useCallback(() => {
            fetchAccountDetails();
        }, [fetchAccountDetails])
    );

    if (isLoading) {
        return <Loading />;
    }

    if (!account) {
        return <NotFoundItem text="Perfil no encontrado" />;
    }

    return (
        <SafeAreaView style={styles.screen}>
            <AccountPersonalInfo
                name={account.name}
                lastname={account.lastname}
                email={account.email}
                profilePicture={account.profilePicture}
                role={account.role}
            />
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
