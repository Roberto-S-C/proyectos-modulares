import Colors from "@/src/constants/Colors";
import { PreevaluationComment } from "@/src/types/module.type";
import { StyleSheet, Text, View } from "react-native";

interface Props {
    comment: PreevaluationComment
}

export default function PreevaluationCommentListItem({ comment }: Props) {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.username}>{comment.username}</Text>
                <Text style={styles.semester}>{comment.presentationSemester}</Text>
            </View>
            <Text style={styles.comment}>{comment.comment}</Text>
            <Text style={styles.date}>
                {new Date(comment.createdAt).toLocaleString("es-ES", {
                    month: "numeric",
                    day: "numeric",
                    year: "numeric",
                    hour: "numeric",
                    minute: "2-digit"
                })}
            </Text>
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
        justifyContent: "space-between",
        gap: 8,
    },
    username: {
        flex: 1,
        fontWeight: "bold",
        fontSize: 16,
        color: Colors.textPrimary,
    },
    semester: {
        fontWeight: "bold",
        color: Colors.textSecondary,
    },
    comment: {
        color: Colors.textPrimary,
    },
    date: {
        textAlign: "right",
        fontSize: 12,
        color: Colors.textSecondary,
    },
});
