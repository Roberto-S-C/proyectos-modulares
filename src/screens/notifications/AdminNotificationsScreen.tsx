import Loading from "@/src/components/Loading";
import NotFoundItem from "@/src/components/NotFoundItem";
import NotificationListItem from "@/src/components/Notification/NotificationListItem";
import RoundedOptionButton from "@/src/components/RoundedOptionButton";
import Title from "@/src/components/Title";
import { getSentNotifications } from "@/src/services/notificationService";
import { SentNotification } from "@/src/types/notification.type";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Every notification sent by any ADMIN, and the button to send a new one
export default function AdminNotificationsScreen() {
    const [notifications, setNotifications] = useState<SentNotification[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const router = useRouter();

    // Refetched on focus, so a notification sent from add.tsx shows up on return
    useFocusEffect(
        useCallback(() => {
            setIsLoading(true);
            const fetchNotifications = async () => {
                try {
                    const res = await getSentNotifications();
                    if (res.status === 200 && res.data) setNotifications(res.data);
                }
                catch (e) {
                    setNotifications([]);
                }
                finally {
                    setIsLoading(false);
                }
            }
            fetchNotifications();
        }, [])
    );

    return (
        <SafeAreaView style={styles.screen}>
            <Title text="Notificaciones" />

            {isLoading && <Loading />}

            {!isLoading && notifications.length === 0 &&
                <NotFoundItem text="No se han enviado notificaciones" />
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

            {!isLoading &&
                <View style={styles.addButtonContainer}>
                    <RoundedOptionButton icon="add" text="Agregar" onPress={() => router.push("/(app)/(tabs)/notifications/add")} />
                </View>
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
    addButtonContainer: {
        width: 200,
        height: 60,
        alignSelf: "center",
        marginBottom: 12,
    },
});
