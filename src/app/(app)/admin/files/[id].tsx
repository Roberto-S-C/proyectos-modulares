import ConfirmDialog from '@/src/components/ConfirmDialog';
import CustomAlert, { AlertProps } from '@/src/components/CustomAlert';
import Loading from '@/src/components/Loading';
import NotFoundItem from '@/src/components/NotFoundItem';
import PrimaryButton from '@/src/components/PrimaryButton';
import SelectField from '@/src/components/SelectField';
import RoundedOptionButton from '@/src/components/RoundedOptionButton';
import Title from '@/src/components/Title';
import Colors from '@/src/constants/Colors';
import { createTemplateUploadUrl, deleteFileType, getFileTypes, getTemplateFileName, updateFileType } from '@/src/services/fileService';
import { FileType, FormatTypes, UpdateFileType } from '@/src/types/file.type';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as DocumentPicker from 'expo-document-picker';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

// Every project's cover image comes from this file type, so it can't be deleted
const COVER_FILE_TYPE_NAME = 'Portada';

export default function AdminFileTypeScreen() {
    const { id } = useLocalSearchParams();
    const [fileType, setFileType] = useState<FileType | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploadingTemplate, setIsUploadingTemplate] = useState(false);
    const [isDeleteDialogVisible, setIsDeleteDialogVisible] = useState(false);
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

    const fetchFileType = useCallback(async () => {
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
    }, [id]);

    useFocusEffect(useCallback(() => {
        setIsLoading(true);
        fetchFileType().finally(() => setIsLoading(false));
    }, [fetchFileType]));

    const uploadTemplate = async () => {
        if (!fileType || isUploadingTemplate) return;

        let result;
        try {
            result = await DocumentPicker.getDocumentAsync({ copyToCacheDirectory: true });
        }
        catch (e) {
            return;
        }
        if (result.canceled) return;

        const { name, size, mimeType, uri } = result.assets[0];
        if (!name || !size || !mimeType) {
            setAlertProps({
                message: 'No se puede leer el archivo seleccionado',
                onDismiss: () => setIsAlertVisible(false),
                isVisible: true,
                style: 'error'
            });
            setIsAlertVisible(true);
            return;
        }

        setIsUploadingTemplate(true);
        try {
            const uploadUrlRes = await createTemplateUploadUrl(fileType.id, { fileName: name, size, mimeType });
            const uploadUrl = uploadUrlRes?.data;
            if (!uploadUrl) throw new Error('Unable to get an upload url');

            const blob = await fetch(uri).then(res => res.blob());
            const uploadRes = await fetch(uploadUrl, {
                method: 'PUT',
                headers: { 'Content-Type': mimeType },
                body: blob
            });
            if (uploadRes.status !== 200) throw new Error('Unable to upload the template');

            await fetchFileType();
            setAlertProps({
                message: 'Plantilla actualizada',
                onDismiss: () => setIsAlertVisible(false),
                isVisible: true,
                style: 'success'
            });
        }
        catch (e) {
            setAlertProps({
                message: 'No se puede actualizar la plantilla',
                onDismiss: () => setIsAlertVisible(false),
                isVisible: true,
                style: 'error'
            });
        }
        finally {
            setIsUploadingTemplate(false);
            setIsAlertVisible(true);
        }
    }

    const onDelete = async () => {
        if (!fileType) return;

        setIsDeleteDialogVisible(false);
        setIsLoading(true);
        try {
            await deleteFileType(fileType.id);
            setAlertProps({
                message: 'Archivo eliminado',
                // The file type is gone, so go back to the list
                onDismiss: () => {
                    setIsAlertVisible(false);
                    router.back();
                },
                isVisible: true,
                style: 'success'
            });
        }
        catch (e: any) {
            setAlertProps({
                message: e?.response?.status === 409
                    ? 'Este archivo no puede ser eliminado'
                    : 'No se pudo eliminar el archivo',
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

            {!isLoading && !fileType && <NotFoundItem text='Archivo no encontrado' />}

            {isAlertVisible && <CustomAlert {...alertProps} />}

            {fileType && !isLoading &&
                <View style={styles.container}>
                    <Ionicons name='document-sharp' size={120} color={Colors.secondary} />
                    <Title text={fileType.name} />

                    <View style={styles.templateContainer}>

                        <View style={styles.templateButton}>
                            <RoundedOptionButton
                                text='Subir Plantilla'
                                icon='cloud-upload'
                                onPress={uploadTemplate}
                                disabled={isUploadingTemplate}
                            />
                        </View>
                        {fileType.name !== COVER_FILE_TYPE_NAME &&
                            <View style={styles.templateButton}>
                                <RoundedOptionButton
                                    text='Eliminar Archivo'
                                    icon='trash'
                                    onPress={() => setIsDeleteDialogVisible(true)}
                                />
                            </View>
                        }
                        {fileType.url &&
                            <View style={{marginTop: 20}}>
                                <Text style={{fontWeight: "bold", fontSize: 20, color: Colors.primary}}>Plantilla</Text>
                                <Text style={styles.templateFileName}>{getTemplateFileName(fileType.url)}</Text>
                            </View>
                        }
                    </View>


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
                            <SelectField
                                value={value}
                                onChange={onChange}
                                placeholder="Formato"
                                options={Object.entries(FormatTypes).map(([format, label]) => ({ label, value: format }))}
                                style={styles.picker}
                            />
                        }
                    />
                    {errors.format && <Text style={styles.formError}>Seleccione un formato válido</Text>}

                    <PrimaryButton text='Actualizar' onPress={handleSubmit(onSubmit)} />
                </View>
            }

            <ConfirmDialog
                isVisible={isDeleteDialogVisible}
                message='¿Está seguro de que desea eliminar este archivo? Todos los archivos relacionados se eliminarán.'
                variant='danger'
                confirmText='Eliminar'
                onConfirm={onDelete}
                onCancel={() => setIsDeleteDialogVisible(false)}
            />
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
    templateContainer: {
        alignItems: 'center',
        gap: 8,
        width: '90%',
    },
    templateButton: {
        width: '100%',
        height: 48,
    },
    templateFileName: {
        fontSize: 14,
        color: Colors.textSecondary,
    },
    picker: {
        width: '90%',
    },
    formError: {
        fontWeight: 'bold',
        color: Colors.error
    }
});
