import EvaluationDonutChart from "@/src/components/Evaluation/EvaluationDonutChart";
import Loading from "@/src/components/Loading";
import NotFoundItem from "@/src/components/NotFoundItem";
import HeaderSemesterDropdown from "@/src/components/Project/HeaderSemesterDropdown";
import RoundedOptionButton from "@/src/components/RoundedOptionButton";
import { getEvaluationDashboard } from "@/src/services/evaluationService";
import { EvaluationDashboard } from "@/src/types/evaluation.type";
import getPresentationSemesters from "@/src/utils/semesterUtils";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AdminHomeScreen() {
    const router = useRouter();
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
            <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
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

                    {!isDashboardLoading && dashboard &&
                        <View style={styles.options}>
                            <View style={styles.option}>
                                <RoundedOptionButton text="Archivos" icon="folder" onPress={() => router.push('/(app)/admin/files')} />
                            </View>
                            <View style={styles.option}>
                                <RoundedOptionButton text="Módulos" icon="cube" onPress={() => router.push('/(app)/admin/modules')} />
                            </View>
                            {/* <View style={styles.option}>
                                <RoundedOptionButton text="Evaluaciones" icon="star" onPress={() => router.push('/(app)/admin/evaluations')} />
                            </View> */}
                            <View style={styles.option}>
                                <RoundedOptionButton text="Calendario" icon="calendar" onPress={() => router.push('/(app)/admin/calendar')} />
                            </View>
                        </View>
                    }
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        alignItems: "center"
    },
    scroll: {
        width: "100%"
    },
    scrollContent: {
        alignItems: "center",
        paddingBottom: 16
    },
    container: {
        width: "96%",
        gap: 16
    },
    options: {
        width: "90%",
        margin: "auto",
        gap: 16
    },
    option: {
        height: 48
    },
});
