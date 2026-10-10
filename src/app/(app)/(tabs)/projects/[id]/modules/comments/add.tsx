import CustomAlert, { AlertProps } from "@/src/components/CustomAlert";
import Loading from "@/src/components/Loading";
import PrimaryButton from "@/src/components/PrimaryButton";
import Colors from "@/src/constants/Colors";
import { addPreevaluationComment } from "@/src/services/projectService";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface FormInputs {
    comment: string
}

export default function AddPreevaluationComment() {
    const [isLoading, setIsLoading] = useState(false);
    const [isAlertVisible, setIsAlertVisible] = useState(false);
    const [alertProps, setAlertProps] = useState<AlertProps>({
        message: '',
        onDismiss: () => setIsAlertVisible(false),
        isVisible: false,
        style: 'error'
    });

    const { id } = useLocalSearchParams();
    const router = useRouter();

    const {
        handleSubmit,
        control,
        watch,
        formState: { errors }
    } = useForm<FormInputs>({
        defaultValues: {
            comment: ""
        }
    });

    const commentLength = watch("comment")?.length ?? 0;

    const showAlert = (message: string) => {
        setAlertProps({
            message,
            onDismiss: () => setIsAlertVisible(false),
            isVisible: true,
            style: 'error'
        });
        setIsAlertVisible(true);
    }

    const onSubmit: SubmitHandler<FormInputs> = async (data) => {
        setIsLoading(true);
        try {
            await addPreevaluationComment(Number(id), { comment: data.comment });
            router.replace({ pathname: "/(app)/(tabs)/projects/[id]/modules/comments", params: { id: Number(id) } });
        }
        catch (e) {
            showAlert("No se pudo registrar el comentario");
        }
        finally {
            setIsLoading(false);
        }
    }

    return (
        <SafeAreaView style={styles.screen}>
            {isLoading && <Loading />}

            {isAlertVisible && <CustomAlert {...alertProps} />}

            {!isLoading &&
                <View style={styles.container}>
                    <View style={styles.textAreaContainer}>
                        <View style={styles.textAreaLabelRow}>
                            <Text style={styles.textAreaLabel}>Comentario</Text>
                            <Text style={styles.charCount}>{commentLength}/500</Text>
                        </View>
                        <Controller
                            name="comment"
                            control={control}
                            rules={{ required: true, maxLength: 500 }}
                            render={({ field: { value, onBlur, onChange } }) =>
                                <TextInput
                                    style={styles.textArea}
                                    multiline={true}
                                    maxLength={500}
                                    onChangeText={onChange}
                                    value={value}
                                    onBlur={onBlur}
                                />
                            }
                        />
                        {errors.comment && errors.comment.type === "required"
                            && <Text style={styles.formError}>Introduzca un comentario válido</Text>}
                        {errors.comment && errors.comment.type === "maxLength"
                            && <Text style={styles.formError}>El comentario debe tener 500 caracteres o menos</Text>}
                    </View>

                    <PrimaryButton text="Enviar" onPress={handleSubmit(onSubmit)} />
                </View>
            }
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
    },
    container: {
        alignItems: "center",
        gap: 8,
        width: "96%",
        margin: "auto",
    },
    textAreaContainer: {
        width: "100%"
    },
    textAreaLabelRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    textAreaLabel: {
        color: Colors.secondary,
        fontSize: 18,
        fontWeight: "bold"
    },
    charCount: {
        color: Colors.textSecondary,
        fontSize: 14,
    },
    textArea: {
        width: "100%",
        height: 200,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: Colors.border,
        marginTop: 8,
        marginBottom: 12,
        textAlignVertical: "top",
        padding: 10,
    },
    formError: {
        fontWeight: "bold",
        color: Colors.error
    }
});
