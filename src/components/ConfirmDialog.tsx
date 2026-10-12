import Ionicons from "@expo/vector-icons/Ionicons";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import Colors from "../constants/Colors";

export interface ConfirmDialogProps {
    message: string;
    isVisible: boolean;
    onConfirm: () => void;
    onCancel: () => void;
    confirmText?: string;
    cancelText?: string;
    // "danger" for destructive actions (e.g. removing a module)
    variant?: "default" | "danger";
}

export default function ConfirmDialog({
    message,
    isVisible,
    onConfirm,
    onCancel,
    confirmText = "Aceptar",
    cancelText = "Cancelar",
    variant = "default"
}: ConfirmDialogProps) {
    const accentColor = variant === "danger" ? Colors.error : Colors.primary;

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={isVisible}
            onRequestClose={onCancel}
        >
            {/* Tapping outside doesn't close it: the user has to pick an option */}
            <View style={styles.backdrop}>
                <View style={styles.dialog}>
                    <View style={styles.messageContainer}>
                        <Ionicons
                            name={variant === "danger" ? "warning-outline" : "help-circle-outline"}
                            size={40}
                            color={accentColor}
                        />
                        <Text style={styles.message}>{message}</Text>
                    </View>

                    <View style={styles.buttonsContainer}>
                        <Pressable
                            onPress={onCancel}
                            style={({ pressed }) => [styles.button, styles.cancelButton, pressed && styles.buttonPressed]}
                        >
                            <Text style={[styles.buttonText, styles.cancelButtonText]}>{cancelText}</Text>
                        </Pressable>
                        <Pressable
                            onPress={onConfirm}
                            style={({ pressed }) => [styles.button, { backgroundColor: accentColor }, pressed && styles.buttonPressed]}
                        >
                            <Text style={[styles.buttonText, styles.confirmButtonText]}>{confirmText}</Text>
                        </Pressable>
                    </View>
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
    dialog: {
        width: '90%',
        gap: 16,
        padding: 16,
        backgroundColor: Colors.itemBackgroundColor,
        borderRadius: 20,
    },
    messageContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    message: {
        flex: 1,
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.textPrimary,
    },
    buttonsContainer: {
        flexDirection: 'row',
        gap: 8,
    },
    button: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        borderRadius: 12,
    },
    buttonPressed: {
        opacity: 0.7,
    },
    cancelButton: {
        borderWidth: 1,
        borderColor: Colors.border,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    cancelButtonText: {
        color: Colors.textSecondary,
    },
    confirmButtonText: {
        color: 'white',
    },
});
