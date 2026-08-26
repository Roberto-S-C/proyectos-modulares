import Colors from "@/src/constants/Colors";
import { FileReview } from "@/src/types/file.type";
import { StyleSheet, Text, View } from "react-native";

interface Props {
    review: FileReview
}

export default function FileReviewListItem({ review }: Props) {
    return (
        <View style={styles.container}>
            <Text style={styles.username}>{review.username}</Text>
            <Text>{review.review}</Text>
            <View style={styles.reviewStatusContainer}>
                <Text style={
                    [
                        review.status === "APROVADO" && {color: Colors.success},
                        review.status === "RECHAZADO" && {color: Colors.error},
                        styles.reviewStatus
                    ]
                }>
                    {review.status}
                </Text>
                <Text>
                    {
                        new Date(review.createdAt)
                            .toLocaleString("es-ES", {
                                month: "numeric",
                                day: "numeric",
                                year: "numeric",
                                hour: "numeric",
                                minute: "2-digit"
                            })
                    }
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: 8,
        padding: 8,
        borderWidth: 1,
        borderRadius: 10,
        borderColor: Colors.border,
    },
    username: {
        fontWeight: "bold",
        fontSize: 16,
        color: Colors.textPrimary
    },
    reviewStatus: {
        fontSize: 16,
        fontWeight: "bold"
    },
    reviewStatusContainer: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
});