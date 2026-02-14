import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Colors from "../constants/Colors";

interface Props {
    id: number,
    name: string,
    navigationUrl: string,
}

export default function ModuleListItem({ id, name, navigationUrl }: Props) {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <View style={styles.moduleDetailsContainer}>
                <Ionicons name="cube" size={52} color={Colors.secondary} />
                <Text style={styles.moduleName}>{name}</Text>
            </View>

            <View style={styles.actionsContainer}>
                <TouchableOpacity onPress={() => router.navigate({ pathname: navigationUrl, params: { id } })}>
                    <Ionicons name="build" size={32} color={"black"} />
                </TouchableOpacity>
                <TouchableOpacity>
                    <Ionicons name="trash" size={32} color={"black"} />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
        gap: 8,
        backgroundColor: Colors.itemBackgroundColor
    },
    moduleDetailsContainer: {
        flex: 3,
        flexDirection: 'row',
        gap: 8,
        alignItems: 'center',
    },
    moduleName: {
        flexShrink: 1,
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.primary
    },
    actionsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 12
    }
});