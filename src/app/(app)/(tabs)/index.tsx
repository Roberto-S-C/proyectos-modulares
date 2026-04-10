import Loading from "@/src/components/Loading";
import { AuthContext } from "@/src/contexts/AuthContext";
import AdminHomeScreen from "@/src/screens/home/AdminHomeScreen";
import EvaluatorHomeScreen from "@/src/screens/home/EvaluatorHomeScreen";
import MemberHomeScreen from "@/src/screens/home/MemberHomeScreen";
import { useContext } from "react";

export default function HomeScreen() {

    const authContext = useContext(AuthContext);
    const roles = authContext?.authState?.user?.roles;

    if (roles && roles.length > 0) {
        switch (roles[0]) {
            case 'ROLE_ADMIN':
                return <AdminHomeScreen />
            case 'ROLE_ALUMNO':
                return <MemberHomeScreen />
            case 'ROLE_EVALUADOR':
                return <EvaluatorHomeScreen />
            case 'ROLE_USUARIO':
                return <MemberHomeScreen />
            default:
                return <Loading />
        }

    }
}