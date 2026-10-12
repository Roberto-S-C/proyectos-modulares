import ConfirmDialog from "@/src/components/ConfirmDialog";
import CustomAlert, { AlertProps } from "@/src/components/CustomAlert";
import Loading from "@/src/components/Loading";
import ProjectModuleListItem from "@/src/components/Module/ProjectModuleListItem";
import NotFoundItem from "@/src/components/NotFoundItem";
import RoundedOptionButton from "@/src/components/RoundedOptionButton";
import RoundedText from "@/src/components/RoundedText";
import { AuthContext } from "@/src/contexts/AuthContext";
import { addAdminProjectModule, getProjectModules, removeProjectModule } from "@/src/services/projectService";
import { Role } from "@/src/types/account.type";
import { Module } from "@/src/types/module.type";
import { ProjectModules } from "@/src/types/project.types";
import { isAspectosGenerales } from "@/src/utils/moduleUtils";
import { PROJECT_STATUS_VARIANT } from "@/src/utils/projectUtils";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useContext, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type ModuleAction = {
    type: "add" | "remove",
    module: Module
}

export default function ProjectStatusScreen() {
    const { id } = useLocalSearchParams();
    const [project, setProject] = useState<ProjectModules | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    // Kept after closing so the message doesn't go blank during the fade-out
    const [pendingAction, setPendingAction] = useState<ModuleAction | null>(null);
    const [isConfirmDialogVisible, setIsConfirmDialogVisible] = useState(false);

    const [isAlertVisible, setIsAlertVisible] = useState(false);
    const [alertProps, setAlertProps] = useState<AlertProps>({
        message: '',
        onDismiss: () => setIsAlertVisible(false),
        isVisible: false,
        style: 'error'
    });

    const authContext = useContext(AuthContext);
    const isAdmin = authContext.authState?.user?.role === Role.Admin;

    // COMPLETADO and RECHAZADO projects can't have modules added
    const canAddModules = isAdmin && !!project
        && project.projectStatus !== "COMPLETADO" && project.projectStatus !== "RECHAZADO";

    const fetchProjectModules = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await getProjectModules(Number(id));
            if (res.status === 200 && res.data) setProject(res.data);
        }
        catch (e) {

        }
        finally {
            setIsLoading(false);
        }
    }, [id])

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
                await addAdminProjectModule(Number(id), { projectModuleId: module.id });
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

                    <FlatList
                        style={styles.list}
                        data={project.modules}
                        renderItem={({ item }) =>
                            <ProjectModuleListItem
                                id={item.id}
                                name={item.name}
                                status={item.status}
                                onAdd={canAddModules && item.status === "NA" ? () => openConfirmDialog("add", item) : undefined}
                                onDelete={!isAdmin || isAspectosGenerales(item.name) || (item.status !== "REVISION" && item.status !== "NP") ? undefined : () => openConfirmDialog("remove", item)}
                            />
                        }
                        keyExtractor={item => item.id.toString()}
                        ItemSeparatorComponent={() => <View style={{ minHeight: 8 }} />}
                        ListEmptyComponent={<NotFoundItem text="Sin módulos" />}
                    />

                    {isAdmin &&
                        <View style={styles.button}>
                            <RoundedOptionButton text="Modificar Estatus" icon="create" onPress={() => { }} />
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
    list: {
        flex: 1,
    },
    button: {
        height: 60,
    }
});
