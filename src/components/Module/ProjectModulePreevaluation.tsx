import Colors from "@/src/constants/Colors";
import { Module, Preevaluation } from "@/src/types/module.type";
import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, Text, View } from "react-native";

interface Props {
    module: Module,
    preevaluation: Preevaluation,
}

export default function ProjectModulePreevaluation({ module, preevaluation }: Props) {
    const isPresent = preevaluation.status === "PRESENTE";

    return (
        <View style={[styles.container]}>
            <View style={styles.header}>
                <Text style={styles.moduleName} numberOfLines={2}>{module.name}</Text>
                <Text style={[styles.status, { color: isPresent ? Colors.success : Colors.error }]}>
                    {preevaluation.status}
                </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.row}>
                <Ionicons name="person-circle-outline" size={18} color={Colors.textSecondary} />
                <Text style={styles.evaluatorName} numberOfLines={1}>
                    {preevaluation.evaluator.name} {preevaluation.evaluator.lastname}
                </Text>
            </View>

            <View style={styles.row}>
                <Ionicons name="stats-chart-outline" size={18} color={Colors.textSecondary} />
                <Text style={styles.progressLabel}>Avance</Text>
                <Text style={styles.progressValue}>{preevaluation.progress}</Text>
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
    containerModifiable: {
        borderLeftWidth: 4,
        borderLeftColor: Colors.secondary,
    },
    header: {
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 8,
    },
    moduleName: {
        flex: 1,
        textAlign: "center",
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.primary,
    },
    status: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    divider: {
        height: 1,
        backgroundColor: Colors.border,
        opacity: 0.4,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    evaluatorName: {
        flex: 1,
        fontSize: 14,
        color: Colors.textSecondary,
    },
    progressLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.textPrimary,
    },
    progressValue: {
        flex: 1,
        textAlign: 'right',
        fontSize: 14,
        fontWeight: 'bold',
        color: Colors.primary,
    },
});
