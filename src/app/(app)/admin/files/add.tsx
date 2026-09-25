import CustomAlert, { AlertProps } from '@/src/components/CustomAlert';
import Loading from '@/src/components/Loading';
import PrimaryButton from '@/src/components/PrimaryButton';
import Colors from '@/src/constants/Colors';
import { createFileType } from '@/src/services/fileService';
import { CreateFileType, FormatTypes } from '@/src/types/file.type';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

export default function AdminAddFileTypeScreen() {
    const [isLoading, setIsLoading] = useState(false);
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
        formState: { errors }
    } = useForm<CreateFileType>({
        defaultValues: { name: '', format: Object.keys(FormatTypes)[0] }
    });

    const onSubmit: SubmitHandler<CreateFileType> = async (data) => {
        setIsLoading(true);
        try {
            const res = await createFileType({ name: data.name.trim(), format: data.format });
            if (res.status === 200) {
                setAlertProps({
                    message: 'Archivo añadido',
                    onDismiss: () => {
                        setIsAlertVisible(false);
                        router.back();
                    },
                    isVisible: true,
                    style: 'success'
                });
            }
            else throw new Error('Unable to create file type');
        }
        catch (e: any) {
            setAlertProps({
                message: e?.response?.status === 409
                    ? 'Ya existe un archivo con ese nombre'
                    : 'No se puede añadir el archivo',
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

            {isAlertVisible && <CustomAlert {...alertProps} />}

            {!isLoading &&
                <View style={styles.container}>
                    <Ionicons name='document-sharp' size={120} color={Colors.secondary} />

                    <Controller
                        name='name'
                        control={control}
                        rules={{
                            required: true,
                            maxLength: 100,
                            validate: value => value.trim().length > 0
                        }}
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
                    {errors.name && (errors.name.type === 'required' || errors.name.type === 'validate')
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
