import Loading from "@/src/components/Loading";
import AdminHomeScreen from "@/src/screens/home/AdminHomeScreen";
import EvaluatorHomeScreen from "@/src/screens/home/EvaluatorHomeScreen";
import MemberHomeScreen from "@/src/screens/home/MemberHomeScreen";
import { useEffect, useState } from "react";
import { useAuth } from "../../src/contexts/AuthContext";

export default function HomeScreen() {
    const { user } = useAuth();
    const [userRole, setUserRole] = useState('');

    useEffect(() => {
        setUserRole(user?.["cognito:groups"][0]);
        console.log(userRole);
    }, [user])

    console.log("User Role: ", userRole)

    switch (userRole) {
        case 'ROLE_ADMIN':
            return <AdminHomeScreen />
        case 'ROLE_ALUMNO':
            return <MemberHomeScreen/>
        case 'ROLE_EVALUADOR':
            return <EvaluatorHomeScreen />
        case 'ROLE_USUARIO':
            return <MemberHomeScreen/>
        default:
            return <Loading /> 
    }
}