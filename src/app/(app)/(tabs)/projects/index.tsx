import Loading from "@/src/components/Loading";
import NotFoundItem from "@/src/components/NotFoundItem";
import ProjectList from "@/src/components/Project/ProjectList";
import Colors from "@/src/constants/Colors";
import { getPresentationSemesters } from "@/src/services/presentationSemesterService";
import { getProjects } from "@/src/services/projectService";
import { PresentationSemester } from "@/src/types/presentationSemester.type";
import { Project, ProjectStatus } from "@/src/types/project.types";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Picker } from '@react-native-picker/picker';
import { useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const STATUS_OPTIONS: ProjectStatus[] = ["REVISION", "APROVADO", "RECHAZADO", "CONDICIONADO", "NP", "COMPLETADO"];

// Semester codes are "YYYY" + "A"/"B" (e.g. "2026A"), so order chronologically by year first,
// then by the half-year letter.
const compareSemesters = (a: PresentationSemester, b: PresentationSemester) => {
    const yearA = parseInt(a.semester.slice(0, 4), 10);
    const yearB = parseInt(b.semester.slice(0, 4), 10);
    if (yearA !== yearB) return yearA - yearB;
    return a.semester.slice(4).localeCompare(b.semester.slice(4));
};

export default function ProjectsScreen() {
    const [projects, setProjects] = useState<Project[] | [] | null>(null);
    const [semesters, setSemesters] = useState<PresentationSemester[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [nameFilter, setNameFilter] = useState('');
    const [semesterFilter, setSemesterFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [sortAscending, setSortAscending] = useState(true);

    useFocusEffect(
        useCallback(() => {
            setIsLoading(true);
            getProjects()
                .then(res => {
                    setProjects(res.data);
                })
                .catch(e => {
                    console.log(e);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }, [])
    );

    useFocusEffect(
        useCallback(() => {
            getPresentationSemesters()
                .then(res => {
                    if (res.status === 200 && res.data) setSemesters(res.data);
                })
                .catch(e => {
                    console.log(e);
                });
        }, [])
    );

    const filteredProjects = useMemo(() => {
        if (!projects) return projects;

        const normalizedName = nameFilter.trim().toLowerCase();

        const filtered = projects.filter(project =>
            (normalizedName === '' || project.name.toLowerCase().includes(normalizedName)) &&
            (semesterFilter === '' || project.presentationSemester === semesterFilter) &&
            (statusFilter === '' || project.status === statusFilter)
        );

        return [...filtered].sort((a, b) =>
            sortAscending ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
        );
    }, [projects, nameFilter, semesterFilter, statusFilter, sortAscending]);

    return (
        <SafeAreaView style={styles.screen}>
            <View style={styles.container}>
                <TextInput
                    style={styles.textInput}
                    placeholder="Nombre Proyecto..."
                    value={nameFilter}
                    onChangeText={setNameFilter}
                />

                <View style={styles.filtersContainer}>

                    <Picker
                        selectedValue={semesterFilter}
                        onValueChange={setSemesterFilter}
                        style={styles.picker}
                        selectionColor={Colors.secondary}
                    >
                        <Picker.Item label='Semestre' value='' style={styles.pickerItem} />
                        {[...semesters].sort(compareSemesters).map(semester =>
                            <Picker.Item key={semester.id} label={semester.semester} value={semester.semester} style={styles.pickerItem} />
                        )}
                    </Picker>

                    <Picker
                        selectedValue={statusFilter}
                        onValueChange={setStatusFilter}
                        style={styles.picker}
                        selectionColor={Colors.secondary}
                    >
                        <Picker.Item label='Estatus' value='' style={styles.pickerItem} />
                        {STATUS_OPTIONS.map(status =>
                            <Picker.Item key={status} label={status} value={status} style={styles.pickerItem} />
                        )}
                    </Picker>

                    <TouchableOpacity onPress={() => setSortAscending(prev => !prev)}>
                        <Ionicons
                            name="swap-vertical"
                            size={32}
                            color={sortAscending ? Colors.textPrimary : Colors.textSecondary}
                        />
                    </TouchableOpacity>
                </View>

                {isLoading && <Loading />}

                {
                    !isLoading && !filteredProjects &&
                    <NotFoundItem text="Proyectos no encontrados" />
                }

                {
                    !isLoading && filteredProjects &&
                    <ProjectList projects={filteredProjects} />
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
        gap: 8,
        marginBottom: 16
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
