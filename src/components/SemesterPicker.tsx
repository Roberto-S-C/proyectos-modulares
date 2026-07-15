import { Picker } from "@react-native-picker/picker";
import { StyleSheet, View } from "react-native";
import Colors from "../constants/Colors";

interface props {
    onChange: (value: any) => void,
    value: string
}

function getSemesters(date = new Date()) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // 1–12

    let options;

    if (month >= 1 && month <= 4) {
        // Jan–Apr
        options = [`${year}A`, `${year}B`];
    } else if (month >= 5 && month <= 10) {
        // May–Oct
        options = [`${year}B`, `${year + 1}A`];
    } else {
        // Nov–Dec
        options = [`${year + 1}A`, `${year + 1}B`];
    }

    return options;
}

export default function SemesterPicker({ onChange, value }: props) {
    const semesters = getSemesters();

    return (
        <View style={styles.container}>
            <Picker
                selectedValue={value}
                onValueChange={(itemValue) => onChange(itemValue)}
                style={styles.picker}
            >
                <Picker.Item label={'Fecha de Presentación'} value={undefined} />
                <Picker.Item label={semesters[0]} value={semesters[0]} />
                <Picker.Item label={semesters[1]} value={semesters[1]} />
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
        color: Colors.primary
    }
});