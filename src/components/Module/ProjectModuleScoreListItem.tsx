import Colors from "@/src/constants/Colors";
import { ProjectModuleScore } from "@/src/types/module.type";
import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Props {
    moduleScore: ProjectModuleScore,
    onPress: () => void,
}

export default function ProjectModuleScoreListItem({ moduleScore, onPress }: Props) {
    const hasScore = moduleScore.score !== null;

    return (
        <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
            <Ionicons name="cube" size={52} color={Colors.secondary} style={styles.icon} />
            <View style={styles.moduleDetailsContainer}>
                <Text style={styles.moduleName} numberOfLines={2}>{moduleScore.moduleName}</Text>
                <Text style={[styles.moduleScore, hasScore && { color: Colors.primary }]}>
                    {hasScore ? moduleScore.score : "Sin evaluar"}
                </Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        minHeight: 70,
        backgroundColor: Colors.itemBackgroundColor,
        borderRadius: 10,
        overflow: 'hidden',
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
        color: Colors.primary,
        textDecorationLine: "underline",
        textDecorationStyle: "solid"
    },
    moduleScore: {
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 8,
        color: Colors.textSecondary,
    },
    chevron: {
        position: 'absolute',
        right: 8,
    },
});
