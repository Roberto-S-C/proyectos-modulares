import Loading from "@/src/components/Loading";
import NotFoundItem from "@/src/components/NotFoundItem";
import NotificationListItem from "@/src/components/Notification/NotificationListItem";
import Title from "@/src/components/Title";
import { getReceivedNotifications } from "@/src/services/notificationService";
import { ReceivedNotification } from "@/src/types/notification.type";
import * as Notifications from "expo-notifications";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { FlatList, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// The notifications the signed-in EVALUADOR, ALUMNO or USUARIO has received (read-only)
export default function ReceivedNotificationsScreen() {
    const [notifications, setNotifications] = useState<ReceivedNotification[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchNotifications = useCallback(async () => {
        try {
            const res = await getReceivedNotifications();
            if (res.status === 200 && res.data) setNotifications(res.data);
        }
        catch (e) {
            setNotifications([]);
        }
        finally {
            setIsLoading(false);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            setIsLoading(true);
            fetchNotifications();

            // A push arriving while the screen is open is added to the list right away
            const subscription = Notifications.addNotificationReceivedListener(() => fetchNotifications());
            return () => subscription.remove();
        }, [fetchNotifications])
    );

    return (
        <SafeAreaView style={styles.screen}>
            <Title text="Notificaciones" />

            {isLoading && <Loading />}

            {!isLoading && notifications.length === 0 &&
                <NotFoundItem text="No tienes notificaciones" />
            }

            {!isLoading && notifications.length > 0 &&
                <FlatList
                    style={styles.list}
                    data={notifications}
                    renderItem={({ item }) => <NotificationListItem {...item} />}
                    keyExtractor={item => item.id.toString()}
                    contentContainerStyle={styles.listContent}
                />
            }
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        width: "96%",
        marginHorizontal: "auto",
        gap: 8,
    },
    list: {
        flex: 1,
    },
    listContent: {
        gap: 8,
        paddingBottom: 8,
    },
});
