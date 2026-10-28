import Accordion from "@/src/components/Accordion";
import AccountListItem from "@/src/components/Account/AccountListItem";
import ConfirmDialog from "@/src/components/ConfirmDialog";
import CustomAlert, { AlertProps } from "@/src/components/CustomAlert";
import Loading from "@/src/components/Loading";
import NotFoundItem from "@/src/components/NotFoundItem";
import RoundedOptionButton from "@/src/components/RoundedOptionButton";
import Title from "@/src/components/Title";
import Colors from "@/src/constants/Colors";
import { AuthContext } from "@/src/contexts/AuthContext";
import { getProjectEvaluators, getProjectMembers, leaveProject } from "@/src/services/projectService";
import { Account, Role } from "@/src/types/account.type";
import { ProjectMembers } from "@/src/types/project.types";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useContext, useState } from "react";
import { FlatList, Image, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProjectMembersScreen() {
    const [project, setProject] = useState<ProjectMembers>();
    const [membersId, setMembersId] = useState<string[]>([]);
    const [evaluators, setEvaluators] = useState<Account[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [isAlertVisible, setIsAlertVisible] = useState(false);
    const [isLeaveDialogVisible, setIsLeaveDialogVisible] = useState(false);
    const [isLeaveAlertVisible, setIsLeaveAlertVisible] = useState(false);
    const [leaveAlertProps, setLeaveAlertProps] = useState<AlertProps>({
        message: '',
        onDismiss: () => setIsLeaveAlertVisible(false),
        isVisible: false,
        style: 'error'
    });

    const authContext = useContext(AuthContext);
    const userId = authContext.authState?.user?.id;
    const isAdmin = authContext.authState?.user?.role === Role.Admin;

    const searchParams = useLocalSearchParams();
    const projectId = Number(searchParams.id);

    const router = useRouter();

    // The advisor (part of the members list) and the members can leave, unless it's COMPLETADO;
    // the backend rejects that case
    const canLeaveProject = !!userId && membersId.includes(userId);

    const handleConfirmLeave = async () => {
        setIsLeaveDialogVisible(false);
        setIsLoading(true);
        try {
            await leaveProject(projectId);
            setLeaveAlertProps({
                message: "Has abandonado el proyecto",
                // The user no longer has access to the project, so go back home
                onDismiss: () => {
                    setIsLeaveAlertVisible(false);
                    router.replace("/(app)/(tabs)");
                },
                isVisible: true,
                style: 'success'
            });
        }
        catch (e: any) {
            setLeaveAlertProps({
                message: e?.response?.status === 409
                    ? "Este proyecto no puede ser abandonado"
                    : "No se pudo abandonar el proyecto",
                onDismiss: () => setIsLeaveAlertVisible(false),
                isVisible: true,
                style: 'error'
            });
        }
        finally {
            setIsLoading(false);
            setIsLeaveAlertVisible(true);
        }
    }

    useFocusEffect(
        useCallback(() => {
            setIsLoading(true);
            const fetchProjectMembers = async () => {
                try {
                    const res = await getProjectMembers(projectId);

                    let project: ProjectMembers = res.data;
                    // A project whose advisor left has none
                    if (project.advisor) {
                        project.advisor.role = Role.Asesor;
                        project.members.unshift(project.advisor);
                    }

                    let ids: string[] = [];
                    project.members.forEach(member => {
                        ids.push(member.id);
                    });
                    setMembersId(ids);
                    setProject(project)
                }
                catch (e) {
                    setIsAlertVisible(true);
                }
                finally {
                    setIsLoading(false);
                }

                if (isAdmin) {
                    try {
                        const evaluatorsRes = await getProjectEvaluators(projectId);
                        setEvaluators(evaluatorsRes.data);
                    }
                    catch (e) {
                        setEvaluators([]);
                    }
                }
            }
            fetchProjectMembers();
        }, [projectId, isAdmin])
    );

    const renderAccount = (item: Account) =>
        <AccountListItem {...item} onPress={() => router.push({ pathname: '/(app)/(tabs)/accounts/[id]', params: { id: item.id } })} />;

    const renderAccounts = (accounts: Account[], emptyText: string) =>
        <FlatList
            data={accounts}
            renderItem={({ item }) => renderAccount(item)}
            keyExtractor={item => item.id}
            scrollEnabled={false}
            contentContainerStyle={styles.accounts}
            ListEmptyComponent={<Text style={styles.emptyText}>{emptyText}</Text>}
        />;

    const renderButtons = () =>
        <View style={styles.listHeader}>
            {userId && membersId.includes(userId) &&
                <View style={styles.button}>
                    <RoundedOptionButton text="Añadir Miembro" icon="person-add" onPress={() => { router.push(`/(app)/(tabs)/projects/${projectId}/members/addMembers`) }} />
                </View>
            }
            {canLeaveProject &&
                <View style={styles.button}>
                    <RoundedOptionButton text="Abandonar Proyecto" icon="person-remove" variant="danger" onPress={() => setIsLeaveDialogVisible(true)} />
                </View>
            }
            {isAdmin &&
                <View style={styles.button}>
                    <RoundedOptionButton text="Añadir Evaluador" icon="person-add" onPress={() => { router.push(`/(app)/(tabs)/projects/${projectId}/members/addEvaluators`) }} />
                </View>
            }
        </View>;

    // Inside the lists' header so the image, title and buttons scroll with the accounts
    const renderHeader = (project: ProjectMembers) =>
        <View style={styles.header}>
            <Image source={{ uri: `${process.env.EXPO_PUBLIC_CDN_DOMAIN}/${project.coverImageUrl}` }} style={styles.image} />
            <Title text={project.name} />
            {renderButtons()}
        </View>;

    return (
        <SafeAreaView style={styles.screen}>
            {isLoading && <Loading />}

            {!isLoading && isAlertVisible &&
                <CustomAlert
                    message={"Error al obtener la información del proyecto"}
                    isVisible={true}
                    onDismiss={() => router.replace("/(app)/(tabs)")}
                    style="error"
                />
            }

            {isLeaveAlertVisible && <CustomAlert {...leaveAlertProps} />}

            {!isLoading && !project && <NotFoundItem text="Proyecto no encontrado" />}

            {!isLoading && project &&
                <View style={styles.container}>
                    {isAdmin
                        ? <FlatList
                            data={['evaluators', 'members']}
                            keyExtractor={section => section}
                            style={styles.list}
                            contentContainerStyle={styles.sections}
                            ListHeaderComponent={() => renderHeader(project)}
                            renderItem={({ item: section }) =>
                                section === 'evaluators'
                                    ? <Accordion
                                        title="Evaluadores"
                                        content={renderAccounts(evaluators, "No hay evaluadores asignados")}
                                    />
                                    : <Accordion
                                        title="Miembros y Asesor"
                                        content={renderAccounts(project.members, "No hay miembros")}
                                    />
                            }
                        />
                        : <FlatList
                            data={project.members}
                            renderItem={({ item }) => renderAccount(item)}
                            keyExtractor={item => item.id}
                            style={styles.list}
                            contentContainerStyle={styles.accounts}
                            ListHeaderComponent={() => renderHeader(project)}
                        />
                    }
                </View>
            }

            <ConfirmDialog
                isVisible={isLeaveDialogVisible}
                message="¿Está seguro de abandonar este proyecto?"
                variant="danger"
                confirmText="Abandonar"
                onConfirm={handleConfirmLeave}
                onCancel={() => setIsLeaveDialogVisible(false)}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
    },
    container: {
        flex: 1,
        alignSelf: 'center',
        width: '96%',
        gap: 8
    },
    image: {
        alignSelf: 'center',
        width: 300,
        height: 300
    },
    listHeader: {
        alignSelf: 'center',
        width: '90%',
        marginTop: 12,
        marginBottom: 12,
        gap: 8,
    },
    button: {
        height: 48
    },
    list: {
        flex: 1,
        width: '100%'
    },
    header: {
        gap: 8
    },
    sections: {
        gap: 12,
        paddingBottom: 16
    },
    accounts: {
        gap: 8
    },
    emptyText: {
        textAlign: 'center',
        fontSize: 16,
        color: Colors.textSecondary
    }
});