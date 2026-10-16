import Loading from "@/src/components/Loading";
import PreevaluationCommentListItem from "@/src/components/Module/PreevaluationCommentListItem";
import NotFoundItem from "@/src/components/NotFoundItem";
import RoundedOptionButton from "@/src/components/RoundedOptionButton";
import { AuthContext } from "@/src/contexts/AuthContext";
import { getPreevaluationComments, getProjectEvaluations, getProjectMembers } from "@/src/services/projectService";
import { Role } from "@/src/types/account.type";
import { PreevaluationComment } from "@/src/types/module.type";
import { ProjectMembers } from "@/src/types/project.types";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useContext, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProjectCommentsScreen() {
    const [comments, setComments] = useState<PreevaluationComment[]>();
    const [projectMembers, setProjectMembers] = useState<ProjectMembers | null>(null);
    const [evaluatorIds, setEvaluatorIds] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const { id } = useLocalSearchParams();
    const router = useRouter();
    const authContext = useContext(AuthContext);

    const userId = authContext.authState?.user.id;
    const userRole = authContext.authState?.user.role;
    const isAdvisor = !!userId && !!projectMembers && projectMembers.advisor?.id === userId;
    const isEvaluator = !!userId && evaluatorIds.includes(userId);
    const canAddComment = userRole === 'ADMIN' || userRole === Role.Evaluador || isAdvisor || isEvaluator;

    useFocusEffect(
        useCallback(() => {
            setIsLoading(true);
            const fetchComments = async () => {
                try {
                    const res = await getPreevaluationComments(Number(id));
                    if (res.status === 200 && res.data) setComments(res.data);

                    const membersRes = await getProjectMembers(Number(id));
                    if (membersRes.status === 200 && membersRes.data) setProjectMembers(membersRes.data);

                    const evaluationsRes = await getProjectEvaluations(Number(id));
                    if (evaluationsRes.status === 200 && evaluationsRes.data) setEvaluatorIds(evaluationsRes.data.evaluatorIds);
                }
                catch (e) {

                }
                finally {
                    setIsLoading(false);
                }
            }
            fetchComments();
        }, [id])
    );

    return (
        <SafeAreaView style={styles.screen}>
            {isLoading && <Loading />}

            {!isLoading && (!comments || comments.length === 0) &&
                <NotFoundItem text="Sin comentarios" />
            }

            {!isLoading && comments && comments.length > 0 &&
                <View style={styles.container}>
                    <FlatList
                        style={styles.list}
                        data={comments}
                        renderItem={({ item }) => <PreevaluationCommentListItem comment={item} />}
                        keyExtractor={item => item.id.toString()}
                        ItemSeparatorComponent={() => <View style={{ minHeight: 8 }} />}
                    />
                </View>
            }

            {!isLoading && canAddComment &&
                <View style={styles.addButtonContainer}>
                    <RoundedOptionButton icon="add" text="Agregar" onPress={() => router.push({ pathname: "/(app)/(tabs)/projects/[id]/modules/comments/add", params: { id: Number(id) } })} />
                </View>
            }
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        width: "96%",
        margin: "auto",
    },
    container: {
        flex: 1,
        gap: 20,
    },
    addButtonContainer: {
        width: 200,
        height: 60,
        alignSelf: "center",
        marginBottom: 12,
    },
    list: {
        flex: 1,
    }
});
