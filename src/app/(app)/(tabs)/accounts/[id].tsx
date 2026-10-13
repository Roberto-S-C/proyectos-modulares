import CustomAlert, { AlertProps } from '@/src/components/CustomAlert';
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

    const [isAlertVisible, setIsAlertVisible] = useState(false);
    const [alertProps, setAlertProps] = useState<AlertProps>({
        message: '',
        onDismiss: () => setIsAlertVisible(false),
        isVisible: false,
        style: 'success'
    });

    const fetchAccountDetails = useCallback(async () => {
        setIsLoading(true);
        setAccount(null);
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
    }, [id]);

    useFocusEffect(
        useCallback(() => {
            fetchAccountDetails();
        }, [fetchAccountDetails])
    );

    // Reloaded because the new role changes which details screen is shown. The alert lives
    // here since the screen that triggered the change is replaced.
    const handleRoleUpdated = async () => {
        await fetchAccountDetails();
        setAlertProps({
            message: "Rol actualizado",
            onDismiss: () => setIsAlertVisible(false),
            isVisible: true,
            style: 'success'
        });
        setIsAlertVisible(true);
    }

    const renderAccountDetails = () => {
        if (isLoading) {
            return <Loading />;
        }

        switch (account?.role) {
            case Role.Usuario:
                return <UserAccountDetailsScreen {...account} onRoleUpdated={handleRoleUpdated} />
            case Role.Alumno:
                return <MemberAccountDetailsScreen {...account} />
            case Role.Evaluador:
                return <EvaluatorAccountDetailsScreen {...account} onRoleUpdated={handleRoleUpdated} />
            case Role.Admin:
                return <AdminAccountDetailsScreen {...account} />
            default:
                return <NotFoundItem text="Cuenta no encontrada" />;
        }
    }

    return (
        <>
            {renderAccountDetails()}
            {isAlertVisible && <CustomAlert {...alertProps} />}
        </>
    );
}
