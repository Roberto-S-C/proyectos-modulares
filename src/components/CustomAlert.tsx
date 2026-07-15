import Ionicons from "@expo/vector-icons/Ionicons";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Colors from "../constants/Colors";

export interface AlertProps {
    message: string;
    onDismiss: () => void;
    isVisible: boolean;
    style: "success" | "error" | "info";
}

export default function CustomAlert({ message, onDismiss, isVisible, style }: AlertProps) {

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isVisible}
        >
            <View style={[
                styles.modalContent,
                (style === "success" ? styles.success : styles.empty),
                (style === "error" ? styles.error : styles.empty),
                (style === "info" ? styles.info : styles.empty)
            ]}>
                <TouchableOpacity style={styles.closeButton} onPress={onDismiss}>
                    <Ionicons name="close" size={28} style={styles.closeIcon} />
                </TouchableOpacity>
                <View style={styles.messageContainer}>
                    <Ionicons name="close-circle-outline" size={40} color={'white'} />
                    <Text style={styles.message}>{message}</Text>
                </View>
            </View>
        </Modal>
    );

}

const styles = StyleSheet.create({
    modalContent: {
        flex: 1,
        justifyContent: 'center',
        height: '10%',
        width: '95%',
        top: '20%',
        left: '50%',
        transform: [
            { translateX: '-50%' },
            { translateY: -20 }
        ],
        position: 'absolute',
        backgroundColor: Colors.modalBackgroundColor,
        borderRadius: 20
    },
    messageContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 12,
    },
    message: {
        paddingLeft: 10,
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
    closeButton: {
        position: 'absolute',
        top: 8,
        right: 8,
        zIndex: 1,
        padding: 4,
    },
    closeIcon: {
        color: 'white'
    },
    success: {
        backgroundColor: Colors.success
    },
    error: {
        backgroundColor: Colors.error
    },
    info: {
        backgroundColor: Colors.primary
    },
    empty: {}
});