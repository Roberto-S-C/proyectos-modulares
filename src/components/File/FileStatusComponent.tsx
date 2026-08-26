import Colors from "@/src/constants/Colors";
import { ProjectFileStatus } from "@/src/types/project.types";
import { StyleSheet, Text, View } from "react-native";

interface Props {
    fileStatus: ProjectFileStatus
}

export default function FileStatusComponent({ fileStatus }: Props) {
    return (
        <View>
            <Text style={[
                styles.fileStatus,
                (fileStatus === 'FALTANTE' || fileStatus === 'CARGANDO') && { color: Colors.missing },
                fileStatus === 'REVISION' && { color: Colors.secondary},
                fileStatus === 'APROVADO' && { color: Colors.success},
                (fileStatus === 'RECHAZADO' || fileStatus === 'FALLIDO') && { color: Colors.error }
            ]}>
                {fileStatus}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    fileStatus: {
        fontWeight: "bold",
        fontSize: 16 
    }
});