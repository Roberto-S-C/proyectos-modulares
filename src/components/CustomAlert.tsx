import Ionicons from "@expo/vector-icons/Ionicons";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
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
            <Pressable style={styles.touchArea} onPress={onDismiss}>
                <View style={[
                    styles.modalContent,
                    (style === "success" ? styles.success : styles.empty),
                    (style === "error" ? styles.error : styles.empty),
                    (style === "info" ? styles.info : styles.empty)
                ]}>
                    <View style={styles.closeButton}>
                        <Ionicons name="close" size={28} style={styles.closeIcon} />
                    </View>
                    <View style={styles.messageContainer}>
                        {style === 'success' && <Ionicons name="checkmark-circle-outline" size={40} color={'white'} />}
                        {style === 'error' && <Ionicons name="close-circle-outline" size={40} color={'white'} />}
                        {style === 'info' && <Ionicons name="information-circle-outline" size={40} color={'white'} />}
                        <Text style={styles.message}>{message}</Text>
                    </View>
                </View>
            </Pressable>
        </Modal>
    );

}

const styles = StyleSheet.create({
    touchArea: {
        flex: 1,
    },
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
        paddingHorizontal: 10,
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
    closeButton: {
        position: 'absolute',
        top: 2,
        right: 2,
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