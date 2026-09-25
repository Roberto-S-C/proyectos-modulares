import Colors from "@/src/constants/Colors";
import { getTodayString, isValidDateString, parseDateString } from "@/src/utils/semesterUtils";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import DatePicker from "react-native-date-picker";

interface Props {
    value: string,
    onChange: (date: string) => void,
    onBlur?: () => void,
    placeholder?: string,
    minimumDate?: string,
    maximumDate?: string,
    title?: string
}

export default function DatePickerField({ value, onChange, onBlur, placeholder = "Seleccionar fecha", minimumDate, maximumDate, title }: Props) {
    const [isOpen, setIsOpen] = useState(false);

    const pickerDate = isValidDateString(value)
        ? parseDateString(value)
        : parseDateString(minimumDate ?? getTodayString());

    return (
        <>
            <TouchableOpacity style={styles.field} onPress={() => setIsOpen(true)}>
                <Text style={[styles.text, !value && styles.placeholder]}>{value || placeholder}</Text>
                <Ionicons name="calendar" size={24} color={Colors.secondary} />
            </TouchableOpacity>

            <DatePicker
                modal
                mode="date"
                open={isOpen}
                date={pickerDate}
                minimumDate={minimumDate ? parseDateString(minimumDate) : undefined}
                maximumDate={maximumDate ? parseDateString(maximumDate) : undefined}
                title={title}
                confirmText="Confirmar"
                cancelText="Cancelar"
                onConfirm={(date) => {
                    setIsOpen(false);
                    onChange(getTodayString(date));
                    onBlur?.();
                }}
                onCancel={() => {
                    setIsOpen(false);
                    onBlur?.();
                }}
            />
        </>
    );
}

const styles = StyleSheet.create({
    field: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '90%',
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: 10,
        padding: 10,
    },
    text: {
        fontSize: 16,
        color: Colors.textPrimary,
    },
    placeholder: {
        color: Colors.textSecondary,
    },
});
