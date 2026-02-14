import { FlatList, StyleSheet } from "react-native";
import ProjectListItem from "./ProjectListItem";


interface ProjectImage {
    id: number,
    url: string
}

interface Project {
    id: number,
    name: string,
    status: string,
    presentation_date: string,
    images: ProjectImage[]

}

interface Projects {
    projects: Project[]
}


export default function ProjectList({ projects }: Projects) {
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