
import Loading from "@/src/components/Loading";
import NotFoundItem from "@/src/components/NotFoundItem";
import ProjectFileListItem from "@/src/components/ProjectFileListItem";
import Title from "@/src/components/Title";
import Colors from "@/src/constants/Colors";
import axios, { AxiosResponse } from 'axios';
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Image, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


interface ProjectImage {
    id: number,
    url: string
}

interface FileType {
    id: number,
    format: string,
    name: string
}

interface ProjectFile {
    id: number,
    link: string,
    status: string,
    fileType: FileType
}

interface Project {
    id: number,
    name: string,
    status: string,
    description: string,
    files: ProjectFile[]
    images: ProjectImage[]
}

async function getProjectFiles(id: number): Promise<Project | null> {
    const response: AxiosResponse<Project> = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/projects/${id}/files`);
    return response.data;
}

export default function ProjectFilesScreen() {
    const { id } = useLocalSearchParams();
    const [project, setProject] = useState<Project | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        getProjectFiles(parseInt(id.toString())).then(project => setProject(project));
        setIsLoading(false);
    }, []);

    return(
        <SafeAreaView style={styles.screen}>

            {isLoading && <Loading />}

            {!project && <NotFoundItem text='Proyecto no encontrado' />}

            { project && !isLoading &&
                <View style={styles.container}>
                    <Image source={{uri: project?.images[0].url}} style={styles.image} />
                    <Title text={project.name} />
                    <FlatList 
                        data={project.files}
                        renderItem={({item}) => <ProjectFileListItem {...item} />}
                        keyExtractor={item => item.id.toString()} 
                        style={styles.list}
                    />
                </View>
            }
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        alignItems: 'center' 
    },
    container: {
        alignItems: 'center',
        gap: 8,
        margin: 16,
        width: '80%',
    },
    image: {
        width: 300,
        height: 300
    },
    description: {
        textAlign: 'justify',
        fontSize: 16,
        color: Colors.textSecondary
    },
    list: {
        width: '100%'
    }
});