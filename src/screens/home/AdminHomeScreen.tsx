import Loading from "@/src/components/Loading";
import ModuleListItem from "@/src/components/Module";
import NotFoundItem from "@/src/components/NotFoundItem";
import Title from "@/src/components/Title";
import Ionicons from "@expo/vector-icons/Ionicons";
import axios, { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Module {
    id: number,
    name: string
}

async function getModules(): Promise<Module[]> {
    const response: AxiosResponse<Module[]> = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/modules`);
    return response.data;
}

export default function AdminHomeScreen() {
    const [modules, setModules] = useState<Module[] | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        getModules().then(modules => setModules(modules));
        console.log(modules)
        setIsLoading(false);
    }, [])

    return (
        <SafeAreaView style={styles.screen}>
            <View style={styles.container}>
                <Title text="Evaluación" />

                {isLoading && <Loading />}

                {!isLoading && modules &&
                    <FlatList
                        data={modules}
                        renderItem={({ item }) => <ModuleListItem id={item.id} name={item.name} navigationUrl='/admin/modules/[id]' />}
                        keyExtractor={item => item.id.toString()}
                        ListHeaderComponent={() =>
                            <TouchableOpacity style={styles.addButton}>
                                <Ionicons name="add" size={32} />
                                <Text style={styles.addButtonText}>Añadir</Text>
                            </TouchableOpacity>
                        }
                        contentContainerStyle={{ gap: 8 }}
                    />
                }

                {!isLoading && !modules && <NotFoundItem text="Modulos no encontrados" />}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        padding: 16
    },
    container: {
        padding: 8,
        gap: 16
    },
    addButton: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    addButtonText: {
        fontSize: 20,
        fontWeight: 'bold'
    }
});