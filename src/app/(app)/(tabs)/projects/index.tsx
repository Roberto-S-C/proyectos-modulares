import Loading from "@/src/components/Loading";
import NotFoundItem from "@/src/components/NotFoundItem";
import ProjectList from "@/src/components/Project/ProjectList";
import SelectField from "@/src/components/SelectField";
import Colors from "@/src/constants/Colors";
import { getPresentationSemesters } from "@/src/services/presentationSemesterService";
import { getProjects } from "@/src/services/projectService";
import { PresentationSemester } from "@/src/types/presentationSemester.type";
import { Project, ProjectStatus } from "@/src/types/project.types";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const STATUS_OPTIONS: ProjectStatus[] = ["REVISION", "APROVADO", "RECHAZADO", "CONDICIONADO", "NP", "COMPLETADO", "ATRASADO"];

// Semester codes are "YYYY" + "A"/"B" (e.g. "2026A"), so order chronologically by year first,
// then by the half-year letter.
const compareSemesters = (a: PresentationSemester, b: PresentationSemester) => {
    const yearA = parseInt(a.semester.slice(0, 4), 10);
    const yearB = parseInt(b.semester.slice(0, 4), 10);
    if (yearA !== yearB) return yearA - yearB;
    return a.semester.slice(4).localeCompare(b.semester.slice(4));
};

const PAGE_SIZE = 20;
const NAME_FILTER_DELAY_MS = 300;

export default function ProjectsScreen() {
    // null when the first page couldn't be loaded
    const [projects, setProjects] = useState<Project[] | null>([]);
    const [semesters, setSemesters] = useState<PresentationSemester[]>([]);
    const [page, setPage] = useState(0);
    const [isLast, setIsLast] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    const [nameFilter, setNameFilter] = useState('');
    const [debouncedNameFilter, setDebouncedNameFilter] = useState('');
    const [semesterFilter, setSemesterFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [sortAscending, setSortAscending] = useState(true);

    // Bumped on every reload from page 0, so responses for older filters are ignored
    const requestIdRef = useRef(0);
    // onEndReached can fire again before the isLoadingMore state update lands
    const isLoadingMoreRef = useRef(false);

    // Only search once the user stops typing
    useEffect(() => {
        const timeout = setTimeout(() => setDebouncedNameFilter(nameFilter.trim()), NAME_FILTER_DELAY_MS);
        return () => clearTimeout(timeout);
    }, [nameFilter]);

    const loadPage = useCallback(async (pageToLoad: number) => {
        const isFirstPage = pageToLoad === 0;
        const requestId = isFirstPage ? ++requestIdRef.current : requestIdRef.current;

        if (isFirstPage) {
            setIsLoading(true);
            setIsLoadingMore(false);
        }
        else {
            setIsLoadingMore(true);
        }
        isLoadingMoreRef.current = !isFirstPage;

        try {
            const res = await getProjects({
                page: pageToLoad,
                size: PAGE_SIZE,
                name: debouncedNameFilter,
                semester: semesterFilter,
                status: statusFilter,
                sort: sortAscending ? 'asc' : 'desc',
            });
            if (requestId !== requestIdRef.current) return;

            const newProjects = res.data.content;
            // A project added between page loads can shift one onto the next page, so skip repeats
            setProjects(previous => isFirstPage || !previous
                ? newProjects
                : [...previous, ...newProjects.filter(project => !previous.some(existing => existing.id === project.id))]);
            setPage(res.data.page);
            setIsLast(res.data.last);
        }
        catch (e) {
            console.log(e);
            if (requestId === requestIdRef.current && isFirstPage) setProjects(null);
        }
        finally {
            if (requestId === requestIdRef.current) {
                if (isFirstPage) setIsLoading(false);
                else setIsLoadingMore(false);
                isLoadingMoreRef.current = false;
            }
        }
    }, [debouncedNameFilter, semesterFilter, statusFilter, sortAscending]);

    // Reloads from the first page on focus and whenever a filter or the sort changes
    useFocusEffect(
        useCallback(() => {
            loadPage(0);
        }, [loadPage])
    );

    const loadNextPage = () => {
        if (isLoading || isLoadingMoreRef.current || isLast) return;
        loadPage(page + 1);
    };

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

                    <SelectField
                        value={semesterFilter}
                        onChange={setSemesterFilter}
                        placeholder="Semestre"
                        options={[
                            { label: 'Todos', value: '' },
                            ...[...semesters].sort(compareSemesters).map(semester => ({ label: semester.semester, value: semester.semester }))
                        ]}
                        style={styles.picker}
                    />

                    <SelectField
                        value={statusFilter}
                        onChange={setStatusFilter}
                        placeholder="Estatus"
                        options={[
                            { label: 'Todos', value: '' },
                            ...STATUS_OPTIONS.map(status => ({ label: status, value: status }))
                        ]}
                        style={styles.picker}
                    />

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
                    !isLoading && !projects &&
                    <NotFoundItem text="Proyectos no encontrados" />
                }

                {
                    !isLoading && projects &&
                    <ProjectList projects={projects} onEndReached={loadNextPage} isLoadingMore={isLoadingMore} />
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
        // iOS inputs have no default padding and shrink to the text; same height as the filters below
        minHeight: 52,
        paddingHorizontal: 12,
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'semibold',
        color: Colors.textSecondary,
        borderRadius: 10,

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
        minHeight: 52,
        borderWidth: 0,
        backgroundColor: Colors.itemBackgroundColor,

        // iOS
        shadowColor: Colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 8,

        // Android
        elevation: 4,
    },
    list: {
        flex: 1,
    },
    listContent: {
        padding: 16,
    },
});
