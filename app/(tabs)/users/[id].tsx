import Loading from '@/src/components/Loading';
import AdminAccountDetailsScreen from '@/src/screens/AccountDetails/AdminAccountDetailsScreen';
import EvaluatorAccountDetailsScreen from '@/src/screens/AccountDetails/EvaluatorAccountDetailsScreen';
import MemberAccountDetailsScreen from '@/src/screens/AccountDetails/MemberAccountDetailsScreen';
import axios, { AxiosResponse } from 'axios';
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import UserAccountDetailsScreen from "../../../src/screens/AccountDetails/UserAccountDetailsScreen";

interface Account {
    id: string,
    name: string,
    lastname: string,
    email: string,
    profile_picture: string,
    role: string,
    project: any, // Student Project
    projects: any // Evaluators Projects
}

async function getAccountDetails(id: string): Promise<Account | null> {
    const response: AxiosResponse<Account> = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/accounts/${id}`);
    return response.data;
}

export default function AccountDetails() {
    const { id } = useLocalSearchParams();
    const [account, setAccount] = useState<Account | null>(null);

    useEffect(() => {
        getAccountDetails(id.toString()).then(account => setAccount(account));
    }, []);

    switch (account?.role) {
        case 'ROLE_USUARIO':
            return <UserAccountDetailsScreen {...account} />
        case 'ROLE_ALUMNO':
            return <MemberAccountDetailsScreen {...account} />
        case 'ROLE_EVALUADOR':
            return <EvaluatorAccountDetailsScreen {...account} />
        case 'ROLE_ADMIN':
            return <AdminAccountDetailsScreen {...account} />
        default:
            return (
                <Loading />
            );

    }

}