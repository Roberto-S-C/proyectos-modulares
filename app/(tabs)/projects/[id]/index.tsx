import Loading from "@/src/components/Loading";
import NotFoundItem from "@/src/components/NotFoundItem";
import ProjectOption from "@/src/components/ProjectOption";
import RoundedText from "@/src/components/RoundedText";
import Title from "@/src/components/Title";
import Colors from "@/src/constants/Colors";
import axios, { AxiosResponse } from 'axios';
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface ProjectImage {
    id: number,
    url: string
}

interface Project {
    name: string,
    status: string,
    presentation_date: string,
    images: ProjectImage[]
}

async function getProjectById(id: number): Promise<Project | null> {
    const response: AxiosResponse<Project> = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/projects/${id}`)
    return response?.data;
}

export default function ProjectOptionsScreen() {
    const { id } = useLocalSearchParams();
    const [project, setProject] = useState<Project | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        getProjectById(parseInt(id.toString())).then(project => {
            setProject(project)

            setIsLoading(false);
        });
    }, []);

    return (
        <SafeAreaView style={styles.screen}>
            {isLoading && <Loading />}
            {!isLoading && !project && <NotFoundItem text="Proyecto no encontrado" />}

            {
                project &&
                <ScrollView>
                    <View style={styles.container}>
                        <Image source={{ uri: project?.images[0].url }} style={styles.projectImage} />
                        <Title text={project.name} />
                        <View style={styles.projectInfoContainer}>
                            <RoundedText text={project.presentation_date} fontSize={20} bgColor={Colors.primary} textColor={Colors.secondary} />
                            <RoundedText text={project.status} fontSize={20} bgColor={Colors.primary} textColor={Colors.secondary} />
                        </View>

                        <View style={styles.projectOptionsContainer}>
                            <ProjectOption text="Descripción" iconName="information-circle" navigationUrl={`/(tabs)/projects/[id]/description`} navigationUrlProjectIdParam={parseInt(id.toString())} />
                            <ProjectOption text="Evaluación" iconName="star" navigationUrl="/(tabs)/projects/[id]/modules" navigationUrlProjectIdParam={parseInt(id.toString())} />
                            <ProjectOption text="Archivos" iconName="folder" navigationUrl="/(tabs)/projects/[id]/files" navigationUrlProjectIdParam={parseInt(id.toString())} />
                            <ProjectOption text="Miembros" iconName="people-circle" navigationUrl="/(tabs)/projects/[id]/members" navigationUrlProjectIdParam={parseInt(id.toString())} />
                            <ProjectOption text="Comentarios" iconName="chatbubble-ellipses" navigationUrl="/(tabs)/projects/[id]/comments" navigationUrlProjectIdParam={parseInt(id.toString())} />
                        </View>
                    </View>

                </ScrollView>
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
        gap: 16,
        paddingHorizontal: 16,
        paddingVertical: 16,
        alignItems: 'center',
    },
    projectInfoContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
    },
    projectImage: {
        width: 300,
        height: 300,
    },
    projectOptionsContainer: {
        width: '100%',
    }
});