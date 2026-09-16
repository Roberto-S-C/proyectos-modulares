import Colors from "@/src/constants/Colors";
import { Evaluation } from "@/src/types/module.type";
import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, Text, View } from "react-native";

interface Props {
    evaluation: Evaluation,
}

export default function EvaluationListItem({ evaluation }: Props) {
    return (
        <View style={styles.container}>
            <View style={styles.row}>
                <Ionicons name="person-circle-outline" size={18} color={Colors.textSecondary} />
                <Text style={styles.evaluatorName} numberOfLines={1}>{evaluation.userName}</Text>
            </View>

            <Text style={styles.score}>{evaluation.score}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 10,
        padding: 12,
        borderWidth: 1,
        borderRadius: 10,
        borderColor: Colors.border,
        backgroundColor: Colors.itemBackgroundColor,

        // iOS
        shadowColor: Colors.shadow,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.15,
        shadowRadius: 4,

        // Android
        elevation: 2,
    },
    row: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    evaluatorName: {
        flex: 1,
        fontSize: 14,
        color: Colors.textSecondary,
    },
    score: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.primary,
    },
});
