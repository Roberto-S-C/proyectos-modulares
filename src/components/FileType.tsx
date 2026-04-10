import Colors from "@/src/constants/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Props {
    id: number,
    name: string,
    format: string
}

export default function FileType({ id, name, format }: Props) {
    return (
        <View style={styles.container}>
            <View style={styles.fileInfoContainer}>
                <View style={styles.fileType}>
                    {format.toUpperCase() === 'PDF' && < Ionicons name="document-text" size={40} color={'red'} />}
                    {format.toUpperCase() === 'PNG' && < Ionicons name="image" size={40} color={'black'} />}
                    {format.toUpperCase() !== 'PDF' && format.toUpperCase() !== 'PNG' && < Ionicons name="document" size={40} color={Colors.secondary} />}
                    <Text>{format.toUpperCase()}</Text>
                </View>
                <View style={styles.fileDetails}>
                    <Text style={styles.fileName}>{name}</Text>
                </View>
                <View style={styles.fileTypeActions}>
                    <TouchableOpacity>
                        <Ionicons name="build" size={32} />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Ionicons name="trash" size={32} />
                    </TouchableOpacity>
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
        width: '100%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    fileInfoContainer: {
        flexDirection: 'row',
        width: '100%',
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
        justifyContent: 'flex-start',
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
    },
    fileTypeActions: {
        flexDirection: 'row',
        gap: 8
    }
});