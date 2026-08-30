import Colors from "@/src/constants/Colors";
import { useRouter } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Project } from "../../types/project.types";
import RoundedText from "../RoundedText";

export default function ProjectListItem({ id, name, status, presentationDate, coverImageUrl}: Project) {

    const router = useRouter();

    return (
        <TouchableOpacity style={styles.container}
            onPress={() => router.navigate({ pathname: '/(app)/(tabs)/projects/[id]', params: { id } })}>

            <Image source={{ uri: `${process.env.EXPO_PUBLIC_CDN_DOMAIN}/${coverImageUrl}` }} style={styles.image} />

            <View style={styles.projectStatusContainer}>
                <RoundedText text={presentationDate} fontSize={16} bgColor={Colors.primary} textColor={Colors.secondary} />
                <RoundedText text={status} fontSize={16} bgColor={Colors.primary} textColor={Colors.secondary} />
            </View>

            <Text style={styles.projectName}>{name}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        padding: 8,
        backgroundColor: Colors.itemBackgroundColor,

        // iOS
        shadowColor: Colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 8,

        // Android
        elevation: 4,
    },
    image: {
        width: 300,
        height: 300
    },
    projectStatusContainer: {
        flexDirection: 'row',
        margin: 8,
        gap: 8
    },
    projectName: {
        maxWidth: 300,
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.primary
    }
});