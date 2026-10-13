import Colors from "@/src/constants/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Picker } from "@react-native-picker/picker";
import { useEffect, useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import PrimaryButton from "./PrimaryButton";

interface Props<T extends string> {
    isVisible: boolean,
    title: string,
    options: T[],
    currentValue: T,
    onSubmit: (value: T) => void,
    onClose: () => void,
    submitText?: string,
}

export default function PickerModal<T extends string>({
    isVisible,
    title,
    options,
    currentValue,
    onSubmit,
    onClose,
    submitText = "Actualizar"
}: Props<T>) {
    const [selectedValue, setSelectedValue] = useState<T>(currentValue);

    // Starts from the current value every time it opens
    useEffect(() => {
        if (isVisible) setSelectedValue(currentValue);
    }, [isVisible, currentValue]);

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}
        >
            <View style={styles.backdrop}>
                <View style={styles.modal}>
                    <View style={styles.header}>
                        <Text style={styles.title}>{title}</Text>
                        <Pressable onPress={onClose} style={styles.closeButton}>
                            <Ionicons name="close" size={28} color={Colors.textSecondary} />
                        </Pressable>
                    </View>

                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={selectedValue}
                            onValueChange={(itemValue) => setSelectedValue(itemValue)}
                            style={styles.picker}
                        >
                            {options.map(option =>
                                <Picker.Item key={option} label={option} value={option} />
                            )}
                        </Picker>
                    </View>

                    <PrimaryButton
                        text={submitText}
                        onPress={() => onSubmit(selectedValue)}
                        disabled={selectedValue === currentValue}
                        style={styles.button}
                    />
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modal: {
        width: '90%',
        gap: 16,
        padding: 16,
        backgroundColor: Colors.itemBackgroundColor,
        borderRadius: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.primary,
    },
    closeButton: {
        position: 'absolute',
        right: 0,
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: 4,
        overflow: 'hidden',
    },
    picker: {
        color: Colors.primary,
    },
    button: {
        alignSelf: 'center',
    },
});
