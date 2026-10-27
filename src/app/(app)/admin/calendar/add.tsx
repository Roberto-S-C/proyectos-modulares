import CustomAlert, { AlertProps } from '@/src/components/CustomAlert';
import DatePickerField from '@/src/components/DatePickerField';
import Loading from '@/src/components/Loading';
import PrimaryButton from '@/src/components/PrimaryButton';
import SelectField from '@/src/components/SelectField';
import Colors from '@/src/constants/Colors';
import { createPresentationSemester, getPresentationSemesters } from '@/src/services/presentationSemesterService';
import { CreatePresentationSemester, PresentationSemester } from '@/src/types/presentationSemester.type';
import { generateFutureSemesters, getSemesterRange, getTodayString, validateSemesterDate } from '@/src/utils/semesterUtils';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function AdminAddPresentationSemesterScreen() {
    const [availableSemesters, setAvailableSemesters] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAlertVisible, setIsAlertVisible] = useState(false);
    const [alertProps, setAlertProps] = useState<AlertProps>({
        message: '',
        onDismiss: () => null,
        isVisible: false,
        style: 'error'
    });

    const router = useRouter();

    const {
        handleSubmit,
        control,
        watch,
        getValues,
        formState: { errors },
        setValue,
        trigger
    } = useForm<CreatePresentationSemester>({
        defaultValues: { semester: '', preevaluationDate: '', evaluationDate: '' }
    });

    const selectedSemester = watch('semester');

    useFocusEffect(useCallback(() => {
        setIsLoading(true);
        const fetchAvailableSemesters = async () => {
            try {
                const res = await getPresentationSemesters();
                const existing = new Set<string>(res.data.map((item: PresentationSemester) => item.semester));
                const available = generateFutureSemesters().filter(semester => !existing.has(semester));
                setAvailableSemesters(available);
                setValue('semester', available[0] ?? '');
            }
            catch (e) {
                setAvailableSemesters([]);
            }
            finally {
                setIsLoading(false);
            }
        }
        fetchAvailableSemesters();
    }, []));

    const onSubmit: SubmitHandler<CreatePresentationSemester> = async (data) => {
        setIsLoading(true);
        try {
            const res = await createPresentationSemester({ semester: data.semester, preevaluationDate: data.preevaluationDate, evaluationDate: data.evaluationDate });
            if (res.status === 200) {
                setAlertProps({
                    message: 'Semestre añadido',
                    onDismiss: () => {
                        setIsAlertVisible(false);
                        router.back();
                    },
                    isVisible: true,
                    style: 'success'
                });
            }
            else throw new Error('Unable to create presentation semester');
        }
        catch (e: any) {
            const status = e?.response?.status;
            setAlertProps({
                message: status === 409
                    ? 'El semestre ya existe'
                    : status === 400
                        ? 'El semestre o las fechas no son válidos'
                        : 'No se puede añadir el semestre',
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

    const range = selectedSemester ? getSemesterRange(selectedSemester) : null;
    const minimumDate = range ? (range.start > getTodayString() ? range.start : getTodayString()) : undefined;

    return (
        <ScrollView style={styles.screen} contentContainerStyle={{ alignItems: 'center' }}>
            {isLoading && <Loading />}

            {isAlertVisible && <CustomAlert {...alertProps} />}

            {!isLoading &&
                <View style={styles.container}>
                    <Ionicons name='calendar' size={120} color={Colors.secondary} />

                    <Text style={styles.label}>Semestre</Text>
                    <Controller
                        name='semester'
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { value, onChange } }) =>
                            <SelectField
                                value={value}
                                onChange={(semester) => {
                                    onChange(semester);
                                    if (getValues('preevaluationDate')) trigger('preevaluationDate');
                                    if (getValues('evaluationDate')) trigger('evaluationDate');
                                }}
                                placeholder="Semestre"
                                options={availableSemesters.map(semester => ({ label: semester, value: semester }))}
                                style={styles.picker}
                            />
                        }
                    />
                    {errors.semester && <Text style={styles.formError}>Seleccione un semestre válido</Text>}

                    <Text style={styles.label}>Fecha de preevaluación</Text>
                    {range && <Text style={styles.hint}>Entre {range.start} y {range.end}</Text>}
                    <Controller
                        name='preevaluationDate'
                        control={control}
                        rules={{
                            required: 'Introduzca una fecha válida (AAAA-MM-DD)',
                            validate: (value, formValues) => validateSemesterDate(formValues.semester, value)
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
                                maximumDate={range?.end}
                                title='Fecha de preevaluación'
                            />
                        }
                    />
                    {errors.preevaluationDate && <Text style={styles.formError}>{errors.preevaluationDate.message}</Text>}

                    <Text style={styles.label}>Fecha de evaluación</Text>
                    {range && <Text style={styles.hint}>Después de la preevaluación</Text>}
                    {range && <Text style={styles.hint}>Antes de {range.end}</Text>}
                    <Controller
                        name='evaluationDate'
                        control={control}
                        rules={{
                            required: 'Introduzca una fecha válida (AAAA-MM-DD)',
                            validate: (value, formValues) => {
                                const result = validateSemesterDate(formValues.semester, value);
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
                                maximumDate={range?.end}
                                title='Fecha de evaluación'
                            />
                        }
                    />
                    {errors.evaluationDate && <Text style={styles.formError}>{errors.evaluationDate.message}</Text>}

                    <PrimaryButton text='Añadir' onPress={handleSubmit(onSubmit)} />
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
    picker: {
        width: '90%',
    },
    formError: {
        fontWeight: 'bold',
        color: Colors.error,
        textAlign: 'center'
    }
});
