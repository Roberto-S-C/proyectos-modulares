import AccountPersonalInfo from "@/src/components/Account/AccountPersonalInfo"
import ProjectListItem from "@/src/components/Project/ProjectListItem"
import Title from "@/src/components/Title"
import { AccountDetails } from "@/src/types/account.type"
import { ScrollView, StyleSheet, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

export default function MemberAccountDetailsScreen({ name, lastname, email, profilePicture, role, project }: AccountDetails) {

    return (
        <SafeAreaView style={styles.screen}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <AccountPersonalInfo name={name} lastname={lastname} email={email} profilePicture={profilePicture} role={role} />

                {project &&
                    <View style={styles.container}>
                        <Title text="Proyecto Modular" />
                        <ProjectListItem {...project} />
                    </View>
                }
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
    container: {
        gap: 8
    }
});
