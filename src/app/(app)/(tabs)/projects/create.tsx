import AddMemberListItem from "@/src/components/Account/AddMemberListItem";
import type { AlertProps } from "@/src/components/CustomAlert";
import CustomAlert from "@/src/components/CustomAlert";
import Loading from "@/src/components/Loading";
import ModuleCheckbox from "@/src/components/Module/ModuleCheckbox";
import NotFoundItem from "@/src/components/NotFoundItem";
import RoundedOptionButton from "@/src/components/RoundedOptionButton";
import SemesterPicker from "@/src/components/SemesterPicker";
import Title from "@/src/components/Title";
import Colors from "@/src/constants/Colors";
import { getAvailableAdvisors } from "@/src/services/accountService";
import { getModules } from "@/src/services/moduleService";
import { createProject } from "@/src/services/projectService";
import { Account } from "@/src/types/account.type";
import { Module } from "@/src/types/module.type";
import { CreateProject } from "@/src/types/project.types";
import getPresentationSemesters from "@/src/utils/semesterUtils";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { FlatList, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


export default function CreateProjectScreen() {
    const [modules, setModules] = useState<Module[] | []>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [advisors, setAdvisors] = useState<Account[]>([]);
    const [order, setOrder] = useState(false);
    const [reloadAdvisorList, setReloadAdvisorList] = useState(false);
    const [showSelectAdvisorList, setShowSelectAdvisorList] = useState(false);

    const [isAlertVisible, setIsAlertVisible] = useState(false);
    const [alertProps, setAlertProps] = useState<AlertProps>({
        message: "",
        onDismiss: () => {},
        isVisible: isAlertVisible,
        style: "error"
    });

    const router = useRouter();

    const {
        control,
        getValues,
        handleSubmit,
        trigger,
        reset,
        formState: { errors }
    } = useForm<CreateProject>({
        defaultValues: {
            name: "",
            description: "",
            presentationSemester: undefined,
            modules: [],
            advisorId: ""
        }
    });

    const onSubmit: SubmitHandler<CreateProject> = async (data) => {
        setIsLoading(true);
        try {
            const res = await createProject(data);
            if (res.status === 200) {
                setAlertProps({
                    ...alertProps,
                    message: "Proyecto Creado Exitosamente",
                    onDismiss: () => {
                        setIsAlertVisible(false);
                        router.replace('/(app)/(tabs)')
                    },
                    style: "success"
                })
            }
            else throw new Error("Unable to create Project");
        } catch (e) {
            setAlertProps({
                ...alertProps,
                message: "No se pudo crear el Proyecto",
                onDismiss: () => {
                    setIsAlertVisible(false);
                    router.replace('/(app)/(tabs)')
                },
                style: "error"
            })
        }
        finally {
            setIsLoading(false);
            setIsAlertVisible(true);
        }
    }

    useFocusEffect(
        useCallback(() => {
            reset();
            setShowSelectAdvisorList(false);
            const fetchModules = async () => {
                try {
                    const res = await getModules();
                    if (res.data.length === 0) throw new Error("Error fetching Project Modules");
                    setModules(res.data);
                }
                catch (e) {
                    setIsAlertVisible(true);
                    setAlertProps(prev => ({
                        ...prev,
                        message: "Error al cargar los Módulos",
                    }))
                }
                finally { setIsLoading(false) }
            }
            fetchModules();
        }, [])
    );

    useEffect(() => {
        if (!showSelectAdvisorList) return;
        const fetchAdvisors = async () => {
            setIsLoading(true);
            const presentationSemester = getValues("presentationSemester");
            try {
                const res = await getAvailableAdvisors(presentationSemester);
                setAdvisors(res.data);
                if (res.data.length === 0) throw new Error("Error fetching Advisors");
            }
            catch (e) {
                setIsAlertVisible(true);
                setAlertProps(prev => ({
                    ...prev,
                    message: `Asesores no disponibles en ${presentationSemester}`,
                    onDismiss: () => {
                        setShowSelectAdvisorList(false);
                        setIsAlertVisible(false);
                    }
                }))
            }
            finally { setIsLoading(false) }
        }
        fetchAdvisors();
    }, [showSelectAdvisorList, reloadAdvisorList]);

    // Sort Advisors advisors Alphabetically
    useEffect(() => {
        const sortedadvisors = [...advisors].sort((a, b) => {
            if (a.name < b.name) return order ? -1 : 1;
            if (a.name > b.name) return order ? 1 : -1;
            return 0;
        });

        setAdvisors(sortedadvisors);
    }, [order])

    return (
        <SafeAreaView style={styles.screen}>

            {isLoading && <Loading />}

            {!isLoading && isAlertVisible &&
                <CustomAlert  {...alertProps} isVisible={isAlertVisible} />
            }

            {!showSelectAdvisorList && !isLoading &&
                <ScrollView contentContainerStyle={{ alignItems: "center" }} >
                    <View style={styles.container}>
                        <Title text="Crear Proyecto" />

                        <Controller
                            control={control}
                            rules={{ required: true, max: 100 }}
                            name="name"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <View>
                                    <Text style={styles.inputLabel}>Nombre Proyecto</Text>
                                    <TextInput
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                        maxLength={70}
                                        placeholder="Nombre"
                                        style={styles.input}
                                    />
                                    {errors.name && <Text style={styles.error}>* Campo requerido</Text>}
                                </View>
                            )}
                        />

                        <Controller
                            control={control}
                            rules={{ required: true, max: 500 }}
                            name="description"
                            render={({ field: { onChange, onBlur, value } }) => (
                                < View style={styles.section}>
                                    <Text style={styles.inputLabel}>Descripción Proyecto</Text>
                                    <TextInput
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                        maxLength={600}
                                        placeholder="Descripción"
                                        multiline={true}
                                        numberOfLines={4}
                                        style={[styles.input, styles.textArea]}
                                    />
                                    {errors.description && <Text style={styles.error}>* Campo requerido</Text>}
                                </View>
                            )}
                        />

                        <Controller
                            control={control}
                            name="presentationSemester"
                            rules={{ required: true }}
                            render={({ field }) =>
                                <View style={styles.section}>
                                    <Text style={styles.inputLabel}>Semestre de presentación</Text>
                                    <SemesterPicker value={field.value} onChange={field.onChange}  semesters={getPresentationSemesters()} />
                                    {errors.presentationSemester && <Text style={styles.error}>* Campo requerido</Text>}
                                </View>
                            }
                        />

                        <Controller
                            control={control}
                            name="modules"
                            rules={{
                                validate: (value) => value.length > 0 || "Selecciona al menos un módulo"
                            }}
                            render={({ field }) =>
                                <View style={styles.section}>
                                    <Text style={styles.inputLabel}>Módulos</Text>
                                    {modules.length > 0 &&
                                        <FlatList
                                            data={modules}
                                            renderItem={({ item }) =>
                                                <ModuleCheckbox
                                                    id={item.id}
                                                    name={item.name}
                                                    selectedModulesId={field.value}
                                                    onChange={field.onChange}
                                                />
                                            }
                                            keyExtractor={item => item.id}
                                            contentContainerStyle={{ gap: 16 }}
                                            scrollEnabled={false}
                                        />
                                    }
                                    {errors.modules && <Text style={styles.error}>* {errors.modules.message}</Text>}
                                </View>
                            }
                        />

                        <View>
                            <RoundedOptionButton text="Continuar" icon="" onPress={async () => {
                                const valid = await trigger(["name", "description", "presentationSemester", "modules"]);
                                if (valid) setShowSelectAdvisorList(true);
                            }} />
                        </View>

                    </View>
                </ScrollView >
            }

            {showSelectAdvisorList && !isLoading && advisors.length === 0 &&
                <NotFoundItem text="No hay Asesores disponibles" />
            }

            {showSelectAdvisorList && !isLoading && advisors.length > 0 &&
                <View style={styles.advisorList}>
                    <Title text="Asesor de Proyecto" />
                    <Controller
                        control={control}
                        name="advisorId"
                        rules={{ required: true }}
                        render={({ field }) =>
                            <FlatList
                                data={advisors}
                                renderItem={({ item }) => <AddMemberListItem account={item} selectedAccountId={field.value} setSelectedAccountId={field.onChange} />}
                                keyExtractor={item => item.id}
                                contentContainerStyle={styles.listContent}
                                ListHeaderComponent={() =>
                                    <View style={styles.listHeader}>
                                        <TouchableOpacity onPress={() => setOrder(!order)}>
                                            <Ionicons name="swap-vertical" size={36} color={order ? Colors.textPrimary : Colors.textSecondary} />
                                        </TouchableOpacity>

                                        <TouchableOpacity onPress={() => setReloadAdvisorList(!reloadAdvisorList)}>
                                            <Ionicons name="reload" size={36} color={Colors.textPrimary} />
                                        </TouchableOpacity>
                                    </View>
                                }
                                ListFooterComponent={() =>
                                    <View>
                                        {errors.advisorId && <Text style={styles.error}>* Selecciona un Asesor de Proyecto</Text>}
                                        <View style={styles.listFooter}>
                                            <RoundedOptionButton text="Regresar" icon="" onPress={() => setShowSelectAdvisorList(false)} />
                                            <RoundedOptionButton text="Continuar" icon="" onPress={handleSubmit(onSubmit)} />
                                        </View>
                                    </View>
                                }
                            />
                        } />
                </View>
            }
        </SafeAreaView >
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
    },
    container: {
        width: '90%',
        gap: 20
    },
    advisorList: {
        flex: 1,
    },
    section: {
        marginTop: 4
    },
    inputLabel: {
        color: Colors.secondary,
        fontWeight: 'bold',
        fontSize: 20
    },
    input: {
        borderWidth: 1,
        borderRadius: 10,
        color: Colors.border
    },
    textArea: {
        height: 150,
        justifyContent: "flex-start",
        textAlignVertical: 'top'
    },
    error: {
        fontSize: 14,
        fontStyle: "italic",
        color: Colors.error
    },
    filtersContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: 16,
        gap: 8
    },
    list: {
        flex: 1,
    },
    listContent: {
        padding: 16,
    },
    listHeader: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 16
    },
    listFooter: {
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'space-evenly',
        marginTop: 8
    }
});