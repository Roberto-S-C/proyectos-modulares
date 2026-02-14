import AccountPersonalInfo from "@/src/components/AccountPersonalInfo"
import ProjectListItem from "@/src/components/ProjectListItem"
import Title from "@/src/components/Title"
import { ScrollView, StyleSheet, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

interface projectImage {
    id: number,
    url: string
}

interface Project {
    id: number,
    name: string,
    status: string,
    presentation_date: string,
    images: projectImage[]
}

interface MemberDetails {
    id: string,
    name: string,
    lastname: string,
    email: string,
    profile_picture: string
    role: string,
    project: Project
}

export default function MemberAccountDetailsScreen({ id, name, lastname, email, profile_picture, role, project }: MemberDetails) {

    return (
        <SafeAreaView style={styles.screen}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <AccountPersonalInfo name={name} lastname={lastname} email={email} profile_picture={profile_picture} role={role} />

                <View>
                    <Title text="Proyecto Modular" />
                    <ProjectListItem {...project} />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        width: '100%',
    },
    scrollContent: {
        alignItems: 'center',
        gap: 16,
        flexGrow: 1,
    },
});