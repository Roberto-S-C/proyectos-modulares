import CustomAlert, { AlertProps } from '@/src/components/CustomAlert';
import Loading from '@/src/components/Loading';
import NotFoundItem from '@/src/components/NotFoundItem';
import PrimaryButton from '@/src/components/PrimaryButton';
import Title from '@/src/components/Title';
import Colors from '@/src/constants/Colors';
import { getFileTypes, updateFileType } from '@/src/services/fileService';
import { FileType, FormatTypes, UpdateFileType } from '@/src/types/file.type';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Picker } from '@react-native-picker/picker';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

export default function AdminFileTypeScreen() {
    const { id } = useLocalSearchParams();
    const [fileType, setFileType] = useState<FileType | null>(null);
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
        formState: { errors },
        setValue
    } = useForm<UpdateFileType>({
        defaultValues: { name: '', format: '' }
    });

    useFocusEffect(useCallback(() => {
        setIsLoading(true);
        const fetchFileType = async () => {
            try {
                const res = await getFileTypes();
                const found: FileType | undefined = res.data.find((item: FileType) => item.id === Number(id));
                if (found) {
                    setFileType(found);
                    setValue('name', found.name);
                    setValue('format', found.format);
                }
                else {
                    setFileType(null);
                }
            }
            catch (e) {
                setFileType(null);
            }
            finally {
                setIsLoading(false);
            }
        }
        fetchFileType();
    }, [id]));

    const onSubmit: SubmitHandler<UpdateFileType> = async (data) => {
        if (!fileType) return;

        if (data.name === fileType.name && data.format === fileType.format) {
            setAlertProps({
                message: 'Modifique la información para poder actualizar',
                onDismiss: () => setIsAlertVisible(false),
                isVisible: true,
                style: 'error'
            });
            setIsAlertVisible(true);
            return;
        }

        setIsLoading(true);
        try {
            const res = await updateFileType(fileType.id, { name: data.name, format: data.format });
            if (res.status === 200) {
                setAlertProps({
                    message: 'Archivo actualizado',
                    onDismiss: () => {
                        setIsAlertVisible(false);
                        router.back();
                    },
                    isVisible: true,
                    style: 'success'
                });
            }
            else throw new Error('Unable to update file type');
        }
        catch (e) {
            setAlertProps({
                message: 'No se puede actualizar el tipo de archivo',
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

            {!isLoading && !fileType && <NotFoundItem text='Tipo de archivo no encontrado' />}

            {isAlertVisible && <CustomAlert {...alertProps} />}

            {fileType && !isLoading &&
                <View style={styles.container}>
                    <Ionicons name='document-sharp' size={120} color={Colors.secondary} />
                    <Title text={fileType.name} />
                    <Controller
                        name='name'
                        control={control}
                        rules={{ required: true, maxLength: 100 }}
                        render={({ field: { value, onBlur, onChange } }) =>
                            <TextInput
                                numberOfLines={1}
                                placeholder='Nombre...'
                                onChangeText={onChange}
                                value={value}
                                onBlur={onBlur}
                                style={styles.name}
                            />
                        }
                    />
                    {errors.name && errors.name.type === 'required'
                        && <Text style={styles.formError}>Introduzca un nombre válido</Text>}
                    {errors.name && errors.name.type === 'maxLength'
                        && <Text style={styles.formError}>El nombre debe tener menos de 100 caracteres</Text>}

                    <Controller
                        name='format'
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { value, onChange } }) =>
                            <View style={styles.pickerContainer}>
                                <Picker
                                    selectedValue={value}
                                    onValueChange={onChange}
                                    style={styles.picker}
                                >
                                    {Object.entries(FormatTypes).map(([format, label]) =>
                                        <Picker.Item key={format} label={label} value={format} />
                                    )}
                                </Picker>
                            </View>
                        }
                    />
                    {errors.format && <Text style={styles.formError}>Seleccione un formato válido</Text>}

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
    name: {
        textAlign: 'justify',
        fontSize: 16,
        color: Colors.textPrimary,
        borderWidth: 1,
        width: '90%',
        borderColor: Colors.border,
        borderRadius: 10,
        padding: 10
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
        color: Colors.error
    }
});
