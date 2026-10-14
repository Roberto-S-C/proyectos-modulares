import { Pressable, StyleSheet, Text } from "react-native";
import Colors from "../constants/Colors";

interface Props {
    question: string,
    onPress: () => void,
}

export default function QuestionListItem({ question, onPress }: Props) {
    return (
        <Pressable onPress={onPress} style={styles.container}>
            {({ pressed }) =>
                // Underlined so it reads as a link to the question's screen
                <Text style={[styles.questionText, pressed && styles.questionTextPressed]}>{question}</Text>
            }
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        // Small side/vertical margins so the shadow isn't clipped by the list
        marginHorizontal: 4,
        marginVertical: 2,
        padding: 12,
        borderRadius: 12,
        backgroundColor: Colors.itemBackgroundColor,

        // iOS
        shadowColor: Colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 8,

        // Android
        elevation: 4,
    },
    questionText: {
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
        textDecorationLine: 'underline',
        color: Colors.link
    },
    questionTextPressed: {
        color: Colors.textSecondary
    }
});
