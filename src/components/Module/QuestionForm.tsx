import Colors from "@/src/constants/Colors";
import { Controller, useForm } from "react-hook-form";
import { StyleSheet, Text, TextInput, View } from "react-native";
import PrimaryButton from "../PrimaryButton";

const MAX_QUESTION_LENGTH = 250;

const normalize = (value: string) => value.trim().toLowerCase();

interface FormInputs {
    question: string
}

interface Props {
    // The module's other questions, a question can't be repeated inside a module
    otherQuestions: string[],
    onSubmit: (question: string) => void,
    submitText: string,
    defaultValue?: string,
}

export default function QuestionForm({ otherQuestions, onSubmit, submitText, defaultValue = "" }: Props) {
    const {
        handleSubmit,
        control,
        watch,
        formState: { errors }
    } = useForm<FormInputs>({
        defaultValues: { question: defaultValue }
    });

    const isUnchanged = normalize(watch("question")) === normalize(defaultValue) && defaultValue !== "";

    return (
        <View style={styles.container}>
            <Controller
                name="question"
                control={control}
                rules={{
                    required: "Introduzca la pregunta",
                    maxLength: { value: MAX_QUESTION_LENGTH, message: `La pregunta debe tener menos de ${MAX_QUESTION_LENGTH} caracteres` },
                    validate: {
                        notBlank: value => value.trim().length > 0 || "Introduzca la pregunta",
                        unique: value => !otherQuestions.some(question => normalize(question) === normalize(value))
                            || "Esta pregunta ya existe en el módulo"
                    }
                }}
                render={({ field: { value, onBlur, onChange } }) =>
                    <TextInput
                        multiline
                        placeholder="Pregunta..."
                        onChangeText={onChange}
                        value={value}
                        onBlur={onBlur}
                        style={styles.input}
                    />
                }
            />
            {errors.question && <Text style={styles.formError}>{errors.question.message}</Text>}

            <PrimaryButton
                text={submitText}
                onPress={handleSubmit(data => onSubmit(data.question.trim()))}
                disabled={isUnchanged}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        alignItems: 'center',
        gap: 16,
    },
    input: {
        width: '95%',
        minHeight: 150,
        textAlignVertical: 'top',
        fontSize: 16,
        color: Colors.textPrimary,
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: 10,
        padding: 10,
    },
    formError: {
        fontWeight: 'bold',
        color: Colors.error,
        textAlign: 'center',
    },
});
