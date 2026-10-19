import Colors from "@/src/constants/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, Text, View } from "react-native";

interface Props {
    title: string,
    content: string,
    createdAt: string,
    senderName: string,
    // Only for sent notifications (ADMIN)
    receiversCount?: number
}

export default function NotificationListItem({ title, content, createdAt, senderName, receiversCount }: Props) {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Ionicons name="notifications" size={24} color={Colors.secondary} />
                <Text style={styles.title}>{title}</Text>
            </View>
            <Text style={styles.content}>{content}</Text>
            <View style={styles.footer}>
                <Text style={styles.info}>
                    {senderName}
                    {receiversCount !== undefined && ` · ${receiversCount} ${receiversCount === 1 ? "destinatario" : "destinatarios"}`}
                </Text>
                <Text style={styles.info}>
                    {new Date(createdAt).toLocaleString("es-ES", {
                        month: "numeric",
                        day: "numeric",
                        year: "numeric",
                        hour: "numeric",
                        minute: "2-digit"
                    })}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: 8,
        padding: 12,
        borderWidth: 1,
        borderRadius: 10,
        borderColor: Colors.border,
        backgroundColor: Colors.itemBackgroundColor,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    title: {
        flex: 1,
        fontWeight: "bold",
        fontSize: 16,
        color: Colors.primary,
    },
    content: {
        color: Colors.textPrimary,
    },
    footer: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 8,
    },
    info: {
        flexShrink: 1,
        fontSize: 12,
        color: Colors.textSecondary,
    },
});
