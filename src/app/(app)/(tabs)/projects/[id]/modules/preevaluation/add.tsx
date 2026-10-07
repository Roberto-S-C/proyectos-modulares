import CustomAlert, { AlertProps } from "@/src/components/CustomAlert";
import Loading from "@/src/components/Loading";
import PreevaluationModuleItem from "@/src/components/Module/PreevaluationModuleItem";
import NotFoundItem from "@/src/components/NotFoundItem";
import PrimaryButton from "@/src/components/PrimaryButton";
import Colors from "@/src/constants/Colors";
import { addProjectModulePreevaluations, getProjectModules, markProjectAbsentFromPreevaluation } from "@/src/services/projectService";
import { CreateModulePreevaluation, PreevaluationScores, ProjectModuleStatus } from "@/src/types/module.type";
import { ProjectModules } from "@/src/types/project.types";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Selection = {
    projectModuleId: number,
    moduleStatus?: ProjectModuleStatus,
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

    // All modules can be (re)preevaluated except NA ones, which aren't being presented this
    // semester.
    const preevaluableModules = (projectModules?.modules ?? []).filter(module => module.status !== "NA");

    const showAlert = (message: string, style: AlertProps["style"]) => {
        setAlertProps({
            message,
            onDismiss: () => setIsAlertVisible(false),
            isVisible: true,
            style
        });
        setIsAlertVisible(true);
    }

    const selectProgress = (moduleId: number, progress: PreevaluationScores) => {
        setSelections(prev => ({ ...prev, [moduleId]: { projectModuleId: moduleId, moduleStatus: "APROVADO", progress } }));
    }

    const markModuleNotPresent = (moduleId: number) => {
        setSelections(prev => ({ ...prev, [moduleId]: { projectModuleId: moduleId, moduleStatus: "NP", progress: undefined } }));
    }

    // Clears a module back to "undecided" when the user reconsiders a NP module via the
    // checkbox, so the close-circle icon turns grey again instead of staying stuck on NP.
    const clearIfNotPresent = (moduleId: number) => {
        setSelections(prev => {
            if (prev[moduleId]?.moduleStatus !== "NP") return prev;
            return { ...prev, [moduleId]: { projectModuleId: moduleId, moduleStatus: undefined, progress: undefined } };
        });
    }

    const goToComments = () => {
        router.replace({ pathname: "/(app)/(tabs)/projects/[id]/modules/comments/add", params: { id: Number(id) } });
    }

    const onSubmit = async () => {
        const entries = preevaluableModules
            .map(module => selections[module.id])
            .filter((selection): selection is Selection & { moduleStatus: ProjectModuleStatus } =>
                !!selection?.moduleStatus && (selection.moduleStatus === "NP" || !!selection.progress)
            );

        if (entries.length !== preevaluableModules.length) {
            showAlert("Evalue todos los módulos", "error");
            return;
        }

        const preevaluations: CreateModulePreevaluation[] = entries.map(selection => ({
            projectModuleId: selection.projectModuleId,
            status: selection.moduleStatus === "NP" ? "NP" : "PRESENTE",
            progress: selection.progress,
        }));

        setIsLoading(true);
        try {
            await addProjectModulePreevaluations(Number(id), preevaluations);
            goToComments();
        }
        catch (e) {
            showAlert("No se pudo registrar la preevaluación", "error");
        }
        finally {
            setIsLoading(false);
        }
    }

    const onMarkTeamAbsent = async () => {
        setIsLoading(true);
        try {
            await markProjectAbsentFromPreevaluation(Number(id));
            goToComments();
        }
        catch (e) {
            showAlert("No se pudo registrar la preevaluación", "error");
        }
        finally {
            setIsLoading(false);
        }
    }

    return (
        <SafeAreaView style={styles.screen}>
            {isLoading && <Loading />}

            {isAlertVisible && <CustomAlert {...alertProps} />}

            {!isLoading && preevaluableModules.length === 0 &&
                <NotFoundItem text="No hay módulos pendientes de preevaluación" />
            }

            {!isLoading && preevaluableModules.length > 0 &&
                <View style={styles.container}>
                    <PrimaryButton
                        text="Equipo no asistió"
                        onPress={onMarkTeamAbsent}
                        style={styles.absentButton}
                    />

                    <FlatList
                        style={styles.list}
                        data={preevaluableModules}
                        extraData={selections}
                        renderItem={({ item }) => (
                            <PreevaluationModuleItem
                                moduleName={item.name}
                                status={selections[item.id]?.moduleStatus}
                                progress={selections[item.id]?.progress}
                                onSelectProgress={score => selectProgress(item.id, score)}
                                onExpand={() => clearIfNotPresent(item.id)}
                                onMarkNotPresent={() => markModuleNotPresent(item.id)}
                            />
                        )}
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
    absentButton: {
        width: "100%",
        backgroundColor: Colors.error,
    },
    submitButtonContainer: {
        alignItems: "center",
    },
});
