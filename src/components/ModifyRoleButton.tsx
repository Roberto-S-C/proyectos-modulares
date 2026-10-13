import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Colors from "../constants/Colors";
import { updateAccountRole } from "../services/accountService";
import { ASSIGNABLE_ROLES, Role } from "../types/account.type";
import ConfirmDialog from "./ConfirmDialog";
import CustomAlert, { AlertProps } from "./CustomAlert";
import Loading from "./Loading";
import PickerModal from "./PickerModal";

interface Props {
    accountId: string,
    currentRole: Role,
    // Called after the role changed, so the screen can reload the account
    onRoleUpdated: () => void,
}

export default function ModifyRoleButton({ accountId, currentRole, onRoleUpdated }: Props) {
    const [isRoleModalVisible, setIsRoleModalVisible] = useState(false);
    const [newRole, setNewRole] = useState<Role | null>(null);
    const [isConfirmDialogVisible, setIsConfirmDialogVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [isAlertVisible, setIsAlertVisible] = useState(false);
    const [alertProps, setAlertProps] = useState<AlertProps>({
        message: '',
        onDismiss: () => setIsAlertVisible(false),
        isVisible: false,
        style: 'error'
    });

    const showError = (message: string) => {
        setAlertProps({
            message,
            onDismiss: () => setIsAlertVisible(false),
            isVisible: true,
            style: 'error'
        });
        setIsAlertVisible(true);
    }

    // The picker modal closes before the confirmation opens, two modals can't be stacked on iOS
    const handleRoleSubmit = (role: Role) => {
        setNewRole(role);
        setIsRoleModalVisible(false);
        setIsConfirmDialogVisible(true);
    }

    const handleConfirmRoleChange = async () => {
        if (!newRole) return;

        setIsConfirmDialogVisible(false);
        setIsLoading(true);
        try {
            await updateAccountRole(accountId, { role: newRole });
            onRoleUpdated();
        }
        catch (e: any) {
            showError(e?.response?.status === 409
                ? "El rol de esta cuenta no puede ser modificado"
                : "No se pudo actualizar el rol");
        }
        finally {
            setIsLoading(false);
        }
    }

    return (
        <View>
            {isAlertVisible && <CustomAlert {...alertProps} />}

            {isLoading
                ? <Loading />
                : <TouchableOpacity style={styles.container} onPress={() => setIsRoleModalVisible(true)}>
                    <Ionicons name="key" size={32} color={Colors.secondary} />
                    <Text style={styles.text}>Modificar Rol</Text>
                </TouchableOpacity>
            }

            <PickerModal
                isVisible={isRoleModalVisible}
                title="Modificar Rol"
                options={ASSIGNABLE_ROLES}
                currentValue={currentRole}
                onSubmit={handleRoleSubmit}
                onClose={() => setIsRoleModalVisible(false)}
            />

            <ConfirmDialog
                isVisible={isConfirmDialogVisible}
                message={`¿Cambiar el rol de la cuenta de ${currentRole} a ${newRole}?`}
                confirmText="Actualizar"
                onConfirm={handleConfirmRoleChange}
                onCancel={() => setIsConfirmDialogVisible(false)}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        padding: 8,
        gap: 8,
        elevation: 4,
        borderRadius: 12,
        backgroundColor: Colors.itemBackgroundColor,
    },
    text: {
        fontSize: 28,
        fontWeight: 'bold',
        color: Colors.secondary
    }
});
