import Accordion from "@/src/components/Accordion"
import AccountPersonalInfo from "@/src/components/Account/AccountPersonalInfo"
import ProjectListItem from "@/src/components/Project/ProjectListItem"
import Colors from "@/src/constants/Colors"
import { AccountDetails } from "@/src/types/account.type"
import Ionicons from "@expo/vector-icons/Ionicons"
import { ScrollView, StyleSheet, Text, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

function EmptyList({ text }: { text: string }) {
    return (
        <View style={styles.emptyContainer}>
            <Ionicons name="layers-sharp" size={40} color={Colors.textSecondary} />
            <Text style={styles.emptyText}>{text}</Text>
        </View>
    );
}

export default function EvaluatorAccountDetailsScreen({ name, lastname, email, profilePicture, role, advisedProjects = [], evaluatedProjects = [] }: AccountDetails) {

    return (
        <SafeAreaView style={styles.screen}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <AccountPersonalInfo name={name} lastname={lastname} email={email} profilePicture={profilePicture} role={role} />

                <View style={styles.section}>
                    <Accordion
                        title="Proyectos Asesorados"
                        content={
                            <View style={styles.accordionContent}>
                                {advisedProjects.length === 0 && <EmptyList text="No hay proyectos asesorados" />}
                                {advisedProjects.map(project => <ProjectListItem key={project.id} {...project} />)}
                            </View>
                        }
                    />
                </View>

                <View style={styles.section}>
                    <Accordion
                        title="Proyectos Evaluados"
                        content={
                            <View style={styles.accordionContent}>
                                {evaluatedProjects.length === 0 && <EmptyList text="No hay proyectos evaluados" />}
                                {evaluatedProjects.map(project => <ProjectListItem key={project.id} {...project} />)}
                            </View>
                        }
                    />
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
        width: '92%',
    },
    accordionContent: {
        alignItems: 'center',
        gap: 16,
    },
    emptyContainer: {
        alignItems: 'center',
        gap: 4,
    },
    emptyText: {
        fontSize: 16,
        color: Colors.textSecondary,
    },
});
