import CustomAlert, { AlertProps } from '@/src/components/CustomAlert';
import Loading from '@/src/components/Loading';
import NotFoundItem from '@/src/components/NotFoundItem';
import PrimaryButton from '@/src/components/PrimaryButton';
import Colors from '@/src/constants/Colors';
import { getProject, updateProject } from '@/src/services/projectService';
import { Project, UpdateProject } from '@/src/types/project.types';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Image, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';


interface FormInputs {
    name: string,
    description: string
}

export default function ProjectDescriptionScreen() {
    const { id } = useLocalSearchParams();
    const [project, setProject] = useState<Project | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAlertVisible, setIsAlertVisible] = useState(false);
    const [alertProps, setAlertProps] = useState<AlertProps>({
        message: '',
        onDismiss: () => null,
        isVisible: isAlertVisible,
        style: 'error'
    });

    const router = useRouter();

    useFocusEffect(useCallback(() => {
        setIsLoading(true);
        const fetchProject = async () => {
            try {
                const res = await getProject(parseInt(id.toString()));
                if (res.status === 200) {
                    setProject(res.data);
                    setValue("name", res.data.name);
                    setValue("description", res.data.description);
                    return;
                }
                throw new Error(`Error while fetching project ${id}`)
            }
            catch (e) {
                setIsAlertVisible(true);
                setAlertProps({
                    message: 'Proyecto no disponible',
                    onDismiss: () => {
                        setIsAlertVisible(false);
                        router.replace('/(app)/(tabs)');
                    },
                    isVisible: isAlertVisible,
                    style: 'error'
                });
            }
            finally {
                setIsLoading(false);
            }
        }
        fetchProject();
    }, [id]))

    const {
        handleSubmit,
        control,
        formState: { errors },
        setValue
    } = useForm<FormInputs>({
        defaultValues: {
            name: project?.name,
            description: project?.description
        }
    });

    const onSubmit: SubmitHandler<UpdateProject> = async (data) => {
        if (data.name === project?.name && data.description === project?.description) {
            setAlertProps({
                message: 'Modifique la información para poder actualizar',
                onDismiss: () => setIsAlertVisible(false),
                isVisible: isAlertVisible,
                style: 'error'
            });
            setIsAlertVisible(true);
            return;
        }
        if (project) {
            setIsLoading(true);
            try {
                const res = await updateProject(project.id, { name: data.name, description: data.description });
                console.log(res)
                if (res.status === 200) {
                    setAlertProps({
                        message: 'Proyecto actualizado',
                        onDismiss: () => {
                            setIsAlertVisible(false);
                            router.replace('/(app)/(tabs)');
                        },
                        isVisible: isAlertVisible,
                        style: 'success'
                    });
                }
            }
            catch (e) {
                setAlertProps({
                    message: 'No se puede actualizar el Proyecto',
                    onDismiss: () => {
                        setIsAlertVisible(false);
                    },
                    isVisible: isAlertVisible,
                    style: 'error'
                });
            }
            finally {
                setIsLoading(false);
                setIsAlertVisible(true);
            }
        }
    }


    return (
        <ScrollView style={styles.screen} contentContainerStyle={{ alignItems: 'center' }}>
            {isLoading && <Loading />}

            {!isLoading && !project && <NotFoundItem text='Proyecto no disponible' />}

            {isAlertVisible && <CustomAlert {...alertProps} />}

            {project && !isLoading &&
                <View style={styles.container}>
                    <Image source={{ uri: `${process.env.EXPO_PUBLIC_CDN_DOMAIN}/${project.coverImageUrl}` }} style={styles.image} />
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
                                style={styles.projectName}
                            />
                        }
                    />
                    {errors.name && errors.name.type === "required"
                        && <Text style={styles.formError}>Introduzca una nombre válido</Text>}
                    {errors.description && errors.description.type === "maxLength"
                        && <Text style={styles.formError}>El nombre del proyecto debe tener menos de 100 caracteres</Text>}

                    <Controller
                        name='description'
                        control={control}
                        rules={{ required: true, maxLength: 500 }}
                        render={({ field: { value, onBlur, onChange } }) =>
                            <TextInput
                                multiline
                                numberOfLines={4}
                                placeholder='Descripción...'
                                onChangeText={onChange}
                                value={value}
                                onBlur={onBlur}
                                style={styles.description}
                            />
                        }
                    />
                    {errors.description && errors.description.type === "required"
                        && <Text style={styles.formError}>Introduzca una descripción válida</Text>}
                    {errors.description && errors.description.type === "maxLength"
                        && <Text style={styles.formError}>La descripción debe tener menos de 500 caracteres</Text>}

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
    image: {
        width: 300,
        height: 300
    },
    projectName: {
        flex: 1,
        textAlign: 'justify',
        textAlignVertical: 'top',
        fontSize: 16,
        color: Colors.textPrimary,
        borderWidth: 1,
        width: '90%',
        borderColor: Colors.border,
        borderRadius: 10,
        padding: 10
    },
    description: {
        flex: 1,
        textAlign: 'justify',
        textAlignVertical: 'top',
        fontSize: 16,
        color: Colors.textSecondary,
        borderWidth: 1,
        height: 200,
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