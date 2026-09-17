import Loading from "@/src/components/Loading";
import NotFoundItem from "@/src/components/NotFoundItem";
import ProjectOption from "@/src/components/Project/ProjectOption";
import RoundedText from "@/src/components/RoundedText";
import Title from "@/src/components/Title";
import { AuthContext } from "@/src/contexts/AuthContext";
import { getProject, getProjectEvaluations, getProjectMembers } from "@/src/services/projectService";
import { Project, ProjectMembers, ProjectStatus } from "@/src/types/project.types";
import { PROJECT_STATUS_VARIANT } from "@/src/utils/projectUtils";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useContext, useState } from "react";
import { Image, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProjectOptionsScreen() {
    const { id } = useLocalSearchParams();
    const [project, setProject] = useState<Project | null>(null);
    const [projectMembers, setProjectMembers] = useState<ProjectMembers | null>(null);
    const [evaluatorIds, setEvaluatorIds] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const authContext = useContext(AuthContext);
    const userId = authContext.authState?.user.id;
    const role = authContext.authState?.user.role;

    const isAdvisorOrMember = !!userId && !!projectMembers &&
        (projectMembers.advisor.id === userId || projectMembers.members.some(member => member.id === userId));
    const isEvaluator = !!userId && evaluatorIds.includes(userId);
    const canAccessProjectResources = role === 'ADMIN' || isAdvisorOrMember;
    const canAccessEvaluation = canAccessProjectResources || isEvaluator;

    useFocusEffect(
        useCallback(() => {
            setIsLoading(true);
            const fetchProject = async () => {
                try {
                    const [projectRes, membersRes] = await Promise.all([
                        getProject(Number(id)),
                        getProjectMembers(Number(id)),
                    ]);
                    if (projectRes.status === 200 && projectRes.data) setProject(projectRes.data);
                    if (membersRes.status === 200 && membersRes.data) setProjectMembers(membersRes.data);
                }
                catch (e) {

                }
                finally {
                    setIsLoading(false);
                }

                // Fetched separately: unlike the project/members endpoints, this one 403s for
                // users with no relationship to the project, which shouldn't block the rest
                // of the page from loading - it just means "not an evaluator here".
                try {
                    const evaluationsRes = await getProjectEvaluations(Number(id));
                    if (evaluationsRes.status === 200 && evaluationsRes.data) setEvaluatorIds(evaluationsRes.data.evaluatorIds);
                }
                catch (e) {

                }
            }
            fetchProject();
        }, [id])
    )

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
                            <RoundedText text={project.presentationSemester} fontSize={20} />
                            <RoundedText text={project.status} fontSize={20} variant={PROJECT_STATUS_VARIANT[project.status as ProjectStatus]} />
                        </View>

                        <View style={styles.projectOptionsContainer}>
                            <ProjectOption text="Descripción" iconName="information-circle" navigationUrl={`/(tabs)/projects/[id]/description`} navigationUrlProjectIdParam={parseInt(id.toString())} />
                            {canAccessEvaluation &&
                                <ProjectOption text="Evaluación" iconName="star" navigationUrl="/(app)/(tabs)/projects/[id]/modules" navigationUrlProjectIdParam={parseInt(id.toString())} />
                            }
                            {canAccessProjectResources &&
                                <ProjectOption text="Archivos" iconName="folder" navigationUrl="/(app)/(tabs)/projects/[id]/files" navigationUrlProjectIdParam={parseInt(id.toString())} />
                            }
                            {canAccessProjectResources &&
                                <ProjectOption text="Miembros" iconName="people-circle" navigationUrl="/(app)/(tabs)/projects/[id]/members" navigationUrlProjectIdParam={parseInt(id.toString())} />
                            }
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
