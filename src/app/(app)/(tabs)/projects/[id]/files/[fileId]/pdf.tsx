import CustomAlert from "@/src/components/CustomAlert";
import Loading from "@/src/components/Loading";
import { getFileSignedUrl } from "@/src/services/projectService";
import { File, Paths } from "expo-file-system";
import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import Pdf from "react-native-pdf";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PdfViewer() {
    const { id, fileId, link, fileName } = useLocalSearchParams();

    const [localFileUri, setLocalFileUri] = useState<string>();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [downloadedFile, setDownloadedFile] = useState<File>();
    const [isAlertVisible, setIsAlertVisible] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");

    const showAlert = (message: string) => {
        setAlertMessage(message);
        setIsAlertVisible(true);
    };

    useEffect(() => {
        const fetchAndDownloadFile = async () => {
            if (id && fileId && link) {
                try {
                    setIsLoading(true);
                    const res = await getFileSignedUrl(Number(id), Number(fileId))
                    if (res.status === 200 && typeof res.data === "string") {
                        const file = await File.downloadFileAsync(res.data, Paths.cache, { idempotent: true }) as File;
                        if (file) setDownloadedFile(file);
                        setLocalFileUri(file.uri);
                    } else {
                        showAlert("No se pudo descargar el archivo.");
                    }
                }
                catch (e) {
                    showAlert("No se pudo descargar el archivo.");
                }
                finally {
                    setIsLoading(false);
                }
            }
        }
        fetchAndDownloadFile();

        downloadedFile?.delete()
    }, []);

    return (
        <SafeAreaView style={styles.screen}>
            <Stack.Screen options={{ title: typeof fileName === "string" ? fileName : "Archivo PDF" }} />
            {isLoading && <Loading />}
            {!isLoading && localFileUri &&
                <Pdf
                    style={styles.pdf}
                    source={{ uri: localFileUri }}
                    onError={() => showAlert("No se pudo mostrar el archivo.")}
                />
            }
            <CustomAlert
                message={alertMessage}
                isVisible={isAlertVisible}
                onDismiss={() => setIsAlertVisible(false)}
                style="error"
            />
        </SafeAreaView>

    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
    },
    pdf: {
        flex: 1,
        width: "96%",
        height: "96%",
        margin: "auto"
    }
});
