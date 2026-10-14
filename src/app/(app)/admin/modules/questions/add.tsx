import CustomAlert, { AlertProps } from "@/src/components/CustomAlert";
import Loading from "@/src/components/Loading";
import QuestionForm from "@/src/components/Module/QuestionForm";
import NotFoundItem from "@/src/components/NotFoundItem";
import Title from "@/src/components/Title";
import { addModuleQuestion, getModuleQuestions } from "@/src/services/moduleService";
import { AdminModuleQuestions } from "@/src/types/module.type";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


export default function AddQuestionScreen() {
    const { moduleId } = useLocalSearchParams();
    const [module, setModule] = useState<AdminModuleQuestions | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const [isAlertVisible, setIsAlertVisible] = useState(false);
    const [alertProps, setAlertProps] = useState<AlertProps>({
        message: '',
        onDismiss: () => setIsAlertVisible(false),
        isVisible: false,
        style: 'error'
    });

    const router = useRouter();

    // Loaded to show the module name and to warn early about a repeated question
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

    const onSubmit = async (question: string) => {
        setIsLoading(true);
        try {
            await addModuleQuestion(Number(moduleId), { question });
            setAlertProps({
                message: "Pregunta añadida",
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
                        : "No se pudo añadir la pregunta",
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
        <SafeAreaView style={styles.screen} edges={['bottom']}>
            {isLoading && <Loading />}

            {isAlertVisible && <CustomAlert {...alertProps} />}

            {!isLoading && module &&
                <ScrollView contentContainerStyle={styles.container}>
                    <Title text={module.name} />
                    <QuestionForm
                        otherQuestions={module.questions.map(question => question.name)}
                        onSubmit={onSubmit}
                        submitText="Añadir"
                    />
                </ScrollView>
            }

            {!isLoading && !module &&
                <NotFoundItem text="Módulo no encontrado" />
            }
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
});
