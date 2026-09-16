import Colors from "@/src/constants/Colors";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Props {
    question: string,
    score?: number,
    onSelect: (score: number) => void,
}

const SCORES = [1, 2, 3, 4, 5];

export default function ModuleQuestionListItem({ question, score, onSelect }: Props) {
    return (
        <View style={styles.container}>
            <Text style={styles.questionText}>{question}</Text>
            <View style={styles.scoreRow}>
                {SCORES.map(value =>
                    <TouchableOpacity
                        key={value}
                        style={[styles.scoreButton, score === value && styles.scoreButtonSelected]}
                        onPress={() => onSelect(value)}
                    >
                        <Text style={[styles.scoreButtonText, score === value && styles.scoreButtonTextSelected]}>
                            {value}
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
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
    questionText: {
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.secondary,
    },
    scoreRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
    },
    scoreButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        backgroundColor: Colors.unSelected,
    },
    scoreButtonSelected: {
        backgroundColor: Colors.primary,
    },
    scoreButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
    },
    scoreButtonTextSelected: {
        color: Colors.secondary,
    },
});
