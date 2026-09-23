import Loading from '@/src/components/Loading';
import NotFoundItem from '@/src/components/NotFoundItem';
import AdminAccountDetailsScreen from '@/src/screens/AccountDetails/AdminAccountDetailsScreen';
import EvaluatorAccountDetailsScreen from '@/src/screens/AccountDetails/EvaluatorAccountDetailsScreen';
import MemberAccountDetailsScreen from '@/src/screens/AccountDetails/MemberAccountDetailsScreen';
import UserAccountDetailsScreen from '@/src/screens/AccountDetails/UserAccountDetailsScreen';
import { getAccountDetails } from '@/src/services/accountService';
import { AccountDetails, Role } from '@/src/types/account.type';
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";

export default function AccountDetailsScreen() {
    const { id } = useLocalSearchParams();
    const [account, setAccount] = useState<AccountDetails | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useFocusEffect(
        useCallback(() => {
            setIsLoading(true);
            setAccount(null);
            const fetchAccountDetails = async () => {
                try {
                    const res = await getAccountDetails(id.toString());
                    if (res.status === 200 && res.data) {
                        setAccount(res.data);
                    }
                }
                catch (e) { }
                finally {
                    setIsLoading(false);
                }
            }
            fetchAccountDetails();
        }, [id])
    );

    if (isLoading) {
        return <Loading />;
    }

    switch (account?.role) {
        case Role.Usuario:
            return <UserAccountDetailsScreen {...account} />
        case Role.Alumno:
            return <MemberAccountDetailsScreen {...account} />
        case Role.Evaluador:
            return <EvaluatorAccountDetailsScreen {...account} />
        case Role.Admin:
            return <AdminAccountDetailsScreen {...account} />
        default:
            return <NotFoundItem text="Cuenta no encontrada" />;
    }
}
