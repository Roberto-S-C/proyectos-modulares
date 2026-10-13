import CustomAlert, { AlertProps } from "@/src/components/CustomAlert";
import Loading from "@/src/components/Loading";
import ProjectModuleScoreListItem from "@/src/components/Module/ProjectModuleScoreListItem";
import NotFoundItem from "@/src/components/NotFoundItem";
import RoundedOptionButton from "@/src/components/RoundedOptionButton";
import RoundedText from "@/src/components/RoundedText";
import Title from "@/src/components/Title";
import { AuthContext } from "@/src/contexts/AuthContext";
import { getProject, getProjectEvaluations } from "@/src/services/projectService";
import { Role } from "@/src/types/account.type";
import { ProjectEvaluations } from "@/src/types/module.type";
import { ProjectStatus } from "@/src/types/project.types";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useContext, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Only APROVADO and COMPLETADO projects can be evaluated
const NOT_EVALUABLE_STATUSES: ProjectStatus[] = ["RECHAZADO", "CONDICIONADO", "ATRASADO", "NP", "REVISION"];

export default function ProjectEvaluationScreen() {
    const [projectEvaluations, setProjectEvaluations] = useState<ProjectEvaluations>();
    const [projectStatus, setProjectStatus] = useState<ProjectStatus | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const [isAlertVisible, setIsAlertVisible] = useState(false);
    const [alertProps, setAlertProps] = useState<AlertProps>({
        message: '',
        onDismiss: () => setIsAlertVisible(false),
        isVisible: false,
        style: 'error'
    });

    const { id } = useLocalSearchParams();
    const router = useRouter();
    const authContext = useContext(AuthContext);

    const userId = authContext.authState?.user.id;
    const userRole = authContext.authState?.user.role;
    const canAddEvaluation = userId != null && (userRole === Role.Admin || userRole === Role.Evaluador || !!projectEvaluations?.evaluatorIds.includes(userId));

    useFocusEffect(
        useCallback(() => {
            setIsLoading(true);
            const fetchProjectEvaluations = async () => {
                try {
                    const [evaluationsRes, projectRes] = await Promise.all([
                        getProjectEvaluations(Number(id)),
                        getProject(Number(id)),
                    ]);
                    if (evaluationsRes.status === 200 && evaluationsRes.data) {
                        setProjectEvaluations(evaluationsRes.data);
                    }
                    if (projectRes.status === 200 && projectRes.data) {
                        setProjectStatus(projectRes.data.status);
                    }
                }
                catch (e) {
                    console.log(e)
                }
                finally {
                    setIsLoading(false);
                }
            }
            fetchProjectEvaluations();
        }, [id])
    );

    const onAddEvaluation = () => {
        if (!projectStatus || NOT_EVALUABLE_STATUSES.includes(projectStatus)) {
            setAlertProps({
                message: "El proyecto no está listo para la evaluación",
                onDismiss: () => setIsAlertVisible(false),
                isVisible: true,
                style: "error"
            });
            setIsAlertVisible(true);
            return;
        }
        router.push({ pathname: "/(app)/(tabs)/projects/[id]/modules/evaluation/add", params: { id: Number(id) } });
    }

    return (
        <SafeAreaView style={styles.screen}>
            {isLoading && <Loading />}

            {isAlertVisible && <CustomAlert {...alertProps} />}

            {!isLoading && (!projectEvaluations || projectEvaluations.moduleScores.length === 0) &&
                <NotFoundItem text="Módulos no disponibles" />
            }

            {!isLoading && projectEvaluations && projectEvaluations.moduleScores.length > 0 &&
                <View style={styles.container}>
                    <Title text={projectEvaluations.projectName} />
                    <View style={{width: '50%', margin: "auto"}}>
                        <RoundedText text={projectEvaluations.score !== null ? `Puntuación: ${projectEvaluations.score}` : null} fontSize={20} />
                    </View>

                    <FlatList
                        style={styles.list}
                        data={projectEvaluations.moduleScores}
                        renderItem={({ item }) =>
                            <ProjectModuleScoreListItem
                                moduleScore={item}
                                onPress={() => router.push({
                                    pathname: "/(app)/(tabs)/projects/[id]/modules/evaluation/[projectModuleId]",
                                    params: { id: Number(id), projectModuleId: item.projectModuleId }
                                })}
                            />
                        }
                        keyExtractor={item => item.projectModuleId.toString()}
                        ItemSeparatorComponent={() => <View style={{ minHeight: 8 }} />}
                    />

                    {canAddEvaluation &&
                        <View style={styles.addButtonContainer}>
                            <RoundedOptionButton icon="add" text="Agregar" onPress={onAddEvaluation} />
                        </View>
                    }
                </View>
            }
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        width: "96%",
        margin: "auto",
    },
    container: {
        flex: 1,
        gap: 20,
    },
    addButtonContainer: {
        width: 200,
        height: 60,
        alignSelf: "center",
    },
    list: {
        flex: 1,
    }
});
