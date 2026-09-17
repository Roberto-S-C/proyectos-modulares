import Loading from "@/src/components/Loading";
import NotFoundItem from "@/src/components/NotFoundItem";
import ProjectFileListItem from "@/src/components/Project/ProjectFileListItem";
import RoundedOptionButton from "@/src/components/RoundedOptionButton";
import Title from "@/src/components/Title";
import Colors from "@/src/constants/Colors";
import { getProjectFiles } from "@/src/services/projectService";
import { ProjectFile, ProjectFiles } from "@/src/types/project.types";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProjectFilesScreen() {
    const [projectFiles, setProjectFiles] = useState<ProjectFiles>();
    const [isLoading, setIsLoading] = useState(true);
    const [selectedFile, setSelectedFile] = useState<ProjectFile | null>(null);

    const { id } = useLocalSearchParams();
    const projectId = Number(id);

    const router = useRouter();

    useFocusEffect(
        useCallback(() => {
            setIsLoading(true);
            const fetchProjectFiles = async () => {
                try {
                    const res = await getProjectFiles(projectId);
                    setProjectFiles(res.data);
                }
                catch (e) {
                    console.log(e)
                }
                finally {
                    setIsLoading(false);
                }
            }
            fetchProjectFiles();
        }, [projectId])
    );

    useEffect(() => {
        if (selectedFile) {
            router.replace({
                pathname: "/(app)/(tabs)/projects/[id]/files/[fileId]",
                params: { id: projectId, fileId: selectedFile.id }
            })
        }
    }, [selectedFile])


    return (
        <SafeAreaView style={styles.screen}>

            {isLoading && <Loading />}

            {!isLoading && !projectFiles && <NotFoundItem text='Proyecto no encontrado' />}

            {/* {!isLoading && <CustomAlert />} */}

            {!isLoading && projectFiles &&
                <View style={styles.container}>
                    <Ionicons name="file-tray-full" size={150} color={Colors.secondary} />
                    <Title text="Archivos" />
                    <FlatList
                        data={projectFiles.files}
                        renderItem={({ item }) => <ProjectFileListItem file={item} selectedFileId={undefined} setSelectedFile={setSelectedFile} />}
                        keyExtractor={item => item.id.toString()}
                        style={styles.list}
                        ListHeaderComponent={() =>
                            <View style={styles.listHeader}>
                                <RoundedOptionButton text="Agregar" icon="cloud-upload" onPress={() => router.push({
                                    pathname: '/(app)/(tabs)/projects/[id]/files/add',
                                    params: { id: projectId },
                                })
                                } />
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
        flex: 1,
        alignItems: 'center'
    },
    container: {
        flex: 1,
        alignItems: 'center',
        width: '90%',
        gap: 8,
    },
    listHeader: {
        alignSelf: 'center',
        width: '70%',
        marginBottom: 12,
    },
    list: {
        width: '100%',
    },
});