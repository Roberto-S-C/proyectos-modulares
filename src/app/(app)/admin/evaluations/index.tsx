import CustomAlert, { AlertProps } from "@/src/components/CustomAlert";
import Loading from "@/src/components/Loading";
import NotFoundItem from "@/src/components/NotFoundItem";
import RoundedOptionButton from "@/src/components/RoundedOptionButton";
import SemesterPicker from "@/src/components/SemesterPicker";
import Colors from "@/src/constants/Colors";
import { getEvaluationDashboard, getEvaluationReport } from "@/src/services/evaluationService";
import getPresentationSemesters from "@/src/utils/semesterUtils";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as FileSystem from "expo-file-system/legacy";
import { useFocusEffect } from "expo-router";
import * as Sharing from 'expo-sharing';
import { useCallback, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const REPORT_COLUMNS = [
    "ID y nombre del proyecto",
    "Calificación de cada módulo o NA",
    "Calificación del proyecto",
    "Nombre, apellido, correo y calificación del evaluador",
];

export default function AdminEvaluationsScreen() {
    const semesters = getPresentationSemesters();
    const [selectedSemester, setSelectedSemester] = useState<string | null>(semesters[0]);
    const [totalProjects, setTotalProjects] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isDownloading, setIsDownloading] = useState(false);

    const [isAlertVisible, setIsAlertVisible] = useState(false);
    const [alertProps, setAlertProps] = useState<AlertProps>({
        message: "",
        isVisible: false,
        onDismiss: () => setIsAlertVisible(false),
        style: "error"
    });

    const showError = (message: string) => {
        setAlertProps({
            message,
            onDismiss: () => setIsAlertVisible(false),
            isVisible: true,
            style: "error"
        });
        setIsAlertVisible(true);
    }

    // The dashboard already counts the semester's projects, so it tells us if there's anything to export
    useFocusEffect(
        useCallback(() => {
            if (!selectedSemester) return;
            const fetchTotalProjects = async () => {
                setIsLoading(true);
                setTotalProjects(null);
                try {
                    const res = await getEvaluationDashboard(selectedSemester);
                    if (res.status === 200 && res.data) setTotalProjects(res.data.totalProjects);
                }
                catch (e) {
                    setTotalProjects(null);
                }
                finally {
                    setIsLoading(false);
                }
            }
            fetchTotalProjects()
        }, [selectedSemester])
    );

    const downloadReport = async () => {
        if (!selectedSemester || isDownloading) return;
        setIsDownloading(true);
        try {
            const res = await getEvaluationReport(selectedSemester);
            if (res.status !== 200 || typeof res.data !== 'string') {
                showError("No se pudo generar el reporte");
                return;
            }

            const fileUri = `${FileSystem.cacheDirectory}evaluaciones_${selectedSemester}.csv`;
            await FileSystem.writeAsStringAsync(fileUri, res.data);

            if (!(await Sharing.isAvailableAsync())) {
                showError("No se pueden compartir archivos en este dispositivo");
                return;
            }
            await Sharing.shareAsync(fileUri, {
                mimeType: 'text/csv',
                UTI: 'public.comma-separated-values-text',
                dialogTitle: 'Reporte de evaluaciones'
            });
        }
        catch (e) {
            console.log(e);
            showError("No se pudo descargar el reporte");
        }
        finally {
            setIsDownloading(false);
        }
    }

    const semesterPicker = (
        <View style={styles.semesterPickerContainer}>
            <SemesterPicker
                value={selectedSemester}
                onChange={setSelectedSemester}
                semesters={semesters}
            />
        </View>
    );

    return (
        <SafeAreaView style={styles.screen}>
            {isAlertVisible && <CustomAlert {...alertProps} />}

            <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>

                {isLoading && <Loading />}

                {/* The picker stays here too, so a semester without projects isn't a dead end */}
                {!isLoading && !totalProjects &&
                    <View style={styles.emptyContainer}>
                        <NotFoundItem text={totalProjects === 0 ? "No hay proyectos registrados en este semestre" : "No se pudo cargar el semestre"} />
                        {semesterPicker}
                    </View>
                }

                {!isLoading && !!totalProjects &&
                    <View style={styles.container}>
                        <Ionicons name="document-text" size={120} color={Colors.secondary} />
                        <Text style={styles.summary}>
                            {totalProjects} {totalProjects === 1 ? "proyecto" : "proyectos"} en {selectedSemester}
                        </Text>

                        {semesterPicker}

                        <View style={styles.card}>
                            <Text style={styles.cardTitle}>El archivo CSV incluye</Text>
                            {REPORT_COLUMNS.map(column =>
                                <View key={column} style={styles.cardRow}>
                                    <Ionicons name="checkmark-circle" size={20} color={Colors.secondary} />
                                    <Text style={styles.cardText}>{column}</Text>
                                </View>
                            )}
                        </View>

                        <RoundedOptionButton
                            text={isDownloading ? "Generando..." : "Descargar Reporte"}
                            icon="cloud-download"
                            onPress={downloadReport}
                            disabled={isDownloading}
                        />
                    </View>
                }
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
    },
    scroll: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        width: '90%',
        alignSelf: 'center',
        paddingBottom: 24,
    },
    semesterPickerContainer: {
        alignSelf: 'center',
        width: 160,
    },
    emptyContainer: {
        // flex: 1,
        gap: 32,
        paddingTop: 16,
    },
    container: {
        alignItems: 'center',
        gap: 16,
    },
    summary: {
        fontSize: 22,
        fontWeight: 'bold',
        color: Colors.primary,
        textAlign: 'center',
    },
    card: {
        alignSelf: 'stretch',
        gap: 8,
        padding: 16,
        backgroundColor: '#fff',
        borderRadius: 12,
        // Shadow for iOS
        shadowColor: Colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        // Elevation for Android
        elevation: 3,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.primary,
    },
    cardRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    cardText: {
        flex: 1,
        fontSize: 16,
        color: Colors.primary,
    },
    cardNote: {
        fontSize: 14,
        fontStyle: 'italic',
        color: Colors.secondary,
    },
});
