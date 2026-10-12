import CustomAlert, { AlertProps } from '@/src/components/CustomAlert';
import DatePickerField from '@/src/components/DatePickerField';
import Loading from '@/src/components/Loading';
import NotFoundItem from '@/src/components/NotFoundItem';
import PrimaryButton from '@/src/components/PrimaryButton';
import Title from '@/src/components/Title';
import Colors from '@/src/constants/Colors';
import { getPresentationSemester, updatePresentationSemester } from '@/src/services/presentationSemesterService';
import { PresentationSemester, UpdatePresentationSemester } from '@/src/types/presentationSemester.type';
import { getSemesterRange, getTodayString, hasSemesterPassed, validateSemesterDate } from '@/src/utils/semesterUtils';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

type PresentationSemesterForm = {
    preevaluationDate: string,
    evaluationDate: string
}

export default function AdminPresentationSemesterScreen() {
    const { id } = useLocalSearchParams();
    const [presentationSemester, setPresentationSemester] = useState<PresentationSemester | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAlertVisible, setIsAlertVisible] = useState(false);
    const [alertProps, setAlertProps] = useState<AlertProps>({
        message: '',
        onDismiss: () => null,
        isVisible: false,
        style: 'error'
    });

    const {
        handleSubmit,
        control,
        formState: { errors },
        setValue,
        getValues,
        trigger
    } = useForm<PresentationSemesterForm>({
        defaultValues: { preevaluationDate: '', evaluationDate: '' }
    });

    useFocusEffect(useCallback(() => {
        setIsLoading(true);
        const fetchPresentationSemester = async () => {
            try {
                const res = await getPresentationSemester(Number(id));
                setPresentationSemester(res.data);
                setValue('preevaluationDate', res.data.preevaluationDate ?? '');
                setValue('evaluationDate', res.data.evaluationDate ?? '');
            }
            catch (e) {
                setPresentationSemester(null);
            }
            finally {
                setIsLoading(false);
            }
        }
        fetchPresentationSemester();
    }, [id]));

    const onSubmit: SubmitHandler<PresentationSemesterForm> = async (data) => {
        if (!presentationSemester) return;

        // Only the dates that changed are sent, a date that already passed can't be resubmitted
        const changes: UpdatePresentationSemester = {};
        if (data.preevaluationDate !== (presentationSemester.preevaluationDate ?? '')) changes.preevaluationDate = data.preevaluationDate;
        if (data.evaluationDate !== (presentationSemester.evaluationDate ?? '')) changes.evaluationDate = data.evaluationDate;

        if (!changes.preevaluationDate && !changes.evaluationDate) {
            setAlertProps({
                message: 'Modifique alguna fecha para poder actualizar',
                onDismiss: () => setIsAlertVisible(false),
                isVisible: true,
                style: 'error'
            });
            setIsAlertVisible(true);
            return;
        }

        setIsLoading(true);
        try {
            const res = await updatePresentationSemester(presentationSemester.id, changes);
            if (res.status === 200) {
                setPresentationSemester(res.data);
                setAlertProps({
                    message: 'Fechas actualizadas',
                    onDismiss: () => setIsAlertVisible(false),
                    isVisible: true,
                    style: 'success'
                });
            }
            else throw new Error('Unable to update presentation semester');
        }
        catch (e: any) {
            const status = e?.response?.status;
            setAlertProps({
                message: status === 409
                    ? 'Este semestre ya pasó y no se puede modificar'
                    : status === 400
                        ? 'Las fechas no son válidas para este semestre'
                        : 'No se pueden actualizar las fechas',
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

    const range = presentationSemester ? getSemesterRange(presentationSemester.semester) : { start: '', end: '' };
    const minimumDate = range.start > getTodayString() ? range.start : getTodayString();
    const isSemesterPassed = !!presentationSemester && hasSemesterPassed(presentationSemester.semester, presentationSemester.evaluationDate);

    return (
        <ScrollView style={styles.screen} contentContainerStyle={{ alignItems: 'center' }}>
            {isLoading && <Loading />}

            {!isLoading && !presentationSemester && <NotFoundItem text='Semestre no encontrado' />}

            {isAlertVisible && <CustomAlert {...alertProps} />}

            {presentationSemester && !isLoading &&
                <View style={styles.container}>
                    <Ionicons name='calendar' size={120} color={Colors.secondary} />
                    <Title text={presentationSemester.semester} />

                    {isSemesterPassed
                        ?
                        <>
                            <Text style={styles.label}>Fecha de preevaluación</Text>
                            <Text style={styles.readOnlyDate}>{presentationSemester.preevaluationDate ?? 'Sin fecha asignada'}</Text>
                            <Text style={styles.label}>Fecha de evaluación</Text>
                            <Text style={styles.readOnlyDate}>{presentationSemester.evaluationDate ?? 'Sin fecha asignada'}</Text>
                            <Text style={styles.formError}>No se pueden modificar semestres anteriores</Text>
                        </>
                        :
                        <>
                            <Text style={styles.hint}>Entre {range.start} y {range.end}</Text>

                            <Text style={styles.label}>Fecha de preevaluación</Text>
                                <>
                                    <Controller
                                        name='preevaluationDate'
                                        control={control}
                                        rules={{
                                            required: 'Introduzca una fecha válida (AAAA-MM-DD)',
                                            validate: value => validateSemesterDate(presentationSemester.semester, value)
                                        }}
                                        render={({ field: { value, onBlur, onChange } }) =>
                                            <DatePickerField
                                                value={value}
                                                onChange={(date) => {
                                                    onChange(date);
                                                    if (getValues('evaluationDate')) trigger('evaluationDate');
                                                }}
                                                onBlur={onBlur}
                                                placeholder='Seleccionar fecha'
                                                minimumDate={minimumDate}
                                                maximumDate={range.end}
                                                title='Fecha de preevaluación'
                                            />
                                        }
                                    />
                                    {errors.preevaluationDate && <Text style={styles.formError}>{errors.preevaluationDate.message}</Text>}
                                </>

                            <Text style={styles.label}>Fecha de evaluación</Text>
                            <Controller
                                name='evaluationDate'
                                control={control}
                                rules={{
                                    required: 'Introduzca una fecha válida (AAAA-MM-DD)',
                                    validate: (value, formValues) => {
                                        const result = validateSemesterDate(presentationSemester.semester, value);
                                        if (result !== true) return result;
                                        if (formValues.preevaluationDate && value <= formValues.preevaluationDate) return 'La evaluación debe ser después de la preevaluación';
                                        return true;
                                    }
                                }}
                                render={({ field: { value, onBlur, onChange } }) =>
                                    <DatePickerField
                                        value={value}
                                        onChange={onChange}
                                        onBlur={onBlur}
                                        placeholder='Seleccionar fecha'
                                        minimumDate={minimumDate}
                                        maximumDate={range.end}
                                        title='Fecha de evaluación'
                                    />
                                }
                            />
                            {errors.evaluationDate && <Text style={styles.formError}>{errors.evaluationDate.message}</Text>}

                            <PrimaryButton text='Actualizar' onPress={handleSubmit(onSubmit)} />
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
    label: {
        alignSelf: 'flex-start',
        marginLeft: '5%',
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.textSecondary,
    },
    hint: {
        alignSelf: 'flex-start',
        marginLeft: '5%',
        fontSize: 14,
        color: Colors.textSecondary,
    },
    readOnlyDate: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.primary,
    },
    formError: {
        fontWeight: 'bold',
        color: Colors.error,
        textAlign: 'center'
    }
});
