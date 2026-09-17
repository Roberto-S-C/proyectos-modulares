import AccountListItem from "@/src/components/Account/AccountListItem";
import CustomAlert from "@/src/components/CustomAlert";
import Loading from "@/src/components/Loading";
import NotFoundItem from "@/src/components/NotFoundItem";
import RoundedOptionButton from "@/src/components/RoundedOptionButton";
import Title from "@/src/components/Title";
import { AuthContext } from "@/src/contexts/AuthContext";
import { getProjectMembers } from "@/src/services/projectService";
import { Role } from "@/src/types/account.type";
import { ProjectMembers } from "@/src/types/project.types";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useContext, useState } from "react";
import { FlatList, Image, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProjectMembersScreen() {
    const [project, setProject] = useState<ProjectMembers>();
    const [membersId, setMembersId] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [isAlertVisible, setIsAlertVisible] = useState(false);

    const authContext = useContext(AuthContext);
    const userId = authContext.authState?.user?.id;

    const searchParams = useLocalSearchParams();
    const projectId = Number(searchParams.id);

    const router = useRouter();

    useFocusEffect(
        useCallback(() => {
            setIsLoading(true);
            const fetchProjectMembers = async () => {
                try {
                    const res = await getProjectMembers(projectId);

                    let project: ProjectMembers = res.data;
                    project.advisor.role = Role.Asesor;
                    project.members.unshift(project.advisor);

                    let ids: string[] = [];
                    project.members.forEach(member => {
                        ids.push(member.id);
                    });
                    setMembersId(ids);
                    setProject(project)
                }
                catch (e) {
                    setIsAlertVisible(true);
                }
                finally {
                    setIsLoading(false);
                }
            }
            fetchProjectMembers();
        }, [projectId])
    );

    return (
        <SafeAreaView style={styles.screen}>
            {isLoading && <Loading />}

            {!isLoading && isAlertVisible &&
                <CustomAlert
                    message={"Error al obtener la información del proyecto"}
                    isVisible={true}
                    onDismiss={() => router.replace("/(app)/(tabs)")}
                    style="error"
                />
            }

            {!isLoading && !project && <NotFoundItem text="Proyecto no encontrado" />}

            {!isLoading && project &&
                <View style={styles.container}>
                    <Image source={{ uri: `${process.env.EXPO_PUBLIC_CDN_DOMAIN}/${project.coverImageUrl}` }} style={styles.image} />
                    <Title text={project.name} />

                    <FlatList
                        data={project.members}
                        renderItem={({ item }) => <AccountListItem {...item} onPress={() => router.push({ pathname: '/(app)/(tabs)/accounts/[id]', params: { id: item.id } })} />}
                        keyExtractor={item => item.id}
                        style={styles.list}
                        ListHeaderComponent={() =>
                            userId &&
                            membersId.includes(userId) &&
                            <View style={styles.listHeader}>
                                <RoundedOptionButton text="Añadir Miembro" icon="person-add" onPress={() => { router.push(`/(app)/(tabs)/projects/${projectId}/members/add`) }} />
                            </View>
                        }
                    />
                </View>
            }
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1
    },
    container: {
        flex: 1,
        alignSelf: 'center',
        width: '90%',
        gap: 8
    },
    image: {
        alignSelf: 'center',
        width: 300,
        height: 300
    },
    listHeader: {
        alignSelf: 'center',
        width: '70%',
        marginBottom: 12,
    },
    list: {
        width: '100%'
    }
});