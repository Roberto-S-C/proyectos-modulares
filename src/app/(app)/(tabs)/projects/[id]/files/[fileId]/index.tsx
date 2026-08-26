import FileReviewListItem from "@/src/components/File/FileReviewListItem";
import FileStatusComponent from "@/src/components/File/FileStatusComponent";
import Loading from "@/src/components/Loading";
import NotFoundItem from "@/src/components/NotFoundItem";
import RoundedOptionButton from "@/src/components/RoundedOptionButton";
import Colors from "@/src/constants/Colors";
import { AuthContext } from "@/src/contexts/AuthContext";
import { getProjectFileDetails } from "@/src/services/projectService";
import { Role } from "@/src/types/account.type";
import { FileDetails } from "@/src/types/file.type";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useContext, useState } from "react";
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProjectFileScreen() {
    const [isLoading, setIsLoading] = useState(false);
    const [fileDetails, setFileDetails] = useState<FileDetails>();

    const authContext = useContext(AuthContext);
    const { id, fileId } = useLocalSearchParams();
    const router = useRouter();

    useFocusEffect(
        useCallback(() => {

            setIsLoading(true);
            const fetchFileDetails = async () => {
                try {
                    const res = await getProjectFileDetails(Number(id), Number(fileId));
                    if (res.data) setFileDetails(res.data);
                }
                catch (e) {

                }
                finally {
                    setIsLoading(false);
                }
            }
            fetchFileDetails();
        }, [])
    );

    return (
        <SafeAreaView style={styles.screen}>
            {isLoading && <Loading />}

            {!isLoading && fileDetails &&
                <View style={styles.container}>
                    {fileDetails.file.fileType.format === "image/jpeg" &&
                        <Image
                            style={styles.image}
                            source={{ uri: `${process.env.EXPO_PUBLIC_CDN_DOMAIN}/${fileDetails.file.link}` }}
                        />
                    }

                    {fileDetails.file.fileType.format === "application/pdf" &&
                        <TouchableOpacity
                            onPress={() => {
                                if (fileDetails.file.status === "FALTANTE" || fileDetails.file.status === "CARGANDO" || fileDetails.file.status === "RECHAZADO") return;
                                router.push({
                                    pathname: "/(app)/(tabs)/projects/[id]/files/[fileId]/pdf",
                                    params: {
                                        id: id.toString(),
                                        fileId: fileId.toString(),
                                        link: fileDetails.file.link,
                                        fileName: fileDetails.file.fileType.name
                                    }
                                })
                            }}
                            style={styles.file}>
                            <View style={styles.fileNameContainer}>
                                <Ionicons name="open-outline" size={28} />
                                <Text style={styles.fileName}>{fileDetails.file.fileType.name}</Text>
                            </View>
                            <View style={styles.fileDetailsContainer}>
                                <FileStatusComponent fileStatus={fileDetails.file.status} />
                                <Text style={styles.date}>Subido:{' '}
                                    {
                                        new Date(fileDetails.file.uploadedAt)
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
                        data={fileDetails.reviews}
                        renderItem={({ item }) => <FileReviewListItem review={item} />}
                        keyExtractor={item => item.id.toString()}
                        ListHeaderComponent={() => <Text style={styles.reviewsHeader}>Retroalimentación</Text>}
                        ListFooterComponent={() => {
                            return (
                                (authContext.authState?.user.role === Role.Evaluador || authContext.authState?.user.role === Role.Admin) &&
                                <View style={styles.reviewsFooter}>
                                    <RoundedOptionButton
                                        text="Agregar"
                                        icon="add"
                                        onPress={() => null}
                                    />
                                </View>
                            )
                        }}
                        ListEmptyComponent={
                            <View style={{ flexGrow: 1 }}>
                                <NotFoundItem text="Este archivo aún no cuenta con reseñas" />
                            </View>
                        }
                    />
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
        width: 300,
        height: 300
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
        width: "70%"
    }
});