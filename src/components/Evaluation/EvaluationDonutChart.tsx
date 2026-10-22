import Colors from "@/src/constants/Colors";
import { EvaluationDashboard } from "@/src/types/evaluation.type";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import { DonutChart } from "react-native-chart-kit/v2";
import NotFoundItem from "../NotFoundItem";

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
        { label: "Condicionados", value: dashboard.conditionedProjects, color: Colors.warning },
        { label: "No asistió", value: dashboard.notPresentProjects, color: Colors.missing },
        { label: "Completados", value: dashboard.completedProjects, color: Colors.primary },
        { label: "Atrasados", value: dashboard.lateProjects, color: Colors.late },
    ];

    // NotFoundItem fills its parent (flex: 1), so it gets the chart's height: inside the home
    // ScrollView it would otherwise have no height to fill
    if (dashboard.totalProjects === 0) {
        return (
            <View style={{ height: size }}>
                <NotFoundItem text="No hay proyectos registrados en este semestre" />
            </View>
        );
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
});
