import Loading from "@/src/components/Loading";
import NotFoundItem from "@/src/components/NotFoundItem";
import QuestionListItem from "@/src/components/QuestionListItem";
import Title from "@/src/components/Title";
import Ionicons from "@expo/vector-icons/Ionicons";
import axios, { AxiosResponse } from "axios";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface ModuleQuestion {
    id: number,
    name: string,
}

interface Module {
    id: number,
    name: string,
    questions: ModuleQuestion[]
}

async function getModuleQuestions(id: number): Promise<Module> {
    console.log(id)
    const response: AxiosResponse<Module> = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/modules/${id}/questions`);
    return response.data;
}

export default function AdminModuleScreen() {
    const { id } = useLocalSearchParams();
    const [module, setModule] = useState<Module | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        getModuleQuestions(parseInt(id.toString())).then(module => setModule(module));
        setIsLoading(false);
    }, [])

    return (
        <SafeAreaView>

            {isLoading && <Loading />}

            {!isLoading && module &&
                <View style={styles.container}>
                    <Title text={module.name} />
                    <FlatList
                        data={module.questions}
                        renderItem={({ item }) => <QuestionListItem question={item.name} />}
                        keyExtractor={item => item.id.toString()}
                        contentContainerStyle={{ gap: 8 }}
                        ListHeaderComponent={() =>
                            <TouchableOpacity style={styles.addButton}>
                                <Ionicons name="add" size={32} />
                                <Text style={styles.addButtonText}>Añadir</Text>
                            </TouchableOpacity>

                        }
                    />
                </View>
            }

            {!isLoading && !module &&
                <NotFoundItem text="Módulo no encontrado" />
            }

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        gap: 20
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