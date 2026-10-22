import ProjectListItem from "@/src/components/Project/ProjectListItem";
import { Project } from "@/src/types/project.types";
import { FlatList, StyleSheet } from "react-native";
import Loading from "../Loading";
import NotFoundItem from "../NotFoundItem";


type ProjectListProps = {
    projects: Project[];
    // Infinite scroll: called near the end of the list, with a spinner below it while the next page loads
    onEndReached?: () => void;
    isLoadingMore?: boolean;
};

export default function ProjectList({ projects, onEndReached, isLoadingMore = false }: ProjectListProps) {
    return (
        <FlatList
            data={projects}
            renderItem={({ item }) => <ProjectListItem {...item} />}
            keyExtractor={item => item.id.toString()}
            style={styles.list}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={() => <NotFoundItem text="No hay proyectos disponibles" />}
            onEndReached={onEndReached}
            onEndReachedThreshold={0.5}
            ListFooterComponent={isLoadingMore ? <Loading size="small" /> : null}
        />
    );
}

const styles = StyleSheet.create({
    list: {
        width: '100%',
    },
    listContent: {
        alignItems: 'center',
        gap: 16,
    },
});