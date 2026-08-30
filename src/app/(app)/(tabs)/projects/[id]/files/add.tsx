import CustomAlert, { AlertProps } from "@/src/components/CustomAlert";
import Loading from "@/src/components/Loading";
import NotFoundItem from "@/src/components/NotFoundItem";
import ProjectFileListItem from "@/src/components/Project/ProjectFileListItem";
import RoundedOptionButton from "@/src/components/RoundedOptionButton";
import Title from "@/src/components/Title";
import { isValidFileFormat, isValidFileSize } from "@/src/services/fileService";
import { getProjectFiles, getProjectFileStatus, getUploadUrl } from "@/src/services/projectService";
import { ProjectFile, ProjectFiles, ProjectFileStatus } from "@/src/types/project.types";
import * as DocumentPicker from 'expo-document-picker';
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AddProjectFilesScreen() {
    const [projectFiles, setProjectFiles] = useState<ProjectFiles>();
    const [isLoading, setIsLoading] = useState(true);
    const [selectedProjectFile, setSelectedProjectFile] = useState<ProjectFile | null>(null);
    

    const [isAlertVisible, setIsAlertVisible] = useState(false);
    const [alertProps, setAlertProps] = useState<AlertProps>({
        message: "",
        isVisible: isAlertVisible,
        onDismiss: () => null,
        style: "error"
    });

    const { id } = useLocalSearchParams();
    const projectId = Number(id);

    const router = useRouter();

    const getFileFromStorage = async () => {
        if (!selectedProjectFile) {
            setAlertProps({
                message: "Selecciona un archivo",
                isVisible: true,
                onDismiss: () => setIsAlertVisible(false),
                style: "error"
            });
            setIsAlertVisible(true);
            return;
        }
        try {
            const result = await DocumentPicker.getDocumentAsync({ copyToCacheDirectory: true });
            if (!result.canceled) {
                const { mimeType, size, uri } = result.assets[0];

                if (mimeType && size) uploadFileToS3(mimeType, size, uri);
                return;
            }
        }
        catch (e) {
            setAlertProps({
                message: "Error al seleccionar el archivo",
                onDismiss: () => setIsAlertVisible(false),
                isVisible: true,
                style: "error"
            });
            return setIsAlertVisible(true);
        }
    }

    const isValidFile = (mimeType: string, size: number, uri: string): boolean => {
        if (!selectedProjectFile || !uri) {
            setAlertProps({
                message: "Seleccione un archivo",
                onDismiss: () => setIsAlertVisible(false),
                isVisible: true,
                style: "error"
            });
            setIsAlertVisible(true);
            return false;
        }

        if (!isValidFileFormat(mimeType, selectedProjectFile.fileType.format)) {
            setAlertProps({
                message: "El formato del archivo no coincide",
                onDismiss: () => setIsAlertVisible(false),
                isVisible: true,
                style: "error"
            });
            setIsAlertVisible(true);
            return false;
        }

        if (!isValidFileSize(size)) {
            setAlertProps({
                message: "Tamaño de archivo inválido",
                onDismiss: () => setIsAlertVisible(false),
                isVisible: true,
                style: "error"
            })
            setIsAlertVisible(true);
            return false;
        }
        return true;
    }

    const checkProjectFileStatus = async (projectId: number, fileId: number): Promise<ProjectFileStatus> => {
        try {
            const maxAttempts = 60;
            for (let currentAttempt = 0; currentAttempt < maxAttempts; currentAttempt++) {
                const res = await getProjectFileStatus(projectId, fileId);

                if (res.status === 200 && res.data !== 'CARGANDO') {
                    setIsLoading(false);
                    return res.data;
                }

                await new Promise((resolve, reject) => {
                    setTimeout(resolve, 1000);
                })
            }
            throw new Error('File Validation Check Max Attemps Reached');
        }
        catch (e) {
            return 'FALLIDO';
        }
    }

    const uploadFileToS3 = async (mimeType: string, size: number, uri: string) => {
        if (!isValidFile(mimeType, size, uri)) return;

        if (!selectedProjectFile) return;
        const res = await getUploadUrl(projectId, {
            id: selectedProjectFile.id,
            mimeType: mimeType,
            size: size
        });
        const uploadUrl = res?.data;
        console.log(uploadUrl)

        const blob = await fetch(uri).then(res => res.blob());
        if (uploadUrl) {
            setIsLoading(true);
            try {
                const fileUpload = await fetch(uploadUrl, {
                    method: "PUT",
                    headers: {
                        "Content-Type": mimeType
                    },
                    body: blob
                });
                if (fileUpload.status === 200) {
                    const fileUploadValidationStatus = await checkProjectFileStatus(projectId, selectedProjectFile.id);
                    if (fileUploadValidationStatus === 'FALLIDO') {
                        setAlertProps({
                            message: "Archivo inválido, suba otro archivo",
                            onDismiss: () => setIsAlertVisible(false),
                            isVisible: true,
                            style: "error"
                        })
                    }
                    if (fileUploadValidationStatus === 'REVISION') {
                        setAlertProps({
                            message: "Subida de archivo completada",
                            onDismiss: () => {
                                setIsAlertVisible(false);
                                router.replace({
                                    pathname: '/(app)/(tabs)/projects/[id]/files',
                                    params: { id: projectId },
                                });
                            },
                            isVisible: true,
                            style: "success"
                        })
                    }
                    setIsAlertVisible(true);
                }
            }
            catch (e) {
                console.log(e)
            }
            finally {
                setIsLoading(false);
            }
        }
    }

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
        }, [])
    );

    return (
        <SafeAreaView style={styles.screen}>

            {isLoading && <Loading />}

            {!isLoading && !projectFiles && <NotFoundItem text='Archivos no disponibles' />}

            {!isLoading && isAlertVisible &&
                <CustomAlert {...alertProps} />
            }

            {!isLoading && projectFiles &&
                <View style={styles.container}>
                    <Title text="Archivos" />
                    <FlatList
                        data={projectFiles.files}
                        renderItem={({ item }) => <ProjectFileListItem file={item} selectedFileId={selectedProjectFile?.id} setSelectedFile={setSelectedProjectFile} />}
                        keyExtractor={item => item.id.toString()}
                        style={styles.list}
                    />
                    <View style={styles.listFooter}>
                        <RoundedOptionButton text="Agregar" icon="cloud-upload" onPress={getFileFromStorage} />
                    </View>
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
    listFooter: {
        alignSelf: 'center',
        width: '70%',
        height: 50,
        marginBottom: 12,
    },
    list: {
        width: '100%',
        flex: 1,
    },
});