import Colors from "@/src/constants/Colors";
import { StyleSheet, Text, View } from "react-native";
import SemesterPicker from "../SemesterPicker";

interface Props {
    text: string,
    selectedSemester: string | null,
    setSelectedSemester: (value: string | null) => void,
    semesters: string[]
}

export default function HeaderSemesterDropdown({text, selectedSemester, setSelectedSemester, semesters }: Props) {
    return (
        <View style={styles.headerContainer}>
            <Text style={styles.headerText}>{text}</Text>
            <SemesterPicker
                value={selectedSemester}
                onChange={setSelectedSemester}
                semesters={semesters}
                style={styles.semesterPicker}
            />
        </View>

    );
}

const styles = StyleSheet.create({

    headerContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: 'center',
        gap: 16,
        paddingVertical: 16,
        marginHorizontal: 8
    },
    headerText: {
        fontSize: 28,
        fontWeight: "bold",
        color: Colors.secondary,
    },
    semesterPicker: {
        flex: 1,
        maxWidth: 160
    },
});