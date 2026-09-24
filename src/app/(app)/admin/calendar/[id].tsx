import CustomAlert, { AlertProps } from '@/src/components/CustomAlert';
import Loading from '@/src/components/Loading';
import NotFoundItem from '@/src/components/NotFoundItem';
import PrimaryButton from '@/src/components/PrimaryButton';
import Title from '@/src/components/Title';
import Colors from '@/src/constants/Colors';
import { getPresentationSemester, updatePresentationSemester } from '@/src/services/presentationSemesterService';
import { PresentationSemester, UpdatePresentationSemester } from '@/src/types/presentationSemester.type';
import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

const isValidDate = (value: string) => {
    if (!DATE_PATTERN.test(value)) return false;
    const parsed = new Date(`${value}T00:00:00Z`);
    return !isNaN(parsed.getTime()) && parsed.toISOString().startsWith(value);
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
        catch (e) {
            setAlertProps({
                message: 'No se puede actualizar la fecha',
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
                    <Title text={presentationSemester.semester} />

                    <Text style={styles.label}>Fecha de presentación</Text>
                    <Controller
                        name='date'
                        control={control}
                        rules={{ required: true, validate: isValidDate }}
                        render={({ field: { value, onBlur, onChange } }) =>
                            <TextInput
                                numberOfLines={1}
                                placeholder='AAAA-MM-DD'
                                onChangeText={onChange}
                                value={value}
                                onBlur={onBlur}
                                style={styles.dateInput}
                            />
                        }
                    />
                    {errors.date && <Text style={styles.formError}>Introduzca una fecha válida (AAAA-MM-DD)</Text>}

                    <PrimaryButton text='Actualizar' onPress={handleSubmit(onSubmit)} />
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
    dateInput: {
        fontSize: 16,
        color: Colors.textPrimary,
        borderWidth: 1,
        width: '90%',
        borderColor: Colors.border,
        borderRadius: 10,
        padding: 10
    },
    formError: {
        fontWeight: 'bold',
        color: Colors.error
    }
});
