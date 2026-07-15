import Loading from "@/src/components/Loading";
import { AuthContext } from "@/src/contexts/AuthContext";
import AdminHomeScreen from "@/src/screens/home/AdminHomeScreen";
import EvaluatorHomeScreen from "@/src/screens/home/EvaluatorHomeScreen";
import StudentHomeScreen from "@/src/screens/home/StudentHomeScreen";
import UserHomeScreen from "@/src/screens/home/UserHomeScreen";
import { useContext } from "react";

export default function HomeScreen() {

    const authContext = useContext(AuthContext);
    const role = authContext?.authState?.user?.role;

    if (role) {
        if (role === 'ADMIN') {
            return <AdminHomeScreen />
        }
        if (role === 'EVALUADOR') {
            return <EvaluatorHomeScreen />
        }
        if (role === 'ALUMNO') {
            return <StudentHomeScreen />
        }
        if (role === 'USUARIO') {
            return <UserHomeScreen />
        }
    }
    return <Loading />
}