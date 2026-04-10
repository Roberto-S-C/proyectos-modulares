import FileType from "@/src/components/FileType";
import Loading from "@/src/components/Loading";
import Title from "@/src/components/Title";
import axios, { AxiosResponse } from 'axios';
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


interface FileType {
    id: number,
    format: string,
    name: string
}

async function getFileTypes(): Promise<FileType[] | []> {
    const response: AxiosResponse<FileType[]> = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/filetypes`)
    return response?.data;
}

export default function FilesScreen() {
    const [fileTypes, setFileTypes] = useState<FileType[] | []>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        getFileTypes().then(fileTypes => setFileTypes(fileTypes));
        setIsLoading(false);
    }, []);


    return (
        <SafeAreaView style={styles.screen}>
            {isLoading && <Loading />}
            {!isLoading &&
                <View style={styles.container}>
                    <Title text="Archivos" />
                    <FlatList
                        data={fileTypes}
                        renderItem={({ item }) => <FileType {...item} />}
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
        justifyContent: 'flex-start',
        padding: 16,
        gap: 16
    },
    list: {
        gap: 8
    }
});