import Loading from "@/src/components/Loading";
import NotFoundItem from "@/src/components/NotFoundItem";
import QuestionListItem from "@/src/components/QuestionListItem";
import RoundedOptionButton from "@/src/components/RoundedOptionButton";
import Title from "@/src/components/Title";
import { getModuleQuestions } from "@/src/services/moduleService";
import { AdminModuleQuestions } from "@/src/types/module.type";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AdminModuleScreen() {
    const { id } = useLocalSearchParams();
    const [module, setModule] = useState<AdminModuleQuestions | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useFocusEffect(
        useCallback(() => {
            setIsLoading(true);
            const fetchModule = async () => {
                try {
                    const res = await getModuleQuestions(Number(id));
                    setModule(res.data);
                }
                catch (e) {
                    setModule(null);
                }
                finally {
                    setIsLoading(false);
                }
            }
            fetchModule();
        }, [id])
    );

    return (
        <SafeAreaView style={styles.screen}>

            {isLoading && <Loading />}

            {!isLoading && module &&
                <View style={styles.container}>
                    <Title text={module.name} />
                    <View style={styles.addButton}>
                        <RoundedOptionButton text="Añadir Pregunta" icon="add" onPress={() => null} />
                    </View>
                    <FlatList
                        data={module.questions}
                        renderItem={({ item }) => <QuestionListItem question={item.name} />}
                        keyExtractor={item => item.id.toString()}
                        contentContainerStyle={styles.list}
                        ListEmptyComponent={<NotFoundItem text="Este módulo no tiene preguntas" />}
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
    screen: {
        flex: 1
    },
    container: {
        flex: 1,
        paddingHorizontal: 16,
        gap: 16
    },
    addButton: {
        height: 48
    },
    list: {
        gap: 8
    }
});
