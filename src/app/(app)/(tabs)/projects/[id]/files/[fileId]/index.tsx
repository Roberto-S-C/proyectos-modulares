import CustomAlert, { AlertProps } from "@/src/components/CustomAlert";
import FileReviewListItem from "@/src/components/File/FileReviewListItem";
import FileStatusComponent from "@/src/components/File/FileStatusComponent";
import Loading from "@/src/components/Loading";
import NotFoundItem from "@/src/components/NotFoundItem";
import RoundedOptionButton from "@/src/components/RoundedOptionButton";
import Colors from "@/src/constants/Colors";
import { AuthContext } from "@/src/contexts/AuthContext";
import { getProjectFileDetails, getProjectFileReviews } from "@/src/services/projectService";
import { Role } from "@/src/types/account.type";
import { FileReview } from "@/src/types/file.type";
import { ProjectFile } from "@/src/types/project.types";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useContext, useState } from "react";
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProjectFileScreen() {
    const [isLoading, setIsLoading] = useState(false);
    const [fileDetails, setFileDetails] = useState<ProjectFile>();
    const [fileReviews, setFileReviews] = useState<FileReview[]>([]);
    const [isAlertVisible, setIsAlertVisible] = useState(false);
    const [alertProps, setAlertProps] = useState<AlertProps>({
        message: '',
        onDismiss: () => setIsAlertVisible(false),
        isVisible: isAlertVisible,
        style: 'error'
    });

    const authContext = useContext(AuthContext);
    const { id, fileId } = useLocalSearchParams();
    const router = useRouter();

    useFocusEffect(
        useCallback(() => {

            setIsLoading(true);
            const fetchFile = async () => {
                try {
                    const fileDetailsReq = await getProjectFileDetails(Number(id), Number(fileId));
                    if (fileDetailsReq.status === 200 && fileDetailsReq.data) setFileDetails(fileDetailsReq.data);
                    console.log(fileDetailsReq.data)

                    const fileReviewsReq = await getProjectFileReviews(Number(id), Number(fileId));
                    if (fileReviewsReq.status === 200 && fileReviewsReq.data) {
                        const sortedReviews = [...fileReviewsReq.data].sort((a, b) =>
                            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                        );
                        setFileReviews(sortedReviews);
                    }
                }
                catch (e) {

                }
                finally {
                    setIsLoading(false);
                }
            }
            fetchFile();
        }, [id, fileId])
    );

    return (
        <SafeAreaView style={styles.screen}>
            {isLoading && <Loading />}

            {isAlertVisible && <CustomAlert {...alertProps} />}

            {!isLoading && fileDetails &&
                <View style={styles.container}>
                    {fileDetails.fileType.format === "image/jpeg" &&
                        <Image
                            style={styles.image}
                            source={{ uri: `${process.env.EXPO_PUBLIC_CDN_DOMAIN}/${fileDetails.link}` }}
                        />
                    }

                    {fileDetails.fileType.format === "application/pdf" &&
                        <TouchableOpacity
                            onPress={() => {
                                if (!fileDetails.link) {
                                    setAlertProps({
                                        message: 'Archivo no disponible',
                                        onDismiss: () => setIsAlertVisible(false),
                                        isVisible: isAlertVisible,
                                        style: 'error'
                                    });
                                    setIsAlertVisible(true);
                                    return;
                                }
                                if (fileDetails.status === "FALTANTE" || fileDetails.status === "CARGANDO" || fileDetails.status === "FALLIDO") return;
                                router.push({
                                    pathname: "/(app)/(tabs)/projects/[id]/files/[fileId]/pdf",
                                    params: {
                                        id: id.toString(),
                                        fileId: fileId.toString(),
                                        link: fileDetails.link,
                                        fileName: fileDetails.fileType.name
                                    }
                                })
                            }}
                            style={styles.file}>
                            <View style={styles.fileNameContainer}>
                                <Ionicons name="open-outline" size={28} />
                                <Text style={styles.fileName}>{fileDetails.fileType.name}</Text>
                            </View>
                            <View style={styles.fileDetailsContainer}>
                                <FileStatusComponent fileStatus={fileDetails.status} />
                                <Text style={styles.date}>Subido:{' '}
                                    {
                                        new Date(fileDetails.uploadedAt)
                                            .toLocaleString("es-ES", {
                                                month: "numeric",
                                                day: "numeric",
                                                year: "numeric",
                                                hour: "numeric",
                                                minute: "2-digit"
                                            })
                                    }
                                </Text>
                            </View>
                        </TouchableOpacity>
                    }

                    <FlatList
                        style={{ flex: 1 }}
                        data={fileReviews}
                        renderItem={({ item }) => <FileReviewListItem review={item} />}
                        keyExtractor={item => item.id.toString()}
                        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
                        ListHeaderComponent={() => <Text style={styles.reviewsHeader}>Retroalimentación</Text>}
                        ListEmptyComponent={
                            <View style={{ flexGrow: 1 }}>
                                <NotFoundItem text="Este archivo aún no cuenta con reseñas" />
                            </View>
                        }
                    />

                    {(authContext.authState?.user.role === Role.Evaluador || authContext.authState?.user.role === Role.Admin) &&
                        <View style={styles.reviewsFooter}>
                            <RoundedOptionButton
                                text="Reseña"
                                icon="add"
                                onPress={() => router.push(
                                    {
                                        pathname: "/(app)/(tabs)/projects/[id]/files/[fileId]/addReview",
                                        params: { id: Number(id), fileId: Number(fileId) }
                                    })
                                }
                            />
                        </View>
                    }
                </View>
            }
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1
    },
    container: {
        flex: 1,
        gap: 16,
        alignContent: "center",
        width: "90%",
        margin: "auto",
    },
    image: {
        margin: "auto",
        width: 250,
        height: 250
    },
    file: {
        padding: 10,
        gap: 12,
        borderWidth: 1,
        borderRadius: 10,
        borderColor: Colors.border,
    },
    fileNameContainer: {
        flexDirection: "row",
        alignContent: "center",
    },
    fileName: {
        fontWeight: "bold",
        fontSize: 24,
        color: Colors.textPrimary,
        textDecorationLine: "underline",
        textDecorationColor: Colors.textPrimary
    },
    fileDetailsContainer: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    date: {
        color: Colors.textSecondary,
        fontSize: 16
    },
    reviewsHeader: {
        margin: "auto",
        marginBottom: 8,
        fontSize: 28,
        fontWeight: "bold",
        color: Colors.secondary,
    },
    reviewsFooter: {
        margin: "auto",
        marginTop: 16,
        width: "60%",
        height: 52
    }
});