import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, Text, View } from "react-native";
import Colors from "../constants/Colors";

interface ProjectModule {
    id: number,
    name: string,
    status: string
}

export default function ProjectModuleListItem({ id, name, status }: ProjectModule) {
    return (
        <View style={styles.container}>
            <Ionicons name="cube" size={52} color={Colors.secondary} style={styles.icon} />
            <View style={styles.moduleDetailsContainer}>
                <Text style={styles.moduleName}>{name}</Text>
                <Text style={styles.moduleStatus}>{status}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        // padding: 8,
        gap: 8,
        backgroundColor: Colors.itemBackgroundColor
    },
    icon: {
        position: 'absolute',
        left: 8,
    },
    moduleDetailsContainer: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignSelf: 'center',
        width: '70%',
        padding: 8,
    },
    moduleName: {
        flexShrink: 1,
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.primary
    },
    moduleStatus: {
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.textSecondary
    }
});