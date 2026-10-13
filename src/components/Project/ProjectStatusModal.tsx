import Colors from "@/src/constants/Colors";
import { ProjectStatus } from "@/src/types/project.types";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Picker } from "@react-native-picker/picker";
import { useEffect, useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import PrimaryButton from "../PrimaryButton";

const STATUS_OPTIONS: ProjectStatus[] = ["APROVADO", "RECHAZADO", "REVISION", "CONDICIONADO", "ATRASADO", "NP", "COMPLETADO"];

interface Props {
    isVisible: boolean,
    currentStatus: ProjectStatus,
    onSubmit: (status: ProjectStatus) => void,
    onClose: () => void,
}

export default function ProjectStatusModal({ isVisible, currentStatus, onSubmit, onClose }: Props) {
    const [selectedStatus, setSelectedStatus] = useState<ProjectStatus>(currentStatus);

    // Starts from the project's current status every time it opens
    useEffect(() => {
        if (isVisible) setSelectedStatus(currentStatus);
    }, [isVisible, currentStatus]);

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
                        <Text style={styles.title}>Modificar Estatus</Text>
                        <Pressable onPress={onClose} style={styles.closeButton}>
                            <Ionicons name="close" size={28} color={Colors.textSecondary} />
                        </Pressable>
                    </View>

                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={selectedStatus}
                            onValueChange={(itemValue) => setSelectedStatus(itemValue)}
                            style={styles.picker}
                        >
                            {STATUS_OPTIONS.map(status =>
                                <Picker.Item key={status} label={status} value={status} />
                            )}
                        </Picker>
                    </View>

                    <PrimaryButton
                        text="Actualizar"
                        onPress={() => onSubmit(selectedStatus)}
                        disabled={selectedStatus === currentStatus}
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
