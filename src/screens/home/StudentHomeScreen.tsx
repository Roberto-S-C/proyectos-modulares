import Loading from "@/src/components/Loading";
import NotFoundItem from "@/src/components/NotFoundItem";
import ProjectOption from "@/src/components/Project/ProjectOption";
import RoundedOptionButton from "@/src/components/RoundedOptionButton";
import RoundedText from "@/src/components/RoundedText";
import Title from "@/src/components/Title";
import Colors from "@/src/constants/Colors";
import { AuthContext } from "@/src/contexts/AuthContext";
import { getAccountDetails } from "@/src/services/accountService";
import { isAuthStateValid } from "@/src/services/authService";
import { Project } from "@/src/types/project.types";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useContext, useState } from "react";
import { Image, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function StudentHomeScreen() {
    const [project, setProject] = useState<Project | null>(null);
    const [isUnableToLoad, setIsUnableToLoad] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const authContext = useContext(AuthContext);

    const router = useRouter();

    useFocusEffect(useCallback(() => {
        const fetchAccountDetails = async () => {
            if (isAuthStateValid(authContext.authState)) {
                try {
                    const res = await getAccountDetails(authContext.authState?.user.id);
                    setProject(res.data.project);
                } catch (e) {
                    setIsUnableToLoad(true);
                } finally {
                    setIsLoading(false);
                }
            }
        };
        fetchAccountDetails();
        return () => { };

    }, []));

    return (
        <SafeAreaView style={styles.screen}>

            {isUnableToLoad && !isLoading && <NotFoundItem text="Error al obtener la información" />}

            {isLoading && <Loading />}

            {project &&
                <ScrollView>
                    <View style={styles.container}>
                        <Image source={{ uri: `${process.env.EXPO_PUBLIC_CDN_DOMAIN}/${project?.coverImageUrl}` }} style={styles.projectImage} />
                        <Title text={project.name} />
                        <View style={styles.projectInfoContainer}>
                            <RoundedText text={project.presentationDate} fontSize={20} bgColor={Colors.primary} textColor={Colors.secondary} />
                            <RoundedText text={project.status} fontSize={20} bgColor={Colors.primary} textColor={Colors.secondary} />
                        </View>

                        <View style={styles.projectOptionsContainer}>
                            <ProjectOption text="Descripción" iconName="information-circle" navigationUrl={`/(app)/(tabs)/projects/[id]/description`} navigationUrlProjectIdParam={project.id} />
                            <ProjectOption text="Archivos" iconName="folder" navigationUrl="/(app)/(tabs)/projects/[id]/files" navigationUrlProjectIdParam={project.id} />
                            <ProjectOption text="Miembros" iconName="people-circle" navigationUrl="/(app)/(tabs)/projects/[id]/members" navigationUrlProjectIdParam={project.id} />
                        </View>
                    </View>
                </ScrollView>
            }

            {!isLoading && !project && !isUnableToLoad &&
                <View style={styles.noProjectContainer}>
                    <Ionicons name="construct" color={Colors.secondary} size={100} />
                    <Title text="No eres parte de ningún proyecto" />
                    <View style={{ height: 50, width: '70%' }}>
                        <RoundedOptionButton text="Crear Proyecto" icon="add" onPress={() => router.navigate('/(app)/(tabs)/projects/create')} />
                    </View>
                </View>
            }

        </SafeAreaView>
    );
}


const styles = StyleSheet.create({
    screen: {
        flex: 1,
    },
    container: {
        width: '100%',
        gap: 16,
        paddingHorizontal: 16,
        paddingVertical: 16,
        alignItems: 'center',
    },
    noProjectContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 16,
    },
    projectInfoContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
    },
    projectImage: {
        width: 300,
        height: 300,
    },
    projectOptionsContainer: {
        width: '100%',
    }
});