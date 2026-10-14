import ConfirmDialog from "@/src/components/ConfirmDialog";
import CustomAlert, { AlertProps } from "@/src/components/CustomAlert";
import Loading from "@/src/components/Loading";
import QuestionForm from "@/src/components/Module/QuestionForm";
import NotFoundItem from "@/src/components/NotFoundItem";
import RoundedOptionButton from "@/src/components/RoundedOptionButton";
import Title from "@/src/components/Title";
import { deleteModuleQuestion, getModuleQuestions, updateModuleQuestion } from "@/src/services/moduleService";
import { AdminModuleQuestions } from "@/src/types/module.type";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


export default function QuestionDetailsScreen() {
    const { id, moduleId } = useLocalSearchParams();
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

    // There's no endpoint for a single question, it's taken from its module's questions
    const question = module?.questions.find(question => question.id === Number(id));

    useFocusEffect(
        useCallback(() => {
            setIsLoading(true);
            const fetchModule = async () => {
                try {
                    const res = await getModuleQuestions(Number(moduleId));
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
        }, [moduleId])
    );

    const onSubmit = async (newQuestion: string) => {
        setIsLoading(true);
        try {
            await updateModuleQuestion(Number(moduleId), Number(id), { question: newQuestion });
            setAlertProps({
                message: "Pregunta actualizada",
                onDismiss: () => {
                    setIsAlertVisible(false);
                    router.back();
                },
                isVisible: true,
                style: 'success'
            });
        }
        catch (e: any) {
            const status = e?.response?.status;
            setAlertProps({
                message: status === 409
                    ? "Esta pregunta ya existe en el módulo"
                    : status === 400
                        ? "La pregunta no es válida"
                        : "No se pudo actualizar la pregunta",
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

    const showAlert = (message: string, style: AlertProps["style"]) => {
        setAlertProps({
            message,
            onDismiss: () => setIsAlertVisible(false),
            isVisible: true,
            style
        });
        setIsAlertVisible(true);
    }

    const onPressDelete = () => {
        // Evaluations need at least one question per module
        if (module && module.questions.length <= 1) {
            showAlert("El módulo debe tener al menos una pregunta", "error");
            return;
        }
        setIsDeleteDialogVisible(true);
    }

    const onDelete = async () => {
        setIsDeleteDialogVisible(false);
        setIsLoading(true);
        try {
            await deleteModuleQuestion(Number(moduleId), Number(id));
            setAlertProps({
                message: "Pregunta eliminada",
                // The question is gone, so go back to its module
                onDismiss: () => {
                    setIsAlertVisible(false);
                    router.back();
                },
                isVisible: true,
                style: 'success'
            });
            setIsAlertVisible(true);
        }
        catch (e: any) {
            showAlert(e?.response?.status === 409
                ? "Esta pregunta no puede ser eliminada"
                : "No se pudo eliminar la pregunta", "error");
        }
        finally {
            setIsLoading(false);
        }
    }

    return (
        <SafeAreaView style={styles.screen} edges={['bottom']}>
            {isLoading && <Loading />}

            {isAlertVisible && <CustomAlert {...alertProps} />}

            {!isLoading && module && question &&
                <ScrollView contentContainerStyle={styles.container}>
                    <Title text={module.name} />

                    <View style={styles.deleteButton}>
                        <RoundedOptionButton text="Eliminar Pregunta" icon="trash" onPress={onPressDelete} />
                    </View>

                    <QuestionForm
                        defaultValue={question.name}
                        otherQuestions={module.questions
                            .filter(other => other.id !== question.id)
                            .map(other => other.name)}
                        onSubmit={onSubmit}
                        submitText="Guardar"
                    />

                </ScrollView>
            }

            {!isLoading && (!module || !question) &&
                <NotFoundItem text="Pregunta no encontrada" />
            }

            <ConfirmDialog
                isVisible={isDeleteDialogVisible}
                message="¿Está seguro de que desea eliminar esta pregunta?"
                variant="danger"
                confirmText="Eliminar"
                onConfirm={onDelete}
                onCancel={() => setIsDeleteDialogVisible(false)}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
    },
    container: {
        alignItems: 'center',
        gap: 16,
        padding: 16,
    },
    deleteButton: {
        width: '90%',
        height: 60,
    },
});
