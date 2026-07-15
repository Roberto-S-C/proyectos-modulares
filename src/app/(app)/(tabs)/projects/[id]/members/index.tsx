import AccountListItem from "@/src/components/Account/AccountListItem";
import Loading from "@/src/components/Loading";
import NotFoundItem from "@/src/components/NotFoundItem";
import RoundedOptionButton from "@/src/components/RoundedOptionButton";
import Title from "@/src/components/Title";
import { AuthContext } from "@/src/contexts/AuthContext";
import { getProjectMembers } from "@/src/services/projectService";
import { Role } from "@/src/types/account.type";
import { ProjectMembers } from "@/src/types/project.types";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { FlatList, Image, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProjectMembersScreen() {
    const { id } = useLocalSearchParams();
    const [project, setProject] = useState<ProjectMembers | null>(null);
    const [membersId, setMembersId] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const authContext = useContext(AuthContext);
    const userId = authContext.authState?.user?.id;

    const router = useRouter();

    useEffect(() => {
        setIsLoading(true);
        getProjectMembers(parseInt(id.toString())).then(res => {
            let project: ProjectMembers = res.data;
            project.advisor.role = Role.Asesor;
            let ids: string[] = [];
            project.members.forEach(member => {
                ids.push(member.id);
            });
            setMembersId(ids);
            setProject(project)
        });
        setIsLoading(false);
    }, []);

    return (
        <SafeAreaView style={styles.screen}>
            {isLoading && <Loading />}

            {!isLoading && !project && <NotFoundItem text="Proyecto no encontrado" />}

            {!isLoading && project &&
                <View style={styles.container}>
                    <Image source={{ uri: `${process.env.EXPO_PUBLIC_CDN_DOMAIN}/${project.coverImageUrl}` }} style={styles.image} />
                    <Title text={project.name} />

                    {
                        userId &&
                        membersId.includes(userId) &&
                        <RoundedOptionButton text="Añadir Miembro" icon="person-add" onPress={() => { router.push(`/(app)/(tabs)/projects/[${id}]/members/add`) }} />
                    }

                    <View>
                        <AccountListItem {...project.advisor} onPress={() => router.push({ pathname: '/(app)/(tabs)/accounts/[id]', params: { id: project.advisor.id } })} />
                    </View>
                    <FlatList
                        data={project.members}
                        renderItem={({ item }) => <AccountListItem {...item} onPress={() => router.push({ pathname: '/(app)/(tabs)/accounts/[id]', params: { id: item.id } })} />}
                        keyExtractor={item => item.id}
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
        width: '100%',
        paddingHorizontal: 16,
        gap: 8,
    },
    image: {
        alignSelf: 'center',
        width: 300,
        height: 300
    }
});