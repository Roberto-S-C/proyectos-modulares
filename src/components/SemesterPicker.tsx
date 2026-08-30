import { Picker } from "@react-native-picker/picker";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import Colors from "../constants/Colors";

interface props {
    onChange: (value: any) => void,
    value: string | null,
    semesters: string[],
    style?: StyleProp<ViewStyle>
}

export default function SemesterPicker({ onChange, value, semesters, style }: props) {
    return (
        <View style={[styles.container, style]}>
            <Picker
                selectedValue={value}
                onValueChange={(itemValue) => onChange(itemValue)}
                style={styles.picker}
            >
                {semesters.map(semester =>
                    <Picker.Item label={semester} value={semester} />
                )}
            </Picker>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: 4,
        overflow: "hidden"
    },
    picker: {
        fontWeight: "bold",
        color: Colors.primary
    }
});