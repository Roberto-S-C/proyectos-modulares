import Colors from "@/src/constants/Colors";
import { EvaluationDashboard } from "@/src/types/evaluation.type";
import { StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { DonutChart } from "react-native-chart-kit/v2";

interface Props {
    dashboard: EvaluationDashboard
}

export default function EvaluationDonutChart({ dashboard }: Props) {
    const { width } = useWindowDimensions();
    const size = Math.min(width - 64, 320);

    const data = [
        { label: "Revisión", value: dashboard.revisionProjects, color: Colors.selected },
        { label: "Aprobados", value: dashboard.approvedProjects, color: Colors.success },
        { label: "Rechazados", value: dashboard.rejectedProjects, color: Colors.error },
    ];

    if (dashboard.totalProjects === 0) {
        return <Text style={styles.emptyText}>No hay proyectos registrados en este semestre</Text>;
    }

    return (
        <View style={styles.container}>
            <DonutChart
                data={data}
                valueKey="value"
                labelKey="label"
                colorKey="color"
                width={size}
                height={size}
                legend
                theme={{ background: 'transparent', plotBackground: 'transparent' }}
                centerLabel={`Proyectos: ${dashboard.totalProjects}`}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
    },
    emptyText: {
        textAlign: 'center',
        fontSize: 16,
        color: Colors.textSecondary,
    },
});
