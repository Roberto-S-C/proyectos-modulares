import Colors from "@/src/constants/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Props {
    id: number,
    semester: string,
    date: string | null,
    onPress?: () => void
}

export default function PresentationSemesterListItem({ semester, date, onPress }: Props) {
    return (
        <TouchableOpacity onPress={onPress} style={styles.container}>
            <Ionicons name="calendar" size={40} color={Colors.secondary} />
            <View style={styles.details}>
                <Text style={styles.semester}>{semester}</Text>
                <Text style={styles.date}>{date ?? "Sin fecha asignada"}</Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
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
    details: {
        flex: 1,
        gap: 2,
    },
    semester: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.primary,
    },
    date: {
        fontSize: 14,
        color: Colors.textSecondary,
    },
});
