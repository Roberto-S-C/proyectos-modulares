import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, Text, View } from "react-native";
import Colors from "../constants/Colors";

interface FileType {
    id: number,
    format: string,
    name: string
}

interface File {
    id: number,
    link: string,
    status: string,
    fileType: FileType
}

export default function ProjectFileListItem({ id, link, status, fileType }: File) {
    return (
        <View style={styles.container}>
            <View style={styles.fileInfoContainer}>
                <View style={styles.fileType}>
                    {fileType.format.toUpperCase() === 'PDF' && < Ionicons name="document-text" size={40} color={'red'} />}
                    {fileType.format.toUpperCase() === 'PNG' && < Ionicons name="image" size={40} color={'black'} />}
                    {fileType.format.toUpperCase() !== 'PDF' && fileType.format.toUpperCase() !== 'PNG'  && < Ionicons name="document" size={40} color={Colors.secondary} />}
                    <Text>{fileType.format.toUpperCase()}</Text>
                </View>
                <View style={styles.fileDetails}>
                    <Text style={styles.fileName}>{fileType.name}</Text>
                    <Text style={styles.fileStatus}>{status}</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    icon: {

    },
    container: {
        padding: 4,
        backgroundColor: Colors.itemBackgroundColor,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    fileInfoContainer: {
        flexDirection: 'row',
        gap: 8,
        alignItems: 'center'
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
        fontWeight: 'bold',
        color: Colors.textSecondary
    }
});