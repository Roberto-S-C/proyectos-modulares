import AccountListItem from "@/src/components/AccountListItem";
import Loading from "@/src/components/Loading";
import NotFoundItem from "@/src/components/NotFoundItem";
import Title from "@/src/components/Title";
import axios from "axios";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Image, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface ProjectImage {
    id: number,
    url: string
}

interface Account {
    id: string,
    name: string,
    lastname: string,
    email: string,
    role: string
}

interface Project {
    id: number,
    name: string,
    advisor: Account,
    members: Account[],
    images: ProjectImage[]
}

async function getProjectMembers(id: number): Promise<Project> {
    const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/projects/${id}/members`);
    return response.data;
}

export default function ProjectParticipantsScreen() {
    const { id } = useLocalSearchParams();
    const [project, setProject] = useState<Project | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        getProjectMembers(parseInt(id.toString())).then(project => {
            project.advisor.role = 'ROLE_ASESOR';
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
                    <Image source={{ uri: project.images[0].url }} style={styles.image} />
                    <Title text={project.name} />
                    <View>
                        <AccountListItem {...project.advisor} />
                    </View>
                    <FlatList
                        data={project.members}
                        renderItem={({ item }) => <AccountListItem {...item} />}
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