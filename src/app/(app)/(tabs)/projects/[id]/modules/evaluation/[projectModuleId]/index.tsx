import EvaluationListItem from "@/src/components/Module/EvaluationListItem";
import Loading from "@/src/components/Loading";
import NotFoundItem from "@/src/components/NotFoundItem";
import Title from "@/src/components/Title";
import { getProjectModuleEvaluations } from "@/src/services/projectService";
import { ProjectModuleEvaluations } from "@/src/types/module.type";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProjectModuleEvaluationScreen() {
    const [moduleEvaluations, setModuleEvaluations] = useState<ProjectModuleEvaluations>();
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const { id, projectModuleId } = useLocalSearchParams();

    useFocusEffect(
        useCallback(() => {
            setIsLoading(true);
            const fetchProjectModuleEvaluations = async () => {
                try {
                    const res = await getProjectModuleEvaluations(Number(id), Number(projectModuleId));
                    if (res.status === 200 && res.data) setModuleEvaluations(res.data);
                }
                catch (e) {

                }
                finally {
                    setIsLoading(false);
                }
            }
            fetchProjectModuleEvaluations();
        }, [])
    );

    return (
        <SafeAreaView style={styles.screen}>
            {isLoading && <Loading />}

            {!isLoading && !moduleEvaluations &&
                <NotFoundItem text="Módulo no disponible" />
            }

            {!isLoading && moduleEvaluations &&
                <View style={styles.container}>
                    <Title text={moduleEvaluations.moduleName} />
                    <FlatList
                        style={styles.list}
                        data={moduleEvaluations.evaluations}
                        renderItem={({ item }) => <EvaluationListItem evaluation={item} />}
                        keyExtractor={item => item.userId}
                        ItemSeparatorComponent={() => <View style={{ minHeight: 8 }} />}
                        ListEmptyComponent={() => <NotFoundItem text="Sin evaluaciones" />}
                    />
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
        gap: 16,
    },
    list: {
        flex: 1,
    }
});
