import AccountPersonalInfo from "@/src/components/Account/AccountPersonalInfo"
import ProjectListItem from "@/src/components/Project/ProjectListItem"
import Title from "@/src/components/Title"
import Colors from "@/src/constants/Colors"
import { AccountDetails } from "@/src/types/account.type"
import { ScrollView, StyleSheet, Text, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

export default function EvaluatorAccountDetailsScreen({ name, lastname, email, profilePicture, role, advisedProjects = [], evaluatedProjects = [] }: AccountDetails) {

    return (
        <SafeAreaView style={styles.screen}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <AccountPersonalInfo name={name} lastname={lastname} email={email} profilePicture={profilePicture} role={role} />

                <View style={styles.section}>
                    <Title text="Proyectos Asesorados" />
                    {advisedProjects.length === 0 && <Text style={styles.emptyText}>No hay proyectos asesorados</Text>}
                    {advisedProjects.map(project => <ProjectListItem key={project.id} {...project} />)}
                </View>

                <View style={styles.section}>
                    <Title text="Proyectos Evaluados" />
                    {evaluatedProjects.length === 0 && <Text style={styles.emptyText}>No hay proyectos evaluados</Text>}
                    {evaluatedProjects.map(project => <ProjectListItem key={project.id} {...project} />)}
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
        paddingVertical: 16,
    },
    section: {
        alignItems: 'center',
        gap: 16,
        width: '100%',
    },
    emptyText: {
        fontSize: 16,
        color: Colors.textSecondary,
    },
});
