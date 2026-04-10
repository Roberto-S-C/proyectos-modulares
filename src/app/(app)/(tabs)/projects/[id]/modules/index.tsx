import Loading from "@/src/components/Loading";
import NotFoundItem from "@/src/components/NotFoundItem";
import ProjectModuleListItem from "@/src/components/ProjectModuleListItem";
import RoundedOptionButton from "@/src/components/RoundedOptionButton";
import Title from "@/src/components/Title";
import axios, { AxiosResponse } from 'axios';
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Image, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface ProjectImage {
    id: number,
    url: string
}

interface ProjectModule {
    id: number,
    name: string,
    status: string
}

interface Project {
    id: number,
    name: string,
    modules: ProjectModule[],
    images: ProjectImage[]
}

async function getProjectModules(id: number): Promise<Project> {
    const response: AxiosResponse<Project> = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/projects/${id}/modules`);
    return response.data;
}

export default function ProjectModulesScreen() {
    const { id } = useLocalSearchParams();
    const [isLoading, setIsLoading] = useState(true);
    const [project, setProject] = useState<Project | null>(null);


    useEffect(() => {
        getProjectModules(parseInt(id.toString())).then(projectModules => setProject(projectModules));
        setIsLoading(false);
    }, [])

    return (
        <SafeAreaView style={styles.screen}>
            {!isLoading && project &&
                <View style={styles.container}>
                    <Image source={{ uri: project?.images[0].url }} style={styles.image} />
                    <Title text={project?.name} />
                    <FlatList
                        data={project.modules}
                        renderItem={({ item }) => <ProjectModuleListItem {...item} />}
                        keyExtractor={item => item.id.toString()}
                        ListHeaderComponent={() => (
                            <View style={styles.squareOptionsContainer}>
                                <RoundedOptionButton text="Preevaluación" icon="star-half" />
                                <RoundedOptionButton text="Evaluación" icon="star" />
                            </View>
                        )}
                        contentContainerStyle={{ gap: 8 }}
                    />
                </View>
            }

            {isLoading && <Loading />}

            {!isLoading && !project && <NotFoundItem text="Módulos no encontrados" />}
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
    squareOptionsContainer: {
        flexDirection: 'row', 
        justifyContent: 'space-evenly'
    }
});