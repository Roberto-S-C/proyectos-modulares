import Colors from "@/src/constants/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

interface props {
    id: string,
    name: string,
    onChange: (value: any) => void,
    selectedModulesId: string[]
}

export default function ModuleCheckbox({ id, name, onChange, selectedModulesId }: props) {

    return (
        <TouchableOpacity
            onPress={() => {
                if (selectedModulesId.includes(id)) {
                    let newModules = selectedModulesId.filter((moduleId) => moduleId != id);
                    onChange(newModules);
                }
                else {
                    onChange([...selectedModulesId, id]);
                }
            }}
            style={styles.container}
        >
            {selectedModulesId.includes(id) &&
                <Ionicons name="checkbox" size={32} color={Colors.primary} />
            }
            {!selectedModulesId.includes(id) &&
                <Ionicons name="square-outline" size={32} color={Colors.primary} />
            }
            <Text style={styles.moduleName}>{name}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8
    },
    moduleName: {
        flex: 1,
        flexWrap: "wrap",
        fontSize: 16,
        color: Colors.primary,
        fontWeight: "bold"
    }
});