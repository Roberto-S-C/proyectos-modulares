import PrimaryButton from "@/src/components/PrimaryButton";
import ProjectSelectListItem from "@/src/components/Project/ProjectSelectListItem";
import Colors from "@/src/constants/Colors";
import { getPresentationSemesters } from "@/src/services/presentationSemesterService";
import { getAllProjects } from "@/src/services/projectService";
import { PresentationSemester } from "@/src/types/presentationSemester.type";
import { Project, ProjectStatus } from "@/src/types/project.types";
import { sortSemesters } from "@/src/utils/semesterUtils";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Picker } from "@react-native-picker/picker";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, FlatList, KeyboardAvoidingView, Modal, Platform, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface Props {
    isVisible: boolean,
    selected: Project[],
    onConfirm: (projects: Project[]) => void,
    onClose: () => void,
}

const STATUS_OPTIONS: ProjectStatus[] = ["REVISION", "APROVADO", "RECHAZADO", "CONDICIONADO", "NP", "COMPLETADO", "ATRASADO"];

/**
 * Bottom sheet listing every project, filterable by name, semester and status, to select
 * several. Like AccountsSelectSheet, it edits a draft copy of `selected`: only "Confirmar" hands
 * it back, closing it any other way discards the changes.
 */
export default function ProjectsSelectSheet({ isVisible, selected, onConfirm, onClose }: Props) {
    const [draft, setDraft] = useState<Project[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [semesters, setSemesters] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const [nameFilter, setNameFilter] = useState("");
    const [semesterFilter, setSemesterFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [sortAscending, setSortAscending] = useState(true);

    const insets = useSafeAreaInsets();

    // Starts from the current selection and no filters, and reloads the projects, every time it opens
    useEffect(() => {
        if (!isVisible) return;

        setDraft(selected);
        setNameFilter("");
        setSemesterFilter("");
        setStatusFilter("");

        const fetchProjects = async () => {
            setIsLoading(true);
            try {
                const [projectsRes, semestersRes] = await Promise.all([getAllProjects(), getPresentationSemesters()]);
                setProjects(projectsRes.data ?? []);
                const semesterCodes = (semestersRes.data ?? []).map((semester: PresentationSemester) => semester.semester);
                setSemesters(sortSemesters(semesterCodes));
            }
            catch (e) {
                setProjects([]);
            }
            finally {
                setIsLoading(false);
            }
        }
        fetchProjects();
    }, [isVisible]);

    const filteredProjects = useMemo(() => {
        const normalizedName = nameFilter.trim().toLowerCase();

        const filtered = projects.filter(project =>
            (normalizedName === "" || project.name.toLowerCase().includes(normalizedName)) &&
            (semesterFilter === "" || project.presentationSemester === semesterFilter) &&
            (statusFilter === "" || project.status === statusFilter)
        );

        return [...filtered].sort((a, b) =>
            sortAscending ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
        );
    }, [projects, nameFilter, semesterFilter, statusFilter, sortAscending]);

    const isInDraft = (project: Project) => draft.some(selectedProject => selectedProject.id === project.id);

    const toggleProject = (project: Project) => {
        setDraft(previous => previous.some(selectedProject => selectedProject.id === project.id)
            ? previous.filter(selectedProject => selectedProject.id !== project.id)
            : [...previous, project]);
    }

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}
            statusBarTranslucent={true}
            navigationBarTranslucent={true}
        >
            <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === "ios" ? "padding" : undefined}>
                <Pressable style={styles.backdrop} onPress={onClose} />

                <View style={[styles.sheet, { paddingBottom: insets.bottom + 16 }]}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Seleccionar proyectos</Text>
                        <Pressable onPress={onClose} style={styles.closeButton}>
                            <Ionicons name="close" size={28} color={Colors.textSecondary} />
                        </Pressable>
                    </View>

                    <TextInput
                        style={styles.input}
                        placeholder="Nombre Proyecto..."
                        value={nameFilter}
                        onChangeText={setNameFilter}
                    />

                    <View style={styles.filters}>
                        <View style={styles.pickerContainer}>
                            <Picker selectedValue={semesterFilter} onValueChange={setSemesterFilter} style={styles.picker}>
                                <Picker.Item label="Semestre" value="" />
                                {semesters.map(semester =>
                                    <Picker.Item key={semester} label={semester} value={semester} />
                                )}
                            </Picker>
                        </View>

                        <View style={styles.pickerContainer}>
                            <Picker selectedValue={statusFilter} onValueChange={setStatusFilter} style={styles.picker}>
                                <Picker.Item label="Estatus" value="" />
                                {STATUS_OPTIONS.map(status =>
                                    <Picker.Item key={status} label={status} value={status} />
                                )}
                            </Picker>
                        </View>

                        <TouchableOpacity onPress={() => setSortAscending(previous => !previous)}>
                            <Ionicons name="swap-vertical" size={32} color={sortAscending ? Colors.textPrimary : Colors.textSecondary} />
                        </TouchableOpacity>
                    </View>

                    {isLoading && <ActivityIndicator color={Colors.primary} />}

                    {!isLoading &&
                        <FlatList
                            style={styles.list}
                            contentContainerStyle={styles.listContent}
                            data={filteredProjects}
                            keyExtractor={item => item.id.toString()}
                            keyboardShouldPersistTaps="handled"
                            renderItem={({ item }) =>
                                <ProjectSelectListItem project={item} isSelected={isInDraft(item)} onPress={() => toggleProject(item)} />
                            }
                            ListEmptyComponent={<Text style={styles.hint}>Proyectos no encontrados</Text>}
                        />
                    }

                    <PrimaryButton
                        text={`Confirmar (${draft.length})`}
                        onPress={() => {
                            onConfirm(draft);
                            onClose();
                        }}
                        style={styles.button}
                    />
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
    },
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    sheet: {
        height: '85%',
        gap: 12,
        paddingTop: 16,
        paddingHorizontal: 16,
        backgroundColor: Colors.itemBackgroundColor,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.primary,
    },
    closeButton: {
        position: 'absolute',
        right: 0,
    },
    input: {
        width: '100%',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: Colors.border,
        padding: 10,
        color: Colors.textPrimary,
    },
    filters: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    pickerContainer: {
        flex: 1,
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: 10,
        overflow: 'hidden',
    },
    picker: {
        color: Colors.textPrimary,
    },
    list: {
        flex: 1,
    },
    listContent: {
        gap: 4,
        paddingBottom: 8,
    },
    hint: {
        textAlign: 'center',
        marginTop: 8,
        color: Colors.textSecondary,
    },
    button: {
        alignSelf: 'center',
    },
});
