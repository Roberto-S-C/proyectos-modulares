import Loading from "@/src/components/Loading";
import ProjectModuleScoreListItem from "@/src/components/Module/ProjectModuleScoreListItem";
import NotFoundItem from "@/src/components/NotFoundItem";
import RoundedOptionButton from "@/src/components/RoundedOptionButton";
import RoundedText from "@/src/components/RoundedText";
import Title from "@/src/components/Title";
import { AuthContext } from "@/src/contexts/AuthContext";
import { getProjectEvaluations } from "@/src/services/projectService";
import { ProjectEvaluations } from "@/src/types/module.type";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useContext, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProjectEvaluationScreen() {
    const [projectEvaluations, setProjectEvaluations] = useState<ProjectEvaluations>();
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const { id } = useLocalSearchParams();
    const router = useRouter();
    const authContext = useContext(AuthContext);

    const userId = authContext.authState?.user.id;
    const canAddEvaluation = userId != null && !!projectEvaluations?.evaluatorIds.includes(userId);

    useFocusEffect(
        useCallback(() => {
            setIsLoading(true);
            const fetchProjectEvaluations = async () => {
                try {
                    const res = await getProjectEvaluations(Number(id));
                    if (res.status === 200 && res.data) {
                        setProjectEvaluations(res.data);
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

    return (
        <SafeAreaView style={styles.screen}>
            {isLoading && <Loading />}

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
                            <RoundedOptionButton icon="add" text="Agregar" onPress={() => router.push({ pathname: "/(app)/(tabs)/projects/[id]/modules/evaluation/add", params: { id: Number(id) } })} />
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
