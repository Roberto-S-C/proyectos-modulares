import AccountPersonalInfo from "@/src/components/Account/AccountPersonalInfo"
import ProjectList from "@/src/components/Project/ProjectList"
import Title from "@/src/components/Title"
import { FlatList, StyleSheet, View } from "react-native"
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

interface EvaluatorDetails {
    id: string,
    name: string,
    lastname: string,
    email: string,
    profile_picture: string
    role: string,
    projects: Project[]
}

export default function EvaluatorAccountDetailsScreen({ id, name, lastname, email, profile_picture, role, projects }: EvaluatorDetails) {

    return (
        <SafeAreaView style={styles.screen}>
            <FlatList
                data={projects}
                renderItem={({ item }) => <ProjectList projects={[item]} />}
                keyExtractor={(item) => item.id.toString()}
                ListHeaderComponent={
                    <View style={styles.headerContainer}>
                        <AccountPersonalInfo name={name} lastname={lastname} email={email} profile_picture={profile_picture} role={role} />
                        <Title text="Proyectos Evaluados" />
                    </View>
                }
                contentContainerStyle={styles.listContent}
                scrollEnabled={true}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        justifyContent: 'center',
        width: '100%',
    },
    headerContainer: {
        alignItems: 'center',
        gap: 16,
        paddingVertical: 16,
    },
    listContent: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});