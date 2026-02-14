import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, Text, View } from "react-native";
import Colors from "../constants/Colors";

interface Props {
    question: string
}

export default function QuestionListItem({ question }: Props) {
    return (
        <View style={styles.container}>
            <Text style={styles.questionText}>{question}</Text>
            <View style={styles.actionsContainer}>
                <Ionicons name="build" size={32} />
                <Ionicons name="trash" size={32} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        padding: 8,
        gap: 8,
        backgroundColor: Colors.itemBackgroundColor
    },
    questionText: {
        textAlign: 'center',
        width: '75%',
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.textSecondary
    },
    actionsContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 8
    }
});