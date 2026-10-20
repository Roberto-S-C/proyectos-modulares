import Loading from "@/src/components/Loading";
import RoundedOptionButton from "@/src/components/RoundedOptionButton";
import Title from "@/src/components/Title";
import { getProjectModules } from "@/src/services/projectService";
import { ProjectModules } from "@/src/types/project.types";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProjectModulesScreen() {
    const { id } = useLocalSearchParams();
    const [isLoading, setIsLoading] = useState(true);
    const [project, setProject] = useState<ProjectModules | null>(null);

    const router = useRouter();

    useEffect(() => {
        const fetchProjectModules = async () => {
            try {
                const res = await getProjectModules(Number(id));
                if (res.status === 200) {
                    setProject(res.data);
                }
            }
            catch (e) {

            }
            finally {
                setIsLoading(false);
            }
        }
        fetchProjectModules()
    }, [])

    return (
        <SafeAreaView style={styles.screen}>
            {isLoading && <Loading />}

            {!isLoading && project &&
                <ScrollView contentContainerStyle={styles.container}>
                    <Image source={{ uri: `${process.env.EXPO_PUBLIC_CDN_DOMAIN}/${project.coverImageUrl}` }} style={styles.image} />
                    <Title text={project?.name} />

                    <View style={styles.optionsContainer}>
                        <View style={styles.optionButton}>
                            <RoundedOptionButton text="Evaluación" icon="star" onPress={() => router.push({ pathname: "/(app)/(tabs)/projects/[id]/modules/evaluation", params: { id: Number(id) } })} />
                        </View>
                        <View style={styles.optionButton}>
                            <RoundedOptionButton text="Comentarios" icon="chatbubble-ellipses" onPress={() => router.push({ pathname: "/(app)/(tabs)/projects/[id]/modules/comments", params: { id: Number(id) } })} />
                        </View>
                        <View style={styles.optionButton}>
                            <RoundedOptionButton text="Módulos" icon="cube" onPress={() => router.push({ pathname: "/(app)/(tabs)/projects/[id]/modules/status", params: { id: Number(id) } })} />
                        </View>
                        <View style={styles.optionButton}>
                            <RoundedOptionButton text="Preevaluación" icon="star-half" onPress={() => router.push({ pathname: "/(app)/(tabs)/projects/[id]/modules/preevaluation", params: { id: Number(id) } })} />
                        </View>
                    </View>
                </ScrollView>
            }

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
    },
    container: {
        flexGrow: 1,
        width: '100%',
        gap: 8,
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    image: {
        alignSelf: 'center',
        width: 350,
        height: 350,
    },
    optionsContainer: {
        width: '100%',
        flexDirection: 'column',
        gap: 8,
    },
    optionButton: {
        height: 60,
    }
});