import ProjectListItem from "@/src/components/Project/ProjectListItem";
import { Project } from "@/src/types/project.types";
import { FlatList, StyleSheet } from "react-native";


export default function ProjectList(projects: Project[]) {
    return (
        <FlatList
            data={projects}
            renderItem={({ item }) => <ProjectListItem {...item} />}
            keyExtractor={item => item.id.toString()}
            style={styles.list}
            contentContainerStyle={styles.listContent}
        />
    );
}

const styles = StyleSheet.create({
    list: {
        width: '100%',
        padding: 8
    },
    listContent: {
        alignItems: 'center',
        padding: 16,
        gap: 16,
    },
});