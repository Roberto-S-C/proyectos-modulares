import Colors from "@/src/constants/Colors";
import { PreevaluationScores, ProjectModuleStatus } from "@/src/types/module.type";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const SCORE_OPTIONS: PreevaluationScores[] = ["-50%", "60%", "70%", "80%", "90%", "100%"];

const SCORE_COLORS: Record<PreevaluationScores, string> = {
    "-50%": "#FF0000",
    "60%": "#FF8C00",
    "70%": "#c3c03f",
    "80%": "#3CB371",
    "90%": "#6B8E23",
    "100%": "#008000",
};

interface Props {
    moduleName: string,
    status?: ProjectModuleStatus,
    progress?: PreevaluationScores,
    onSelectProgress: (progress: PreevaluationScores) => void,
    onExpand: () => void,
    onMarkNotPresent: () => void,
}

export default function PreevaluationModuleItem({ moduleName, status, progress, onSelectProgress, onExpand, onMarkNotPresent }: Props) {
    const [isExpanded, setIsExpanded] = useState(false);

    const isApproved = status === "APROVADO";
    const isNotPresent = status === "NP";

    const toggleExpand = () => {
        setIsExpanded(prev => !prev);
        onExpand();
    }

    const markNotPresent = () => {
        setIsExpanded(false);
        onMarkNotPresent();
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.moduleName} numberOfLines={2}>{moduleName}</Text>

                <TouchableOpacity onPress={toggleExpand}>
                    <Ionicons
                        name="checkbox"
                        size={28}
                        color={isApproved ? Colors.success : Colors.unSelected}
                    />
                </TouchableOpacity>

                <TouchableOpacity onPress={markNotPresent}>
                    <Ionicons
                        name="close-circle"
                        size={28}
                        color={isNotPresent ? Colors.error : Colors.unSelected}
                    />
                </TouchableOpacity>
            </View>

            {isNotPresent &&
                <Text style={styles.absentText}>El equipo no presentó este módulo</Text>
            }

            {isExpanded &&
                <View style={styles.scoreSection}>
                    <Text style={styles.scoreLabel}>Avance</Text>
                    <View style={styles.scoreRow}>
                        {SCORE_OPTIONS.map(score => {
                            const isSelected = isApproved && progress === score;
                            return (
                                <TouchableOpacity
                                    key={score}
                                    style={[
                                        styles.scoreButton,
                                        { backgroundColor: isSelected ? Colors.primary : SCORE_COLORS[score] }
                                    ]}
                                    onPress={() => onSelectProgress(score)}
                                >
                                    <Text style={[styles.scoreButtonText, isSelected && styles.scoreButtonTextSelected]}>
                                        {score}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.itemBackgroundColor,
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: 10,
        padding: 12,
        gap: 8,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    moduleName: {
        flex: 1,
        fontSize: 16,
        fontWeight: "bold",
        color: Colors.primary,
    },
    absentText: {
        textAlign: "center",
        fontWeight: "bold",
        color: Colors.error,
    },
    scoreSection: {
        borderTopWidth: 1,
        borderTopColor: Colors.border,
        paddingTop: 8,
        gap: 8,
    },
    scoreLabel: {
        textAlign: "center",
        fontWeight: "bold",
        fontSize: 16,
        color: Colors.textSecondary,
    },
    scoreRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: 8,
    },
    scoreButton: {
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 8,
    },
    scoreButtonText: {
        fontWeight: "bold",
        color: "white",
    },
    scoreButtonTextSelected: {
        color: Colors.secondary,
    },
});
