import ConfirmDialog from "@/src/components/ConfirmDialog";
import CustomAlert, { AlertProps } from "@/src/components/CustomAlert";
import Loading from "@/src/components/Loading";
import ProjectModuleListItem from "@/src/components/Module/ProjectModuleListItem";
import NotFoundItem from "@/src/components/NotFoundItem";
import PickerModal from "@/src/components/PickerModal";
import PrimaryButton from "@/src/components/PrimaryButton";
import RoundedOptionButton from "@/src/components/RoundedOptionButton";
import RoundedText from "@/src/components/RoundedText";
import Colors from "@/src/constants/Colors";
import { AuthContext } from "@/src/contexts/AuthContext";
import { addAdminProjectModule, addProjectModule, deleteProject, getProjectMembers, getProjectModules, removeProjectModule, updateProjectStatus } from "@/src/services/projectService";
import { Role } from "@/src/types/account.type";
import { Module } from "@/src/types/module.type";
import { ProjectModules, ProjectStatus } from "@/src/types/project.types";
import { isAspectosGenerales } from "@/src/utils/moduleUtils";
import { PROJECT_STATUS_VARIANT } from "@/src/utils/projectUtils";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useContext, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const STATUS_OPTIONS: ProjectStatus[] = ["APROVADO", "RECHAZADO", "REVISION", "CONDICIONADO", "ATRASADO", "NP", "COMPLETADO"];

type ModuleAction = {
    type: "add" | "remove",
    module: Module
}

export default function ProjectStatusScreen() {
    const { id } = useLocalSearchParams();
    const [project, setProject] = useState<ProjectModules | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isMember, setIsMember] = useState(false);
    // Kept after closing so the message doesn't go blank during the fade-out
    const [pendingAction, setPendingAction] = useState<ModuleAction | null>(null);
    const [isConfirmDialogVisible, setIsConfirmDialogVisible] = useState(false);

    const [isStatusModalVisible, setIsStatusModalVisible] = useState(false);
    const [newStatus, setNewStatus] = useState<ProjectStatus | null>(null);
    const [isStatusConfirmDialogVisible, setIsStatusConfirmDialogVisible] = useState(false);
    const [isDeleteDialogVisible, setIsDeleteDialogVisible] = useState(false);

    const [isAlertVisible, setIsAlertVisible] = useState(false);
    const [alertProps, setAlertProps] = useState<AlertProps>({
        message: '',
        onDismiss: () => setIsAlertVisible(false),
        isVisible: false,
        style: 'error'
    });

    const router = useRouter();

    const authContext = useContext(AuthContext);
    const isAdmin = authContext.authState?.user?.role === Role.Admin;
    const userId = authContext.authState?.user?.id;

    // Only RECHAZADO projects can be deleted
    const canDeleteProject = isAdmin && project?.projectStatus === "RECHAZADO";

    // ADMINs: any project except COMPLETADO and RECHAZADO. Members: REVISION, APROVADO or ATRASADO
    // projects (the backend also checks the semester's module registration window)
    const canAddModules = !!project && (
        (isAdmin && project.projectStatus !== "COMPLETADO" && project.projectStatus !== "RECHAZADO")
        || (isMember && ["REVISION", "APROVADO", "ATRASADO"].includes(project.projectStatus))
    );

    // ADMINs can remove any REVISION/NP module; members only REVISION modules added this semester
    const canRemoveModule = (module: Module) => {
        if (isAspectosGenerales(module.name)) return false;
        if (isAdmin) return module.status === "REVISION" || module.status === "NP";
        return isMember && module.status === "REVISION"
            && !!module.createdSemester && module.createdSemester === module.presentationSemester;
    }

    const fetchProjectModules = useCallback(async () => {
        setIsLoading(true);
        try {
            const [res, membersRes] = await Promise.all([
                getProjectModules(Number(id)),
                getProjectMembers(Number(id)),
            ]);
            if (res.status === 200 && res.data) setProject(res.data);
            if (membersRes.status === 200 && membersRes.data) {
                setIsMember(membersRes.data.members.some((member: { id: string }) => member.id === userId));
            }
        }
        catch (e) {

        }
        finally {
            setIsLoading(false);
        }
    }, [id, userId])

    useFocusEffect(
        useCallback(() => {
            fetchProjectModules();
        }, [fetchProjectModules])
    )

    const showAlert = (message: string, style: AlertProps["style"]) => {
        setAlertProps({
            message,
            onDismiss: () => setIsAlertVisible(false),
            isVisible: true,
            style
        });
        setIsAlertVisible(true);
    }

    const openConfirmDialog = (type: ModuleAction["type"], module: Module) => {
        setPendingAction({ type, module });
        setIsConfirmDialogVisible(true);
    }

    const handleConfirmAction = async () => {
        if (!pendingAction) return;
        const { type, module } = pendingAction;

        setIsConfirmDialogVisible(false);
        setIsLoading(true);
        try {
            if (type === "add") {
                if (isAdmin) await addAdminProjectModule(Number(id), { projectModuleId: module.id });
                else await addProjectModule(Number(id), { projectModuleId: module.id });
            }
            else {
                await removeProjectModule(Number(id), module.id);
            }
            // Refetched because adding/removing a module can change the project status (e.g. REVISION, ATRASADO)
            await fetchProjectModules();
            showAlert(type === "add" ? `Módulo agregado` : `Módulo eliminado`, "success");
        }
        catch (e: any) {
            if (type === "add") {
                showAlert(e?.response?.status === 409
                    ? "Este módulo no puede ser agregado"
                    : "No se pudo agregar el módulo", "error");
            }
            else {
                showAlert(e?.response?.status === 409
                    ? "Este módulo no puede ser eliminado"
                    : "No se pudo eliminar el módulo", "error");
            }
        }
        finally {
            setIsLoading(false);
        }
    }

    // The picker modal closes before the confirmation opens, two modals can't be stacked on iOS
    const handleStatusSubmit = (status: ProjectStatus) => {
        setNewStatus(status);
        setIsStatusModalVisible(false);
        setIsStatusConfirmDialogVisible(true);
    }

    const handleConfirmStatusChange = async () => {
        if (!newStatus) return;

        setIsStatusConfirmDialogVisible(false);
        setIsLoading(true);
        try {
            await updateProjectStatus(Number(id), { status: newStatus });
            // Refetched because APROVADO also approves every REVISION/NP module
            await fetchProjectModules();
            showAlert("Estatus actualizado", "success");
        }
        catch (e: any) {
            showAlert("No se pudo actualizar el estatus", "error");
        }
        finally {
            setIsLoading(false);
        }
    }

    const handleConfirmDeleteProject = async () => {
        setIsDeleteDialogVisible(false);
        setIsLoading(true);
        try {
            await deleteProject(Number(id));
            setAlertProps({
                message: "Proyecto eliminado",
                // The project is gone, so leave its screens for the projects list
                onDismiss: () => {
                    setIsAlertVisible(false);
                    router.dismissTo("/(app)/(tabs)/projects");
                },
                isVisible: true,
                style: "success"
            });
            setIsAlertVisible(true);
        }
        catch (e: any) {
            showAlert(e?.response?.status === 409
                ? "Este proyecto no puede ser eliminado"
                : "No se pudo eliminar el proyecto", "error");
        }
        finally {
            setIsLoading(false);
        }
    }

    return (
        <SafeAreaView style={styles.screen}>
            {isLoading && <Loading />}

            {isAlertVisible && <CustomAlert {...alertProps} />}

            {!isLoading && !project && <NotFoundItem text="Proyecto no encontrado" />}

            {!isLoading && project &&
                <View style={styles.container}>
                    <View style={styles.statusContainer}>
                        <RoundedText text={project.projectStatus} fontSize={20} variant={PROJECT_STATUS_VARIANT[project.projectStatus]} />
                    </View>

                    {canDeleteProject &&
                        <View style={styles.deleteButtonContainer}>
                            <PrimaryButton
                                text="Eliminar Proyecto"
                                icon="trash"
                                onPress={() => setIsDeleteDialogVisible(true)}
                                style={styles.deleteButton}
                            />
                        </View>
                    }

                    <FlatList
                        style={styles.list}
                        data={project.modules}
                        renderItem={({ item }) =>
                            <ProjectModuleListItem
                                id={item.id}
                                name={item.name}
                                status={item.status}
                                onAdd={canAddModules && item.status === "NA" ? () => openConfirmDialog("add", item) : undefined}
                                onDelete={canRemoveModule(item) ? () => openConfirmDialog("remove", item) : undefined}
                            />
                        }
                        keyExtractor={item => item.id.toString()}
                        ItemSeparatorComponent={() => <View style={{ minHeight: 8 }} />}
                        ListEmptyComponent={<NotFoundItem text="Sin módulos" />}
                    />

                    {isAdmin &&
                        <View style={styles.button}>
                            <RoundedOptionButton text="Modificar Estatus" icon="create" onPress={() => setIsStatusModalVisible(true)} />
                        </View>
                    }
                </View>
            }

            <ConfirmDialog
                isVisible={isConfirmDialogVisible}
                message={pendingAction?.type === "add"
                    ? `¿Agregar el módulo "${pendingAction.module.name}" al proyecto?`
                    : `¿Eliminar el módulo "${pendingAction?.module.name}" del proyecto?`}
                variant={pendingAction?.type === "add" ? "default" : "danger"}
                confirmText={pendingAction?.type === "add" ? "Agregar" : "Eliminar"}
                onConfirm={handleConfirmAction}
                onCancel={() => setIsConfirmDialogVisible(false)}
            />

            {project &&
                <PickerModal
                    isVisible={isStatusModalVisible}
                    title="Modificar Estatus"
                    options={STATUS_OPTIONS}
                    currentValue={project.projectStatus}
                    onSubmit={handleStatusSubmit}
                    onClose={() => setIsStatusModalVisible(false)}
                />
            }

            <ConfirmDialog
                isVisible={isStatusConfirmDialogVisible}
                message={`¿Cambiar el estatus del proyecto de ${project?.projectStatus} a ${newStatus}?`}
                confirmText="Actualizar"
                onConfirm={handleConfirmStatusChange}
                onCancel={() => setIsStatusConfirmDialogVisible(false)}
            />

            <ConfirmDialog
                isVisible={isDeleteDialogVisible}
                message="¿Está seguro de eliminar este proyecto? Esta acción será permanente"
                variant="danger"
                confirmText="Eliminar"
                onConfirm={handleConfirmDeleteProject}
                onCancel={() => setIsDeleteDialogVisible(false)}
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
        gap: 16,
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    statusContainer: {
        alignItems: 'center',
    },
    deleteButtonContainer: {
        alignItems: 'center',
    },
    deleteButton: {
        width: '80%',
        backgroundColor: Colors.error,
    },
    list: {
        flex: 1,
    },
    button: {
        height: 60,
    }
});
