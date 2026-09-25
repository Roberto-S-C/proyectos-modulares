import CustomAlert, { AlertProps } from '@/src/components/CustomAlert';
import Loading from '@/src/components/Loading';
import PrimaryButton from '@/src/components/PrimaryButton';
import RoundedOptionButton from '@/src/components/RoundedOptionButton';
import Title from '@/src/components/Title';
import Colors from '@/src/constants/Colors';
import { createModule, getModules } from '@/src/services/moduleService';
import { AdminModule } from '@/src/types/module.type';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Controller, SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface FormInputs {
    name: string,
    questions: { text: string }[]
}

const MAX_NAME_LENGTH = 100;
const MAX_QUESTION_LENGTH = 250;

const normalize = (value: string) => value.trim().toLowerCase();

export default function AdminAddModuleScreen() {
    const [step, setStep] = useState<1 | 2>(1);
    const [existingNames, setExistingNames] = useState<Set<string>>(new Set());
    const [isLoading, setIsLoading] = useState(true);
    const [isAlertVisible, setIsAlertVisible] = useState(false);
    const [alertProps, setAlertProps] = useState<AlertProps>({
        message: '',
        onDismiss: () => null,
        isVisible: false,
        style: 'error'
    });

    const router = useRouter();
    const insets = useSafeAreaInsets();

    const {
        handleSubmit,
        control,
        trigger,
        formState: { errors }
    } = useForm<FormInputs>({
        defaultValues: { name: '', questions: [] }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'questions',
        rules: { validate: questions => questions.length > 0 || 'Añada al menos una pregunta' }
    });

    useFocusEffect(useCallback(() => {
        setIsLoading(true);
        const fetchModules = async () => {
            try {
                const res = await getModules();
                setExistingNames(new Set<string>(res.data.map((module: AdminModule) => normalize(module.name))));
            }
            catch (e) {
                // The backend still rejects a duplicated name, this only lets us warn earlier
                setExistingNames(new Set());
            }
            finally {
                setIsLoading(false);
            }
        }
        fetchModules();
    }, []));

    const goToQuestions = async () => {
        if (await trigger('name')) {
            if (fields.length === 0) append({ text: '' });
            setStep(2);
        }
    }

    const onSubmit: SubmitHandler<FormInputs> = async (data) => {
        setIsLoading(true);
        try {
            const res = await createModule({
                name: data.name.trim(),
                questions: data.questions.map(question => question.text.trim())
            });
            if (res.status === 200) {
                setAlertProps({
                    message: 'Módulo añadido',
                    onDismiss: () => {
                        setIsAlertVisible(false);
                        router.back();
                    },
                    isVisible: true,
                    style: 'success'
                });
            }
            else throw new Error('Unable to create module');
        }
        catch (e: any) {
            const status = e?.response?.status;
            setAlertProps({
                message: status === 409
                    ? 'Ya existe un módulo con ese nombre'
                    : status === 400
                        ? 'El nombre o las preguntas no son válidos'
                        : 'No se puede añadir el módulo',
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
        <ScrollView style={styles.screen} contentContainerStyle={{ alignItems: 'center', paddingBottom: insets.bottom + 16 }}>
            {isLoading && <Loading />}

            {isAlertVisible && <CustomAlert {...alertProps} />}

            {!isLoading &&
                <View style={styles.container}>
                    <Ionicons name='cube' size={120} color={Colors.secondary} />
                    <Text style={styles.step}>Paso {step} de 2</Text>

                    {step === 1 &&
                        <>
                            <Title text='Nombre del módulo' />
                            <Controller
                                name='name'
                                control={control}
                                rules={{
                                    required: 'Introduzca un nombre para el módulo',
                                    maxLength: { value: MAX_NAME_LENGTH, message: `El nombre debe tener menos de ${MAX_NAME_LENGTH} caracteres` },
                                    validate: {
                                        notBlank: value => value.trim().length > 0 || 'Introduzca un nombre para el módulo',
                                        unique: value => !existingNames.has(normalize(value)) || 'Ya existe un módulo con ese nombre'
                                    }
                                }}
                                render={({ field: { value, onBlur, onChange } }) =>
                                    <TextInput
                                        numberOfLines={1}
                                        placeholder='Nombre...'
                                        onChangeText={onChange}
                                        value={value}
                                        onBlur={onBlur}
                                        style={styles.input}
                                    />
                                }
                            />
                            {errors.name && <Text style={styles.formError}>{errors.name.message}</Text>}

                            <PrimaryButton text='Siguiente' onPress={goToQuestions} />
                        </>
                    }

                    {step === 2 &&
                        <>
                            <Title text='Preguntas del módulo' />

                            <View style={styles.addQuestionButton}>
                                <RoundedOptionButton text='Añadir Pregunta' icon='add' onPress={() => append({ text: '' })} />
                            </View>

                            {errors.questions?.root && <Text style={styles.formError}>{errors.questions.root.message}</Text>}

                            {fields.map((field, index) =>
                                <View key={field.id} style={styles.questionContainer}>
                                    <View style={styles.questionRow}>
                                        <Controller
                                            name={`questions.${index}.text`}
                                            control={control}
                                            rules={{
                                                required: 'Introduzca la pregunta',
                                                maxLength: { value: MAX_QUESTION_LENGTH, message: `La pregunta debe tener menos de ${MAX_QUESTION_LENGTH} caracteres` },
                                                validate: {
                                                    notBlank: value => value.trim().length > 0 || 'Introduzca la pregunta',
                                                    unique: (value, formValues) =>
                                                        formValues.questions.filter(question => normalize(question.text) === normalize(value)).length === 1
                                                        || 'Esta pregunta está repetida'
                                                }
                                            }}
                                            render={({ field: { value, onBlur, onChange } }) =>
                                                <TextInput
                                                    multiline
                                                    placeholder={`Pregunta ${index + 1}...`}
                                                    onChangeText={onChange}
                                                    value={value}
                                                    onBlur={onBlur}
                                                    style={[styles.input, styles.questionInput]}
                                                />
                                            }
                                        />
                                        <TouchableOpacity onPress={() => remove(index)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                                            <Ionicons name='trash' size={28} color={Colors.error} />
                                        </TouchableOpacity>
                                    </View>
                                    {errors.questions?.[index]?.text &&
                                        <Text style={styles.formError}>{errors.questions[index].text.message}</Text>}
                                </View>
                            )}

                            <View style={styles.buttonsRow}>
                                <PrimaryButton text='Anterior' onPress={() => setStep(1)} style={styles.rowButton} />
                                <PrimaryButton text='Enviar' onPress={handleSubmit(onSubmit)} style={styles.rowButton} />
                            </View>
                        </>
                    }
                </View>
            }
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        marginVertical: 16,
        width: '92%',
    },
    step: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.textSecondary,
    },
    input: {
        textAlign: 'justify',
        fontSize: 16,
        color: Colors.textPrimary,
        borderWidth: 1,
        width: '90%',
        borderColor: Colors.border,
        borderRadius: 10,
        padding: 10
    },
    questionContainer: {
        width: '100%',
        alignItems: 'center',
        gap: 4,
    },
    questionRow: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    questionInput: {
        width: '80%',
        minHeight: 60,
        textAlignVertical: 'top',
    },
    addQuestionButton: {
        width: '90%',
        height: 48,
    },
    buttonsRow: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 12,
    },
    rowButton: {
        width: '44%',
    },
    formError: {
        fontWeight: 'bold',
        color: Colors.error,
        textAlign: 'center'
    }
});
