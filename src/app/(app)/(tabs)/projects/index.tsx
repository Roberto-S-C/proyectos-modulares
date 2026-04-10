import Loading from "@/src/components/Loading";
import NotFoundItem from "@/src/components/NotFoundItem";
import ProjectList from "@/src/components/ProjectList";
import Colors from "@/src/constants/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Picker } from '@react-native-picker/picker';
import axios, { AxiosResponse } from 'axios';
import { useEffect, useState } from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


enum ProjectStatus {
    Review = 'Revisión',
    Rejected = 'Rechazado',
    Approved = 'Aprovado',
}

interface projectImage {
    id: number,
    url: string
}

interface Project {
    id: number,
    name: string,
    status: string,
    presentation_date: string,
    images: projectImage[]
}

async function getProjects(): Promise<Project[] | []> {
    const response: AxiosResponse<Project[]> = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/projects`);
    return response.data;
}

export default function ProjectsScreen() {
    const [projects, setProjects] = useState<Project[] | [] | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        getProjects().then(projects => {
            setProjects(projects);
            setIsLoading(false);
        });
    }, []);

    return (
        <SafeAreaView style={styles.screen}>


            <View style={styles.container}>
                <TextInput
                    style={styles.textInput}
                    placeholder="Nombre Proyecto..."
                // onChangeText={setEmail}
                />

                <View style={styles.filtersContainer}>

                    {/* Date Picker  */}
                    <Picker
                        selectedValue={'Proyecto'}
                        onValueChange={(itemValue) => null}
                        style={styles.picker}
                        selectionColor={Colors.secondary}
                    >
                        <Picker.Item label='2026A' value='' style={styles.pickerItem} />
                        {/* <Picker.Item label={Role.Admin.split('_')[1]} value={Role.Admin} style={styles.pickerItem} /> */}
                        {/* <Picker.Item label={Role.Evaluador.split('_')[1]} value={Role.Evaluador} style={styles.pickerItem} /> */}
                        {/* <Picker.Item label={Role.Alumno.split('_')[1]} value={Role.Alumno} style={styles.pickerItem} /> */}
                        {/* <Picker.Item label={Role.Usuario.split('_')[1]} value={Role.Usuario} style={styles.pickerItem} /> */}
                    </Picker>

                    {/* Status Picker */}
                    <Picker
                        selectedValue={'Proyecto'}
                        onValueChange={(itemValue) => null}
                        style={styles.picker}
                        selectionColor={Colors.secondary}
                    >
                        <Picker.Item label='Estatus' value='' style={styles.pickerItem} />
                        <Picker.Item label={ProjectStatus.Review} value={ProjectStatus.Review} style={styles.pickerItem} />
                        <Picker.Item label={ProjectStatus.Rejected} value={ProjectStatus.Rejected} style={styles.pickerItem} />
                        <Picker.Item label={ProjectStatus.Approved} value={ProjectStatus.Approved} style={styles.pickerItem} />
                    </Picker>

                    <TouchableOpacity onPress={() => null}>
                        <Ionicons name="swap-vertical" size={32} color={true ? Colors.textPrimary : Colors.textSecondary} />
                    </TouchableOpacity>
                </View>

                {isLoading && <Loading />}

                {
                    !isLoading && !projects &&
                    <NotFoundItem text="Proyectos no encontrados" />
                }

                {
                    !isLoading && projects &&
                    <ProjectList projects={projects} />
                }
            </View>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        alignItems: 'center',
    },
    container: {
        flex: 1,
        alignItems: 'stretch',
        gap: 4,
        margin: 8,
        width: '96%',
    },
    textInputContainer: {
        flexDirection: 'row'
    },
    textInput: {
        margin: 16,
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'semibold',
        color: Colors.textSecondary,
        // borderRadius: 8,

        backgroundColor: Colors.itemBackgroundColor,

        // iOS
        shadowColor: Colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 8,

        // Android
        elevation: 4,
    },
    filtersContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: 16,
        gap: 8
    },
    picker: {
        flex: 1,
        alignItems: 'center',
        height: 52,
        color: Colors.textPrimary,
        backgroundColor: Colors.itemBackgroundColor,

        // iOS
        shadowColor: Colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 8,

        // Android
        elevation: 4,
    },
    pickerItem: {
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.textSecondary
    },
    list: {
        flex: 1,
    },
    listContent: {
        padding: 16,
    },
});
