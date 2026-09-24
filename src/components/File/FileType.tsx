import Colors from "@/src/constants/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Props {
    id: number,
    name: string,
    format: string,
    onPress?: () => void
}

export default function FileType({ name, format, onPress }: Props) {
    const extension = (format.split("/")[1] ?? format).toUpperCase();

    return (
        <TouchableOpacity onPress={onPress} style={styles.fileInfoContainer}>
            <View style={styles.fileType}>
                {format === 'application/pdf' && <Ionicons name="document-text" size={40} color={'red'} />}
                {format.startsWith('image/') && <Ionicons name="image" size={40} color={'black'} />}
                {format !== 'application/pdf' && !format.startsWith('image/') && <Ionicons name="document" size={40} color={Colors.secondary} />}
                <Text>{extension}</Text>
            </View>
            <View style={styles.fileDetails}>
                <Text style={styles.fileName}>{name}</Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    fileInfoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        padding: 4,
        backgroundColor: Colors.itemBackgroundColor,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: Colors.border,
        borderRadius: 10,
    },
    fileType: {
        alignItems: 'center',
    },
    fileDetails: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-evenly',
    },
    fileName: {
        width: '100%',
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.primary,
    },
});
