import Loading from "@/src/components/Loading";
import { AuthContext } from "@/src/contexts/AuthContext";
import AdminNotificationsScreen from "@/src/screens/notifications/AdminNotificationsScreen";
import ReceivedNotificationsScreen from "@/src/screens/notifications/ReceivedNotificationsScreen";
import { useContext } from "react";

export default function NotificationsScreen() {

    const authContext = useContext(AuthContext);
    const role = authContext?.authState?.user?.role;

    if (role) {
        // ADMINs see what they (and the other ADMINs) sent; everyone else, what they received
        if (role === 'ADMIN') {
            return <AdminNotificationsScreen />
        }
        if (role === 'EVALUADOR' || role === 'ALUMNO' || role === 'USUARIO') {
            return <ReceivedNotificationsScreen />
        }
    }
    return <Loading />
}
