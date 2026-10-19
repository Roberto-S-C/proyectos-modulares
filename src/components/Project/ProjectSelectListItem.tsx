import Colors from "@/src/constants/Colors";
import { Project, ProjectStatus } from "@/src/types/project.types";
import { PROJECT_STATUS_VARIANT } from "@/src/utils/projectUtils";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import RoundedText from "../RoundedText";

interface Props {
    project: Project,
    isSelected: boolean,
    onPress: () => void
}

// A selectable project row: checkbox, cover image, name, semester and status
export default function ProjectSelectListItem({ project, isSelected, onPress }: Props) {
    return (
        <TouchableOpacity style={[styles.project, isSelected && styles.projectSelected]} onPress={onPress}>

            <Image source={{ uri: `${process.env.EXPO_PUBLIC_CDN_DOMAIN}/${project.coverImageUrl}` }} style={styles.image} />

            <View style={styles.projectDetails}>
                <Text style={styles.name} numberOfLines={2}>{project.name}</Text>
                <View style={styles.projectStatus}>
                    <RoundedText text={project.presentationSemester} fontSize={14} />
                    <RoundedText text={project.status} fontSize={14} variant={PROJECT_STATUS_VARIANT[project.status as ProjectStatus]} />
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    project: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        padding: 8,
        marginVertical: 2,
        borderRadius: 10,
        backgroundColor: Colors.itemBackgroundColor,

        // iOS
        shadowColor: Colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,

        // Android
        elevation: 4,
    },
    projectSelected: {
        backgroundColor: Colors.selectedItemBackgroundColor
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 8,
    },
    projectDetails: {
        flex: 1,
        flexDirection: 'column',
        gap: 8,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.primary,
    },
    projectStatus: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 4,
    },
});
