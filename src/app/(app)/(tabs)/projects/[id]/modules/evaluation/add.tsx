import CustomAlert, { AlertProps } from "@/src/components/CustomAlert";
import Loading from "@/src/components/Loading";
import ModuleQuestionListItem from "@/src/components/Module/ModuleQuestion";
import NotFoundItem from "@/src/components/NotFoundItem";
import PrimaryButton from "@/src/components/PrimaryButton";
import Title from "@/src/components/Title";
import { addProjectEvaluation, getProjectModuleQuestions } from "@/src/services/projectService";
import { CreateModuleEvaluation, ProjectModuleQuestions } from "@/src/types/module.type";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AddEvaluation() {
    const [isLoading, setIsLoading] = useState(true);
    const [projectModules, setProjectModules] = useState<ProjectModuleQuestions[]>();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<number, number>>({});

    const [isAlertVisible, setIsAlertVisible] = useState(false);
    const [alertProps, setAlertProps] = useState<AlertProps>({
        message: '',
        onDismiss: () => setIsAlertVisible(false),
        isVisible: false,
        style: 'error'
    });

    const { id } = useLocalSearchParams();
    const router = useRouter();

    useEffect(() => {
        const fetchProjectModuleQuestions = async () => {
            try {
                const res = await getProjectModuleQuestions(Number(id));
                if (res.status === 200 && res.data) setProjectModules(res.data);
            }
            catch (e) {
                console.log(e)
            }
            finally {
                setIsLoading(false);
            }
        }
        fetchProjectModuleQuestions();
    }, [])

    const setQuestionScore = (questionId: number, score: number) => {
        setAnswers(prev => ({ ...prev, [questionId]: score }));
    }

    const currentModule = projectModules?.[currentIndex];
    const isCurrentModuleComplete = !!currentModule && currentModule.questions.every(question => answers[question.id] !== undefined);
    const allModulesComplete = !!projectModules && projectModules.every(module => module.questions.every(question => answers[question.id] !== undefined));
    const canGoPrevious = currentIndex > 0;
    const canGoNext = isCurrentModuleComplete && !!projectModules && currentIndex < projectModules.length - 1;

    const goToPrevious = () => {
        if (canGoPrevious) setCurrentIndex(prev => prev - 1);
    }

    const goToNext = () => {
        if (canGoNext) setCurrentIndex(prev => prev + 1);
    }

    const showAlert = (message: string) => {
        setAlertProps({
            message,
            onDismiss: () => setIsAlertVisible(false),
            isVisible: true,
            style: 'error'
        });
        setIsAlertVisible(true);
    }

    const onSubmit = async () => {
        if (!projectModules) return;

        const evaluations: CreateModuleEvaluation[] = projectModules.flatMap(module =>
            module.questions.map(question => ({
                projectModuleId: module.projectModuleId,
                moduleQuestionId: question.id,
                score: answers[question.id],
            }))
        );

        setIsLoading(true);
        try {
            await addProjectEvaluation(Number(id), evaluations);
            router.replace({ pathname: "/(app)/(tabs)/projects/[id]/modules/evaluation", params: { id: Number(id) } });
        }
        catch (e: any) {
            const status = e?.response?.status;
            const message: string = e?.response?.data?.message ?? "";

            if (status === 403) {
                showAlert("No tienes permiso para evaluar este proyecto");
            }
            else if (status === 409 && message.toLowerCase().includes("already evaluated")) {
                showAlert("Ya evaluaste este proyecto, solo puedes evaluarlo una vez");
            }
            else if (status === 409) {
                showAlert("Este proyecto no puede ser evaluado");
            }
            else {
                showAlert("No se pudo enviar la evaluación");
            }
        }
        finally {
            setIsLoading(false);
        }
    }

    return (
        <SafeAreaView style={styles.screen}>
            {isLoading && <Loading />}

            {isAlertVisible && <CustomAlert {...alertProps} />}

            {!isLoading && (!projectModules || projectModules.length === 0) &&
                <NotFoundItem text="Módulos no disponibles" />
            }

            {!isLoading && currentModule &&
                <View style={styles.container}>
                    <Title text={currentModule.moduleName} />

                    <FlatList
                        style={styles.list}
                        data={currentModule.questions}
                        renderItem={({ item }) =>
                            <ModuleQuestionListItem
                                question={item.name}
                                score={answers[item.id]}
                                onSelect={score => setQuestionScore(item.id, score)}
                            />
                        }
                        keyExtractor={item => item.id.toString()}
                        ItemSeparatorComponent={() => <View style={{ minHeight: 8 }} />}
                    />

                    <View style={styles.navigationContainer}>
                        <PrimaryButton text="Anterior" onPress={goToPrevious} disabled={!canGoPrevious} style={styles.navigationButton} />
                        {allModulesComplete
                            ? <PrimaryButton text="Enviar" onPress={onSubmit} style={styles.navigationButton} />
                            : <PrimaryButton text="Siguiente" onPress={goToNext} disabled={!canGoNext} style={styles.navigationButton} />
                        }
                    </View>
                </View>
            }
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        width: "96%",
        margin: "auto",
    },
    container: {
        flex: 1,
        gap: 16,
    },
    list: {
        flex: 1,
    },
    navigationContainer: {
        flexDirection: "row",
        justifyContent: "center",
        gap: 16,
    },
    navigationButton: {
        flex: 1,
        width: "auto",
    },
});
