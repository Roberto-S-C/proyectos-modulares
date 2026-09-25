import CustomAlert, { AlertProps } from '@/src/components/CustomAlert';
import Loading from '@/src/components/Loading';
import DatePickerField from '@/src/components/DatePickerField';
import PrimaryButton from '@/src/components/PrimaryButton';
import Colors from '@/src/constants/Colors';
import { createPresentationSemester, getPresentationSemesters } from '@/src/services/presentationSemesterService';
import { CreatePresentationSemester, PresentationSemester } from '@/src/types/presentationSemester.type';
import { generateFutureSemesters, getSemesterRange, getTodayString, validateSemesterDate } from '@/src/utils/semesterUtils';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Picker } from '@react-native-picker/picker';
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
        defaultValues: { semester: '', date: '' }
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
            const res = await createPresentationSemester({ semester: data.semester, date: data.date });
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
                        ? 'El semestre o la fecha no son válidos'
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
                            <View style={styles.pickerContainer}>
                                <Picker
                                    selectedValue={value}
                                    onValueChange={(semester) => {
                                        onChange(semester);
                                        if (getValues('date')) trigger('date');
                                    }}
                                    style={styles.picker}
                                >
                                    {availableSemesters.map(semester =>
                                        <Picker.Item key={semester} label={semester} value={semester} />
                                    )}
                                </Picker>
                            </View>
                        }
                    />
                    {errors.semester && <Text style={styles.formError}>Seleccione un semestre válido</Text>}

                    <Text style={styles.label}>Fecha de presentación</Text>
                    {range && <Text style={styles.hint}>Entre {range.start} y {range.end}</Text>}
                    <Controller
                        name='date'
                        control={control}
                        rules={{
                            required: 'Introduzca una fecha válida (AAAA-MM-DD)',
                            validate: (value, formValues) => validateSemesterDate(formValues.semester, value)
                        }}
                        render={({ field: { value, onBlur, onChange } }) =>
                            <DatePickerField
                                value={value}
                                onChange={onChange}
                                onBlur={onBlur}
                                placeholder='Seleccionar fecha'
                                minimumDate={range ? (range.start > getTodayString() ? range.start : getTodayString()) : undefined}
                                maximumDate={range?.end}
                                title='Fecha de presentación'
                            />
                        }
                    />
                    {errors.date && <Text style={styles.formError}>{errors.date.message}</Text>}

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
    pickerContainer: {
        width: '90%',
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: 10,
        overflow: 'hidden'
    },
    picker: {
        fontWeight: 'bold',
        color: Colors.primary
    },
    formError: {
        fontWeight: 'bold',
        color: Colors.error,
        textAlign: 'center'
    }
});
