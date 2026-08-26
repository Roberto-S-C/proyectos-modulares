import Colors from "@/src/constants/Colors";
import { ProjectFile } from "@/src/types/project.types";
import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import FileStatusComponent from "../File/FileStatusComponent";

type ProjectFileListItemProps = {
    file: ProjectFile,
    selectedFileId: number | undefined,
    setSelectedFile: React.Dispatch<React.SetStateAction<ProjectFile | null>>;
};

export default function ProjectFileListItem({ file, selectedFileId, setSelectedFile }: ProjectFileListItemProps) {
    return (
        <TouchableOpacity onPress={() => setSelectedFile(file)} style={
            [
                styles.fileInfoContainer,
                selectedFileId === file.id && { backgroundColor: Colors.selectedItemBackgroundColor },
                file.status === 'FALTANTE' && { borderStyle: 'dashed' },
                (file.status === 'RECHAZADO' || file.status === 'FALLIDO') && { borderColor: Colors.error }
            ]
        }>
            <View style={styles.fileType}>
                {file.fileType.format === 'application/pdf' && < Ionicons name="document-text" size={40} color={'red'} />}
                {file.fileType.format === 'image/jpeg' && < Ionicons name="image" size={40} color={'black'} />}
                <Text>{file.fileType.format.split("/")[1].toUpperCase()}</Text>
            </View>
            <View style={styles.fileDetails}>
                <Text style={styles.fileName}>{file.fileType.name}</Text>
                <FileStatusComponent fileStatus={file.status} />
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    fileInfoContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        padding: 4,
        backgroundColor: Colors.itemBackgroundColor,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: Colors.border,
        borderRadius: 10,
        marginBottom: 8
    },
    fileType: {
        alignItems: 'center',
    },
    fileDetails: {
        flex: 1,
        flexDirection: 'column',
        height: '100%',
        justifyContent: 'space-evenly',
    },
    fileName: {
        width: '100%',
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.primary,
    },
    fileStatus: {
        width: '100%',
        fontSize: 16,
        fontWeight: 'bold'
    }
});