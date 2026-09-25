import FileTypeListItem from "@/src/components/File/FileType";
import Loading from "@/src/components/Loading";
import NotFoundItem from "@/src/components/NotFoundItem";
import RoundedOptionButton from "@/src/components/RoundedOptionButton";
import { getFileTypes } from "@/src/services/fileService";
import { FileType } from "@/src/types/file.type";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AdminFilesScreen() {
    const [fileTypes, setFileTypes] = useState<FileType[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useFocusEffect(
        useCallback(() => {
            setIsLoading(true);
            const fetchFileTypes = async () => {
                try {
                    const res = await getFileTypes();
                    setFileTypes(res.data);
                }
                catch (e) {
                    setFileTypes([]);
                }
                finally {
                    setIsLoading(false);
                }
            }
            fetchFileTypes();
        }, [])
    );

    return (
        <SafeAreaView style={styles.screen}>
            {isLoading && <Loading />}

            {!isLoading &&
                <View style={styles.addButton}>
                    <RoundedOptionButton text="Añadir Archivo" icon="add" onPress={() => router.push("/(app)/admin/files/add")} />
                </View>
            }

            {!isLoading && fileTypes.length === 0 && <NotFoundItem text="No hay archivos disponibles" />}

            {!isLoading && fileTypes.length > 0 &&
                <View style={styles.container}>
                    <FlatList
                        data={fileTypes}
                        renderItem={({ item }) => <FileTypeListItem {...item} onPress={() => router.push({ pathname: "/(app)/admin/files/[id]", params: { id: item.id } })} />}
                        keyExtractor={item => item.id.toString()}
                        contentContainerStyle={styles.list}
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
        padding: 16
    },
    addButton: {
        height: 48,
        marginHorizontal: 16,
        marginTop: 16
    },
    list: {
        gap: 8
    }
});
