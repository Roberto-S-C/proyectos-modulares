import Accordion from "@/src/components/Accordion";
import Loading from "@/src/components/Loading";
import ProjectModulePreevaluation from "@/src/components/Module/ProjectModulePreevaluation";
import NotFoundItem from "@/src/components/NotFoundItem";
import RoundedOptionButton from "@/src/components/RoundedOptionButton";
import { getProjectModulesPreevaluations } from "@/src/services/projectService";
import { ProjectModulePreevaluations } from "@/src/types/module.type";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProjectPreevaluationScreen() {
    const [projectModulePreevaluations, setProjectModulePreevaluations] = useState<ProjectModulePreevaluations[]>();

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const { id } = useLocalSearchParams();

    useEffect(() => {
        const fetchProjectModulesPreevaluations = async () => {
            try {
                const res = await getProjectModulesPreevaluations(Number(id));
                if (res.status === 200 && res.data) setProjectModulePreevaluations(res.data);
                console.log(res.data[1])
            }
            catch (e) {

            }
            finally {
                setIsLoading(false);
            }

        }
        fetchProjectModulesPreevaluations()
    }, [])

    return (
        <SafeAreaView style={styles.screen}>
            {isLoading && <Loading />}

            {!isLoading && !projectModulePreevaluations &&
                <NotFoundItem text="Módulos no disponibles" />
            }

            {projectModulePreevaluations &&
                <View style={styles.container}>
                    <View style={styles.addButtonContainer}>
                        <RoundedOptionButton icon="add" text="Agregar" onPress={() => null} />
                    </View>
                    <FlatList
                        style={styles.list}
                        data={projectModulePreevaluations}
                        renderItem={({ item }) =>
                            <Accordion
                                title={item.module.name}
                                content={
                                    item.preevaluations.length > 0
                                        ? <View style={{ gap: 8 }}>
                                            {item.preevaluations.map(preevaluation =>
                                                <ProjectModulePreevaluation
                                                    key={preevaluation.id}
                                                    module={item.module}
                                                    preevaluation={preevaluation}
                                                />
                                            )}
                                        </View>
                                        : <NotFoundItem text="Sin preevaluaciones" />
                                }
                            />
                        }
                        keyExtractor={item => item.module.id.toString()}
                        ItemSeparatorComponent={() => <View style={{ minHeight: 16 }} />}
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
    addButtonContainer: {
        width: 200,
        height: 60,
        alignSelf: "center",
    },
    list: {
        flex: 1,
    }
});