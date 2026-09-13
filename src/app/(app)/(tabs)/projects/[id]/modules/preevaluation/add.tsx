import CustomAlert, { AlertProps } from "@/src/components/CustomAlert";
import Loading from "@/src/components/Loading";
import NotFoundItem from "@/src/components/NotFoundItem";
import PrimaryButton from "@/src/components/PrimaryButton";
import Colors from "@/src/constants/Colors";
import { addProjectModulePreevaluation, getProjectModules } from "@/src/services/projectService";
import { PreevaluationScores, PreevaluationStatus } from "@/src/types/module.type";
import { ProjectModules } from "@/src/types/project.types";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const STATUS_OPTIONS: PreevaluationStatus[] = ["AUSENTE", "PRESENTE"];
const SCORE_OPTIONS: PreevaluationScores[] = ["-50%", "60%", "70%", "80%", "90%", "100%"];

type Selection = {
    projectModuleId?: number,
    status?: PreevaluationStatus,
    progress?: PreevaluationScores,
}

export default function AddPreevaluation() {
    const [isLoading, setIsLoading] = useState(true);
    const [projectModules, setProjectModules] = useState<ProjectModules>();
    const [selections, setSelections] = useState<Record<number, Selection>>({});

    const [isAlertVisible, setIsAlertVisible] = useState(false);
    const [alertProps, setAlertProps] = useState<AlertProps>({
        message: '',
        onDismiss: () => setIsAlertVisible(false),
        isVisible: false,
        style: 'error'
    });

    const { id } = useLocalSearchParams();
    const router = useRouter();

    useEffect(() => {
        const fetchModules = async () => {
            try {
                const res = await getProjectModules(Number(id));
                if (res.status === 200 && res.data) setProjectModules(res.data);
            }
            catch (e) {

            }
            finally {
                setIsLoading(false);
            }
        }

        fetchModules();
    }, [])

    const showAlert = (message: string, style: AlertProps["style"]) => {
        setAlertProps({
            message,
            onDismiss: () => setIsAlertVisible(false),
            isVisible: true,
            style
        });
        setIsAlertVisible(true);
    }

    const setModuleStatus = (moduleId: number, status: PreevaluationStatus) => {
        setSelections(prev => ({ ...prev, [moduleId]: { ...prev[moduleId], projectModuleId: moduleId, status } }));
    }

    const setModuleScore = (moduleId: number, progress: PreevaluationScores) => {
        setSelections(prev => ({ ...prev, [moduleId]: { ...prev[moduleId], projectModuleId: moduleId, progress } }));
    }

    const onSubmit = async () => {
        if (!projectModules) return;

        const entries = projectModules.modules
            .map(module => selections[module.id])
            .filter((selection): selection is Required<Selection> =>
                !!selection?.projectModuleId && !!selection?.status && !!selection?.progress
            );

        if (entries.length !== projectModules.modules.length) {
            showAlert("Evalue todos los módulos", "error");
            return;
        }

        setIsLoading(true);
        try {
            await Promise.all(entries.map(selection =>
                addProjectModulePreevaluation(Number(id), selection)
            ));
            router.replace({ pathname: "/(app)/(tabs)/projects/[id]/modules", params: { id: Number(id) } });
        }
        catch (e) {
            showAlert("No se pudo registrar la evaluación", "error");
        }
        finally {
            setIsLoading(false);
        }
    }

    return (
        <SafeAreaView style={styles.screen}>
            {isLoading && <Loading />}

            {isAlertVisible && <CustomAlert {...alertProps} />}

            {!isLoading && !projectModules && <NotFoundItem text="Evaluación no disponible" />}

            {!isLoading && projectModules &&
                <View style={styles.container}>
                    <FlatList
                        style={styles.list}
                        data={projectModules.modules}
                        renderItem={({ item }) => {
                            const selection = selections[item.id] ?? {};

                            return (
                                <View style={styles.preevaluation}>
                                    <Text style={styles.moduleName} numberOfLines={2}>{item.name}</Text>

                                    <View style={styles.statusRow}>
                                        {STATUS_OPTIONS.map(status =>
                                            <TouchableOpacity
                                                key={status}
                                                style={[
                                                    styles.statusButton,
                                                    selection.status === status && styles.statusButtonSelected,
                                                    selection.status !== status && status === "AUSENTE" && { backgroundColor: Colors.error },
                                                    selection.status !== status && status === "PRESENTE" && { backgroundColor: Colors.success }
                                                ]}
                                                onPress={() => setModuleStatus(item.id, status)}
                                            >
                                                <Text style={[
                                                    styles.statusButtonText,
                                                    selection.status === status && styles.statusButtonTextSelected,
                                                ]}>
                                                    {status}
                                                </Text>
                                            </TouchableOpacity>
                                        )}
                                    </View>

                                    <Text style={{ textAlign: "center", marginTop: 12, fontWeight: "bold", fontSize: 16, color: Colors.textSecondary, }}>Avance</Text>

                                    <View style={styles.scoreRow}>
                                        {SCORE_OPTIONS.map(score =>
                                            <TouchableOpacity
                                                key={score}
                                                style={[
                                                    styles.scoreButton, selection.progress === score && styles.scoreButtonSelected,
                                                    selection.progress !== score && score === "-50%" && { backgroundColor: "#FF0000" },
                                                    selection.progress !== score && score === "60%" && { backgroundColor: "#FF8C00" },
                                                    selection.progress !== score && score === "70%" && { backgroundColor: "#c3c03f" },
                                                    selection.progress !== score && score === "80%" && { backgroundColor: "#3CB371" },
                                                    selection.progress !== score && score === "90%" && { backgroundColor: "#6B8E23" },
                                                    selection.progress !== score && score === "100%" && { backgroundColor: "#008000" }
                                                ]}
                                                onPress={() => setModuleScore(item.id, score)}
                                            >
                                                <Text style={[
                                                    styles.scoreButtonText,
                                                    selection.progress === score && styles.scoreButtonTextSelected
                                                ]}>
                                                    {score}
                                                </Text>
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                </View>
                            );
                        }}
                        keyExtractor={item => item.id.toString()}
                        ItemSeparatorComponent={() => <View style={{ minHeight: 16 }} />}
                    />

                    <View style={styles.submitButtonContainer}>
                        <PrimaryButton text="Enviar" onPress={onSubmit} />
                    </View>
                </View>
            }
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        width: "96%",
        alignSelf: "center",
    },
    container: {
        flex: 1,
        gap: 16,
    },
    list: {
        flex: 1,
    },
    submitButtonContainer: {
        alignItems: "center",
    },
    preevaluation: {
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
    moduleName: {
        fontSize: 16,
        fontWeight: "bold",
        color: Colors.primary,
        textAlign: "center",
    },
    statusRow: {
        flexDirection: "row",
        gap: 8,
    },
    statusButton: {
        flex: 1,
        paddingVertical: 8,
        borderRadius: 8,
        alignItems: "center",
    },
    statusButtonSelected: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },
    statusButtonText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "white",
    },
    statusButtonTextSelected: {
        color: Colors.secondary,
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
    scoreButtonSelected: {
        backgroundColor: Colors.primary,
    },
    scoreButtonText: {
        fontWeight: "bold",
        color: "white",
    },
    scoreButtonTextSelected: {
        color: Colors.secondary,
    },
});
