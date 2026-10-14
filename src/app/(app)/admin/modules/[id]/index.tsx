import ConfirmDialog from "@/src/components/ConfirmDialog";
import CustomAlert, { AlertProps } from "@/src/components/CustomAlert";
import Loading from "@/src/components/Loading";
import NotFoundItem from "@/src/components/NotFoundItem";
import QuestionListItem from "@/src/components/QuestionListItem";
import RoundedOptionButton from "@/src/components/RoundedOptionButton";
import Title from "@/src/components/Title";
import { deleteModule, getModuleQuestions } from "@/src/services/moduleService";
import { AdminModuleQuestions } from "@/src/types/module.type";
import { isAspectosGenerales } from "@/src/utils/moduleUtils";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AdminModuleScreen() {
    const { id } = useLocalSearchParams();
    const [module, setModule] = useState<AdminModuleQuestions | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isDeleteDialogVisible, setIsDeleteDialogVisible] = useState(false);

    const [isAlertVisible, setIsAlertVisible] = useState(false);
    const [alertProps, setAlertProps] = useState<AlertProps>({
        message: '',
        onDismiss: () => setIsAlertVisible(false),
        isVisible: false,
        style: 'error'
    });

    const router = useRouter();

    const fetchModule = useCallback(async () => {
        setIsLoading(true);
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
    }, [id]);

    useFocusEffect(
        useCallback(() => {
            fetchModule();
        }, [fetchModule])
    );


    const onDeleteModule = async () => {
        setIsDeleteDialogVisible(false);
        setIsLoading(true);
        try {
            await deleteModule(Number(id));
            setAlertProps({
                message: "Módulo eliminado",
                // The module is gone, so go back to the module list
                onDismiss: () => {
                    setIsAlertVisible(false);
                    router.back();
                },
                isVisible: true,
                style: 'success'
            });
        }
        catch (e: any) {
            setAlertProps({
                message: e?.response?.status === 409
                    ? "Este módulo no puede ser eliminado"
                    : "No se pudo eliminar el módulo",
                onDismiss: () => setIsAlertVisible(false),
                isVisible: true,
                style: 'error'
            });
        }
        finally {
            setIsLoading(false);
            setIsAlertVisible(true);
        }
    }

    return (
        <SafeAreaView style={styles.screen}>

            {isLoading && <Loading />}

            {isAlertVisible && <CustomAlert {...alertProps} />}

            {!isLoading && module &&
                <View style={styles.container}>
                    <Title text={module.name} />
                    <View style={styles.addButton}>
                        <RoundedOptionButton text="Añadir Pregunta" icon="add" onPress={() => router.push({ pathname: "/(app)/admin/modules/questions/add", params: { moduleId: Number(id) } })} />
                    </View>
                    <FlatList
                        style={styles.listContainer}
                        data={module.questions}
                        renderItem={({ item }) =>
                            <QuestionListItem
                                question={item.name}
                                onPress={() => router.push({ pathname: "/(app)/admin/modules/questions/[id]", params: { id: item.id, moduleId: Number(id) } })}
                            />
                        }
                        keyExtractor={item => item.id.toString()}
                        contentContainerStyle={styles.list}
                        ListEmptyComponent={<NotFoundItem text="Este módulo no tiene preguntas" />}
                    />

                    {/* Aspectos Generales is required on every project and can't be deleted */}
                    {!isAspectosGenerales(module.name) &&
                        <View style={styles.deleteButton}>
                            <RoundedOptionButton text="Eliminar Módulo" icon="trash" onPress={() => setIsDeleteDialogVisible(true)} />
                        </View>
                    }
                </View>
            }

            {!isLoading && !module &&
                <NotFoundItem text="Módulo no encontrado" />
            }

            <ConfirmDialog
                isVisible={isDeleteDialogVisible}
                message="¿Está seguro de que desea eliminar este módulo?"
                variant="danger"
                confirmText="Eliminar"
                onConfirm={onDeleteModule}
                onCancel={() => setIsDeleteDialogVisible(false)}
            />

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
        paddingBottom: 16,
        gap: 16
    },
    addButton: {
        height: 48
    },
    listContainer: {
        flex: 1
    },
    list: {
        gap: 8
    },
    deleteButton: {
        height: 60
    }
});
