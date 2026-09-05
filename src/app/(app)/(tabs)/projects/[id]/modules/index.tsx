import Loading from "@/src/components/Loading";
import ProjectModuleListItem from "@/src/components/Module/ProjectModuleListItem";
import NotFoundItem from "@/src/components/NotFoundItem";
import RoundedOptionButton from "@/src/components/RoundedOptionButton";
import Title from "@/src/components/Title";
import { getProjectModules } from "@/src/services/projectService";
import { ProjectModules } from "@/src/types/project.types";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Image, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProjectModulesScreen() {
    const { id } = useLocalSearchParams();
    const [isLoading, setIsLoading] = useState(true);
    const [project, setProject] = useState<ProjectModules | null>(null);

    useEffect(() => {
        const fetchProjectModules = async () => {
            try {
                const res = await getProjectModules(Number(id));
                if (res.status === 200) {
                    setProject(res.data);
                }
            }
            catch (e) {

            }
            finally {
                setIsLoading(false);
            }
        }
        fetchProjectModules()
    }, [])

    return (
        <SafeAreaView style={styles.screen}>
            {isLoading && <Loading />}

            {!isLoading && project &&
                <View style={styles.container}>
                    <Image source={{ uri: `${process.env.EXPO_PUBLIC_CDN_DOMAIN}/${project.coverImageUrl}` }} style={styles.image} />
                    <Title text={project?.name} />
                    <FlatList
                        data={project.modules}
                        renderItem={({ item }) => <ProjectModuleListItem {...item} />}
                        keyExtractor={item => item.id.toString()}
                        ListHeaderComponent={() => (
                            <View style={styles.optionsContainer}>
                                <RoundedOptionButton text="Preevaluación" icon="star-half" onPress={() => null} />
                                <RoundedOptionButton text="Evaluación" icon="star" onPress={() => null} />
                            </View>
                        )}
                        ListEmptyComponent={() => <NotFoundItem text="Módulos no disponibles" />}
                        contentContainerStyle={{ gap: 8 }}
                    />
                </View>
            }

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
    },
    container: {
        width: '100%',
        gap: 8,
        paddingHorizontal: 16,
        // backgroundColor: 'green'
    },
    image: {
        alignSelf: 'center',
        width: 300,
        height: 300,
    },
    optionsContainer: {
        width: '100%',
        flexDirection: 'column',
        gap: 8,
    }
});