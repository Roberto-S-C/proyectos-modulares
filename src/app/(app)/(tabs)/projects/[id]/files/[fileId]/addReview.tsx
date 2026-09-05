import CustomAlert, { AlertProps } from "@/src/components/CustomAlert";
import Loading from "@/src/components/Loading";
import NotFoundItem from "@/src/components/NotFoundItem";
import PrimaryButton from "@/src/components/PrimaryButton";
import Title from "@/src/components/Title";
import Colors from "@/src/constants/Colors";
import { addProjectFilewReview, getProjectFileDetails } from "@/src/services/projectService";
import { FileReviewStatus } from "@/src/types/file.type";
import { ProjectFile } from "@/src/types/project.types";
import { Picker } from "@react-native-picker/picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface FormInputs {
    review: string
}

export default function CreateFileReviewScreen() {
    const [fileDetails, setFileDetails] = useState<ProjectFile>();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [status, setStatus] = useState<FileReviewStatus>("APROVADO");
    const [isAlertVisible, setIsAlertVisible] = useState(false);
    const [alertProps, setAlertProps] = useState<AlertProps>({
        message: '',
        onDismiss: () => setIsAlertVisible(false),
        isVisible: isAlertVisible,
        style: 'error'
    });

    const { id, fileId } = useLocalSearchParams();

    const router = useRouter();

    const {
        handleSubmit,
        control,
        formState: { errors }
    } = useForm<FormInputs>({
        defaultValues: {
            review: ""
        }
    });

    const onSubmit: SubmitHandler<FormInputs> = async (data) => {
        setIsLoading(true);
        try {
            const res = await addProjectFilewReview(Number(id), Number(fileId), { review: data.review, status });
            if (res.status === 200) {
                router.replace({ pathname: "/(app)/(tabs)/projects/[id]/files/[fileId]", params: { id: Number(id), fileId: Number(fileId) } })
                return;
            }
            setAlertProps({
                message: 'No se pudo crear la reseña',
                onDismiss: () => setIsAlertVisible(false),
                isVisible: isAlertVisible,
                style: 'error'
            });
            setIsAlertVisible(true);
        }
        catch (e) {
            setAlertProps({
                message: 'No se pudo crear la reseña',
                onDismiss: () => setIsAlertVisible(false),
                isVisible: isAlertVisible,
                style: 'error'
            });
            setIsAlertVisible(true);
        }
        finally {
            setIsLoading(false);
        }
    }


    useEffect(() => {
        const fetchFileDetails = async () => {
            try {
                const res = await getProjectFileDetails(Number(id), Number(fileId));
                if (res.status === 200 && res.data) setFileDetails(res.data);
            }
            catch (e) {

            }
            finally {
                setIsLoading(false);
            }
        }
        fetchFileDetails()
    }, [])

    return (
        <SafeAreaView>
            {isLoading && <Loading />}

            {isAlertVisible && <CustomAlert {...alertProps} />}

            {!isLoading && !fileDetails &&
                <NotFoundItem text="Archivo no disponible" />
            }
            {!isLoading && fileDetails &&
                <View style={styles.container}>

                    <Title text={fileDetails.fileType.name} />

                    <View style={styles.fileStatusPickerContainer}>
                        <Picker
                            style={styles.fileStatusPicker}
                            itemStyle={styles.fileStatusPickerItem}
                            selectedValue={status}
                            onValueChange={setStatus}
                        >
                            <Picker.Item key={"APROVADO"} label={"APROVADO"} value={"APROVADO"} style={styles.fileStatusPickerItem} />
                            <Picker.Item key={"RECHAZADO"} label={"RECHAZADO"} value={"RECHAZADO"} style={styles.fileStatusPickerItem} />
                        </Picker>
                    </View>

                    <View style={styles.textAreaContainer}>
                        <Text style={styles.textAreaLabel}>Comentario</Text>
                        <Controller
                            name="review"
                            control={control}
                            rules={{ required: true, maxLength: 200 }}
                            render={({ field: { value, onBlur, onChange } }) =>
                                <TextInput
                                    style={styles.textArea}
                                    multiline={true}
                                    onChangeText={onChange}
                                    value={value}
                                    onBlur={onBlur}
                                />
                            }
                        />
                        {errors.review && errors.review.type === "required"
                            && <Text style={styles.formError}>Introduzca un comentario válido</Text>}
                        {errors.review && errors.review.type === "maxLength"
                            && <Text style={styles.formError}>El comentario debe tener 200 caracteres o menos</Text>}
                    </View>

                    <PrimaryButton text="Enviar" onPress={handleSubmit(onSubmit)} />

                </View>
            }
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        gap: 8,
        width: "96%",
        margin: "auto",
    },
    fileStatusPickerContainer: {
        width: 200,
        borderWidth: 1,
        borderRadius: 10,
        borderColor: Colors.border,
        overflow: "hidden",
        marginTop: 12
    },
    fileStatusPicker: {
        width: 200,
    },
    fileStatusPickerItem: {
        fontWeight: "bold"
    },
    textAreaContainer: {
        width: "96%"
    },
    textAreaLabel: {
        color: Colors.secondary,
        fontSize: 18,
        fontWeight: "bold"
    },
    textArea: {
        width: "100%",
        height: 200,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: Colors.border,
        marginBottom: 12,
        textAlignVertical: "top",
        padding: 10,
    },
    formError: {
        fontWeight: "bold",
        color: Colors.error
    }
});