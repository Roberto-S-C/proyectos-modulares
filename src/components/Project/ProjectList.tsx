import ProjectListItem from "@/src/components/Project/ProjectListItem";
import { Project } from "@/src/types/project.types";
import { FlatList, StyleSheet } from "react-native";
import NotFoundItem from "../NotFoundItem";


type ProjectListProps = {
    projects: Project[];
};

export default function ProjectList({ projects }: ProjectListProps) {
    return (
        <FlatList
            data={projects}
            renderItem={({ item }) => <ProjectListItem {...item} />}
            keyExtractor={item => item.id.toString()}
            style={styles.list}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={() => <NotFoundItem text="No hay proyectos disponibles" />}
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