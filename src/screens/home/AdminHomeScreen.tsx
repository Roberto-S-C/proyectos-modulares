import EvaluationDonutChart from "@/src/components/Evaluation/EvaluationDonutChart";
import Loading from "@/src/components/Loading";
import NotFoundItem from "@/src/components/NotFoundItem";
import HeaderSemesterDropdown from "@/src/components/Project/HeaderSemesterDropdown";
import { getEvaluationDashboard } from "@/src/services/evaluationService";
import { EvaluationDashboard } from "@/src/types/evaluation.type";
import getPresentationSemesters from "@/src/utils/semesterUtils";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AdminHomeScreen() {
    const semesters = getPresentationSemesters();
    const [selectedSemester, setSelectedSemester] = useState<string | null>(semesters[0]);
    const [dashboard, setDashboard] = useState<EvaluationDashboard | null>(null);
    const [isDashboardLoading, setIsDashboardLoading] = useState(true);

    useFocusEffect(
        useCallback(() => {
            if (!selectedSemester) return;
            const fetchDashboard = async () => {
                setIsDashboardLoading(true);
                setDashboard(null);
                try {
                    const res = await getEvaluationDashboard(selectedSemester);
                    if (res.status === 200 && res.data) {
                        setDashboard(res.data);
                    }
                }
                catch (e) {
                    setDashboard(null)
                }
                finally {
                    setIsDashboardLoading(false)
                }
            }
            fetchDashboard()
        }, [selectedSemester])
    );

    return (
        <SafeAreaView style={styles.screen}>
            <View style={styles.container}>

                <HeaderSemesterDropdown
                    text='Administrador'
                    selectedSemester={selectedSemester}
                    setSelectedSemester={setSelectedSemester}
                    semesters={semesters}
                />

                {isDashboardLoading && <Loading />}
                {!isDashboardLoading && dashboard && <EvaluationDonutChart dashboard={dashboard} />}
                {!isDashboardLoading && !dashboard && <NotFoundItem text="No se pudo cargar el dashboard" />}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        alignItems: "center"
    },
    container: {
        width: "96%",
        gap: 16
    },
});
