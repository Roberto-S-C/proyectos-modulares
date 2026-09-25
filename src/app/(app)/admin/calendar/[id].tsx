import CustomAlert, { AlertProps } from '@/src/components/CustomAlert';
import Loading from '@/src/components/Loading';
import NotFoundItem from '@/src/components/NotFoundItem';
import DatePickerField from '@/src/components/DatePickerField';
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
        setValue
    } = useForm<UpdatePresentationSemester>({
        defaultValues: { date: '' }
    });

    useFocusEffect(useCallback(() => {
        setIsLoading(true);
        const fetchPresentationSemester = async () => {
            try {
                const res = await getPresentationSemester(Number(id));
                setPresentationSemester(res.data);
                setValue('date', res.data.date ?? '');
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

    const onSubmit: SubmitHandler<UpdatePresentationSemester> = async (data) => {
        if (!presentationSemester) return;

        if (data.date === presentationSemester.date) {
            setAlertProps({
                message: 'Modifique la fecha para poder actualizar',
                onDismiss: () => setIsAlertVisible(false),
                isVisible: true,
                style: 'error'
            });
            setIsAlertVisible(true);
            return;
        }

        setIsLoading(true);
        try {
            const res = await updatePresentationSemester(presentationSemester.id, { date: data.date });
            if (res.status === 200) {
                setPresentationSemester(res.data);
                setAlertProps({
                    message: 'Fecha actualizada',
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
                        ? 'La fecha no es válida para este semestre'
                        : 'No se puede actualizar la fecha',
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
        <ScrollView style={styles.screen} contentContainerStyle={{ alignItems: 'center' }}>
            {isLoading && <Loading />}

            {!isLoading && !presentationSemester && <NotFoundItem text='Semestre no encontrado' />}

            {isAlertVisible && <CustomAlert {...alertProps} />}

            {presentationSemester && !isLoading &&
                <View style={styles.container}>
                    <Ionicons name='calendar' size={120} color={Colors.secondary} />
                    <Title text={presentationSemester.semester} />

                    <Text style={styles.label}>Fecha de presentación</Text>

                    {hasSemesterPassed(presentationSemester.semester, presentationSemester.date)
                        ?
                        <>
                            <Text style={styles.readOnlyDate}>{presentationSemester.date ?? 'Sin fecha asignada'}</Text>
                            <Text style={styles.formError}>Este semestre ya pasó, no se puede modificar la fecha</Text>
                        </>
                        :
                        <>
                            <Text style={styles.hint}>
                                Entre {getSemesterRange(presentationSemester.semester).start} y {getSemesterRange(presentationSemester.semester).end}
                            </Text>
                            <Controller
                                name='date'
                                control={control}
                                rules={{
                                    required: 'Introduzca una fecha válida (AAAA-MM-DD)',
                                    validate: value => validateSemesterDate(presentationSemester.semester, value)
                                }}
                                render={({ field: { value, onBlur, onChange } }) =>
                                    <DatePickerField
                                        value={value}
                                        onChange={onChange}
                                        onBlur={onBlur}
                                        placeholder='Seleccionar fecha'
                                        minimumDate={getSemesterRange(presentationSemester.semester).start > getTodayString() ? getSemesterRange(presentationSemester.semester).start : getTodayString()}
                                        maximumDate={getSemesterRange(presentationSemester.semester).end}
                                        title='Fecha de presentación'
                                    />
                                }
                            />
                            {errors.date && <Text style={styles.formError}>{errors.date.message}</Text>}

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
