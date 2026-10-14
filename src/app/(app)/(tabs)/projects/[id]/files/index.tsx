import CustomAlert, { AlertProps } from "@/src/components/CustomAlert";
import Loading from "@/src/components/Loading";
import NotFoundItem from "@/src/components/NotFoundItem";
import ProjectFileListItem from "@/src/components/Project/ProjectFileListItem";
import RoundedOptionButton from "@/src/components/RoundedOptionButton";
import Title from "@/src/components/Title";
import Colors from "@/src/constants/Colors";
import { AuthContext } from "@/src/contexts/AuthContext";
import { getFileTypes, getTemplateFileName } from "@/src/services/fileService";
import { getProjectFiles, getProjectMembers } from "@/src/services/projectService";
import { Role } from "@/src/types/account.type";
import { FileType } from "@/src/types/file.type";
import { ProjectFile, ProjectFiles, ProjectMembers } from "@/src/types/project.types";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as FileSystem from "expo-file-system/legacy";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import * as Sharing from 'expo-sharing';
import { useCallback, useContext, useState } from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { zip } from "react-native-zip-archive";

export default function ProjectFilesScreen() {
    const [projectFiles, setProjectFiles] = useState<ProjectFiles>();
    const [projectMembers, setProjectMembers] = useState<ProjectMembers | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isDownloadingTemplates, setIsDownloadingTemplates] = useState(false);

    const authContext = useContext(AuthContext);
    const isAlumno = authContext.authState?.user?.role === Role.Alumno;
    const userId = authContext.authState?.user?.id;
    // Only the project's members can upload files, the backend rejects everyone else
    const isMember = !!userId && !!projectMembers && projectMembers.members.some(member => member.id === userId);

    const [isAlertVisible, setIsAlertVisible] = useState(false);
    const [alertProps, setAlertProps] = useState<AlertProps>({
        message: "",
        isVisible: false,
        onDismiss: () => setIsAlertVisible(false),
        style: "error"
    });

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
                // Separate from the files: if it fails the files are still shown, just without "Agregar"
                try {
                    const membersRes = await getProjectMembers(projectId);
                    setProjectMembers(membersRes.data);
                }
                catch (e) {
                    setProjectMembers(null);
                }
                finally {
                    setIsLoading(false);
                }
            }
            fetchProjectFiles();
        }, [projectId])
    );

    // Pushed (not replaced) so the header's back arrow returns to this list
    const openFile = (file: ProjectFile) => {
        router.push({
            pathname: "/(app)/(tabs)/projects/[id]/files/[fileId]",
            params: { id: projectId, fileId: file.id }
        });
    }

    const downloadTemplates = async () => {
        if (isDownloadingTemplates) return;
        setIsDownloadingTemplates(true);
        try {
            const res = await getFileTypes();
            const templates: FileType[] = (res.data ?? []).filter((fileType: FileType) => !!fileType.url);

            if (templates.length === 0) {
                setAlertProps({
                    message: "Plantillas no disponibles",
                    onDismiss: () => setIsAlertVisible(false),
                    isVisible: true,
                    style: "error"
                });
                setIsAlertVisible(true);
                return;
            }

            // Download every template into the app's cache first, so there's a local file per
            // template to hand to the zip step. Each one is verified to actually exist
            // afterwards - downloadAsync can resolve "successfully" even on a non-2xx response
            // (it just writes whatever body the server sent), and a malformed/legacy url (one
            // that doesn't match the "{uuid}-{name}" shape) would otherwise silently try to
            // download to a bare directory path instead of a file.
            const downloadedUris: string[] = [];
            for (const template of templates) {
                try {
                    const key = template.url as string;
                    const fileName = getTemplateFileName(key);
                    if (!fileName) {
                        console.log('Skipping template with an unexpected url shape', key);
                        continue;
                    }

                    const downloadUrl = `${process.env.EXPO_PUBLIC_CDN_DOMAIN}/${key}`;
                    const cacheUri = `${FileSystem.cacheDirectory}${fileName}`;

                    const result = await FileSystem.downloadAsync(downloadUrl, cacheUri);
                    if (result.status < 200 || result.status >= 300) {
                        console.log('Template download failed', key, result.status);
                        continue;
                    }

                    const info = await FileSystem.getInfoAsync(result.uri);
                    if (!info.exists || info.isDirectory) {
                        console.log('Template did not download to a real file', key);
                        continue;
                    }

                    downloadedUris.push(result.uri);
                }
                catch (e) {
                    console.log(e);
                }
            }

            if (downloadedUris.length === 0) {
                setAlertProps({
                    message: "No se pudieron descargar las plantillas",
                    onDismiss: () => setIsAlertVisible(false),
                    isVisible: true,
                    style: "error"
                });
                setIsAlertVisible(true);
                return;
            }

            // Bundle every template into a single zip so there's only one thing to share -
            // expo-sharing can only share one file per call either way.
            const targetZipUri = `${FileSystem.cacheDirectory}Plantillas.zip`;
            // zip() strips the "file://" scheme internally and resolves with that same bare
            // path, which Sharing.shareAsync then rejects - share the uri we asked it to write
            // to instead of the one it hands back.
            await zip(downloadedUris, targetZipUri);

            if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(targetZipUri);
            }
        }
        catch (e) {
            console.log(e);
        }
        finally {
            setIsDownloadingTemplates(false);
        }
    }


    return (
        <SafeAreaView style={styles.screen}>

            {isLoading && <Loading />}

            {!isLoading && !projectFiles && <NotFoundItem text='Proyecto no encontrado' />}

            {isAlertVisible && <CustomAlert {...alertProps} />}

            {!isLoading && projectFiles && isAlumno &&
                <TouchableOpacity
                    style={[styles.downloadButton, isDownloadingTemplates && styles.downloadButtonDisabled]}
                    onPress={downloadTemplates}
                    disabled={isDownloadingTemplates}
                >
                    <Ionicons name="cloud-download" size={50} color={Colors.secondary} />
                </TouchableOpacity>
            }

            {!isLoading && projectFiles &&
                <View style={styles.container}>
                    <Ionicons name="file-tray-full" size={150} color={Colors.secondary} />
                    <Title text="Archivos" />
                    <FlatList
                        data={projectFiles.files}
                        renderItem={({ item }) => <ProjectFileListItem file={item} selectedFileId={undefined} setSelectedFile={openFile} />}
                        keyExtractor={item => item.id.toString()}
                        style={styles.list}
                        ListHeaderComponent={isMember
                            ? () =>
                                <View style={styles.listHeader}>
                                    <RoundedOptionButton text="Agregar" icon="cloud-upload" onPress={() => router.push({
                                        pathname: '/(app)/(tabs)/projects/[id]/files/add',
                                        params: { id: projectId },
                                    })
                                    } />
                                </View>
                            : null
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
    downloadButton: {
        position: 'absolute',
        bottom: 24,
        right: 24,
        zIndex: 10,
        width: 80,
        height: 80,
        borderRadius: 100,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.primary,

        // iOS
        shadowColor: Colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,

        // Android
        elevation: 5,
    },
    downloadButtonDisabled: {
        opacity: 0.5
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