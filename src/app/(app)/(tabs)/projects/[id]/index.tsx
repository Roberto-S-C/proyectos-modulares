import Loading from "@/src/components/Loading";
import NotFoundItem from "@/src/components/NotFoundItem";
import ProjectOption from "@/src/components/Project/ProjectOption";
import RoundedText from "@/src/components/RoundedText";
import Title from "@/src/components/Title";
import Colors from "@/src/constants/Colors";
import { getProject } from "@/src/services/projectService";
import { Project } from "@/src/types/project.types";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProjectOptionsScreen() {
    const { id } = useLocalSearchParams();
    const [project, setProject] = useState<Project | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        const fetchProject = async () => {
            try {
                const res = await getProject(Number(id));
                if (res.status === 200 && res.data) setProject(res.data);
            }
            catch (e) {

            }
            finally {
                setIsLoading(false);
            }
        }
        fetchProject();
    }, []);

    return (
        <SafeAreaView style={styles.screen}>
            {isLoading && <Loading />}

            {!isLoading && !project && <NotFoundItem text="Proyecto no encontrado" />}

            {
                project &&
                <ScrollView>
                    <View style={styles.container}>
                        <Image source={{ uri: `${process.env.EXPO_PUBLIC_CDN_DOMAIN}/${project.coverImageUrl}` }} style={styles.projectImage} />
                        <Title text={project.name} />
                        <View style={styles.projectInfoContainer}>
                            <RoundedText text={project.presentationDate} fontSize={20} bgColor={Colors.primary} textColor={Colors.secondary} />
                            <RoundedText text={project.status} fontSize={20} bgColor={Colors.primary} textColor={Colors.secondary} />
                        </View>

                        <View style={styles.projectOptionsContainer}>
                            <ProjectOption text="Descripción" iconName="information-circle" navigationUrl={`/(tabs)/projects/[id]/description`} navigationUrlProjectIdParam={parseInt(id.toString())} />
                            <ProjectOption text="Evaluación" iconName="star" navigationUrl="/(app)/(tabs)/projects/[id]/modules" navigationUrlProjectIdParam={parseInt(id.toString())} />
                            <ProjectOption text="Archivos" iconName="folder" navigationUrl="/(app)/(tabs)/projects/[id]/files" navigationUrlProjectIdParam={parseInt(id.toString())} />
                            <ProjectOption text="Miembros" iconName="people-circle" navigationUrl="/(app)/(tabs)/projects/[id]/members" navigationUrlProjectIdParam={parseInt(id.toString())} />
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