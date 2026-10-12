import Colors from "@/src/constants/Colors";
import { ProjectModuleStatus } from "@/src/types/module.type";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface ProjectModule {
    id: number,
    name: string,
    status: ProjectModuleStatus,
    onAdd?: () => void,
    onDelete?: () => void
}

export default function ProjectModuleListItem({ id, name, status, onAdd, onDelete }: ProjectModule) {
    return (
        <View style={styles.container}>
            <View style={styles.moduleDetailsContainer}>
                <Text style={styles.moduleName}>{name}</Text>
                <Text style={[
                    styles.moduleStatus,
                    status === "APROVADO" && {color: Colors.success},
                    status === "NP" && {color: Colors.error}
                ]}>{status}</Text>
            </View>
            {onAdd &&
                <Pressable onPress={onAdd} style={styles.actionButton}>
                    {({ pressed }) =>
                        <Ionicons name="add-circle" size={32} color={pressed ? Colors.textSecondary : Colors.success} />
                    }
                </Pressable>
            }
            {onDelete &&
                <Pressable onPress={onDelete} style={styles.actionButton}>
                    {({ pressed }) =>
                        <Ionicons name="trash" size={32} color={pressed ? Colors.textSecondary : Colors.error} />
                    }
                </Pressable>
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        minHeight: 70,
        paddingHorizontal: 8,
        backgroundColor: Colors.itemBackgroundColor,
        borderRadius: 10,
        overflow: 'hidden',
    },
    moduleDetailsContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        padding: 8,
    },
    moduleName: {
        flexShrink: 1,
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.primary,
    },
    moduleStatus: {
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.textSecondary
    },
    actionButton: {
        padding: 8,
    }
});
