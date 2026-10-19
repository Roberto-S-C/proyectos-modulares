import AccountsSelectSheet from "@/src/components/Account/AccountsSelectSheet";
import AddMemberListItem from "@/src/components/Account/AddMemberListItem";
import CustomAlert, { AlertProps } from "@/src/components/CustomAlert";
import Loading from "@/src/components/Loading";
import ModuleCheckbox from "@/src/components/Module/ModuleCheckbox";
import PrimaryButton from "@/src/components/PrimaryButton";
import ProjectSelectListItem from "@/src/components/Project/ProjectSelectListItem";
import ProjectsSelectSheet from "@/src/components/Project/ProjectsSelectSheet";
import RoundedOptionButton from "@/src/components/RoundedOptionButton";
import Colors from "@/src/constants/Colors";
import { sendNotification } from "@/src/services/notificationService";
import { Account, Role } from "@/src/types/account.type";
import { Project } from "@/src/types/project.types";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { BackHandler, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface FormInputs {
    title: string,
    content: string
}

// ADMINs can't be receivers: they see every sent notification in their own list
const RECEIVER_ROLES: { role: Role, label: string }[] = [
    { role: Role.Alumno, label: "Alumnos" },
    { role: Role.Evaluador, label: "Evaluadores" },
    { role: Role.Usuario, label: "Usuarios" },
];

// Step 1: the message (title and content). Step 2: the recipients
type Step = 1 | 2;

export default function AddNotificationScreen() {
    const [step, setStep] = useState<Step>(1);
    const [isLoading, setIsLoading] = useState(false);
    const [isAlertVisible, setIsAlertVisible] = useState(false);
    const [alertProps, setAlertProps] = useState<AlertProps>({
        message: '',
        onDismiss: () => setIsAlertVisible(false),
        isVisible: false,
        style: 'error'
    });

    const [roles, setRoles] = useState<Role[]>([]);
    const [selectedAccounts, setSelectedAccounts] = useState<Account[]>([]);
    const [isAccountsSheetVisible, setIsAccountsSheetVisible] = useState(false);
    const [selectedProjects, setSelectedProjects] = useState<Project[]>([]);
    const [isProjectsSheetVisible, setIsProjectsSheetVisible] = useState(false);

    const router = useRouter();

    // The title and content keep their values while step 2 is shown (react-hook-form doesn't
    // unregister unmounted inputs by default)
    const {
        handleSubmit,
        control,
        watch,
        trigger,
        formState: { errors }
    } = useForm<FormInputs>({
        defaultValues: {
            title: "",
            content: ""
        }
    });

    const titleLength = watch("title")?.length ?? 0;
    const contentLength = watch("content")?.length ?? 0;

    // On step 2, Android's back button returns to step 1 instead of leaving the screen
    useFocusEffect(
        useCallback(() => {
            if (step !== 2) return;
            const subscription = BackHandler.addEventListener("hardwareBackPress", () => {
                setStep(1);
                return true;
            });
            return () => subscription.remove();
        }, [step])
    );

    const goToRecipients = async () => {
        const isMessageValid = await trigger(["title", "content"]);
        if (isMessageValid) setStep(2);
    }

    const removeAccount = (account: Account) => {
        setSelectedAccounts(previous => previous.filter(selected => selected.id !== account.id));
    }

    const removeProject = (project: Project) => {
        setSelectedProjects(previous => previous.filter(selected => selected.id !== project.id));
    }

    const showAlert = (message: string, style: AlertProps['style'], onDismiss?: () => void) => {
        setAlertProps({
            message,
            onDismiss: () => {
                setIsAlertVisible(false);
                onDismiss?.();
            },
            isVisible: true,
            style
        });
        setIsAlertVisible(true);
    }

    const onSubmit: SubmitHandler<FormInputs> = async (data) => {
        if (roles.length === 0 && selectedAccounts.length === 0 && selectedProjects.length === 0) {
            showAlert("Seleccione al menos una cuenta, un proyecto o un rol", 'error');
            return;
        }

        setIsLoading(true);
        try {
            await sendNotification({
                title: data.title.trim(),
                content: data.content.trim(),
                roles,
                receiverIds: selectedAccounts.map(account => account.id),
                projectIds: selectedProjects.map(project => project.id)
            });
            showAlert("Notificación enviada", 'success', () => router.back());
        }
        catch (e) {
            showAlert("No se pudo enviar la notificación", 'error');
        }
        finally {
            setIsLoading(false);
        }
    }

    const renderMessageStep = () =>
        <>
            <View style={styles.field}>
                <View style={styles.labelRow}>
                    <Text style={styles.label}>Título</Text>
                    <Text style={styles.charCount}>{titleLength}/100</Text>
                </View>
                <Controller
                    name="title"
                    control={control}
                    rules={{ validate: value => value.trim().length > 0, maxLength: 100 }}
                    render={({ field: { value, onBlur, onChange } }) =>
                        <TextInput
                            style={styles.input}
                            maxLength={100}
                            onChangeText={onChange}
                            value={value}
                            onBlur={onBlur}
                        />
                    }
                />
                {errors.title && <Text style={styles.formError}>Introduzca un título válido</Text>}
            </View>

            <View style={styles.field}>
                <View style={styles.labelRow}>
                    <Text style={styles.label}>Contenido</Text>
                    <Text style={styles.charCount}>{contentLength}/500</Text>
                </View>
                <Controller
                    name="content"
                    control={control}
                    rules={{ validate: value => value.trim().length > 0, maxLength: 500 }}
                    render={({ field: { value, onBlur, onChange } }) =>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            multiline={true}
                            maxLength={500}
                            onChangeText={onChange}
                            value={value}
                            onBlur={onBlur}
                        />
                    }
                />
                {errors.content && <Text style={styles.formError}>Introduzca un contenido válido</Text>}
            </View>
        </>;

    const renderRecipientsStep = () =>
        <>

            <View style={styles.field}>
                <Text style={styles.label}>Enviar a roles</Text>
                <View style={styles.roles}>
                    {RECEIVER_ROLES.map(({ role, label }) =>
                        <ModuleCheckbox
                            key={role}
                            id={role}
                            name={label}
                            selectedModulesId={roles}
                            onChange={(newRoles: Role[]) => setRoles(newRoles)}
                        />
                    )}
                </View>
            </View>

            <View style={styles.field}>
                <Text style={styles.label}>Enviar a cuentas específicas</Text>

                <View style={styles.selectButton}>
                    <RoundedOptionButton
                        text={selectedAccounts.length > 0 ? `Seleccionar cuentas (${selectedAccounts.length})` : "Seleccionar cuentas"}
                        icon="people"
                        onPress={() => setIsAccountsSheetVisible(true)}
                    />
                </View>

                {/* Tapping a selected account removes it without opening the sheet */}
                {selectedAccounts.map(account =>
                    <AddMemberListItem key={account.id} account={account} isSelected={true} onPress={() => removeAccount(account)} />
                )}
            </View>

            {/* Each project's members and advisor receive it */}
            <View style={styles.field}>
                <Text style={styles.label}>Enviar a proyectos</Text>

                <View style={styles.selectButton}>
                    <RoundedOptionButton
                        text={selectedProjects.length > 0 ? `Seleccionar proyectos (${selectedProjects.length})` : "Seleccionar proyectos"}
                        icon="hammer"
                        onPress={() => setIsProjectsSheetVisible(true)}
                    />
                </View>

                {/* Tapping a selected project removes it without opening the sheet */}
                {selectedProjects.map(project =>
                    <ProjectSelectListItem key={project.id} project={project} isSelected={true} onPress={() => removeProject(project)} />
                )}
            </View>

        </>;

    return (
        <SafeAreaView style={styles.screen} edges={['bottom']}>
            {isLoading && <Loading />}

            {isAlertVisible && <CustomAlert {...alertProps} />}

            {!isLoading &&
                <ScrollView style={styles.form} contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
                    <Text style={styles.stepText}>
                        {step === 1 ? "Paso 1 de 2 · Mensaje" : "Paso 2 de 2 · Destinatarios"}
                    </Text>

                    {step === 1 ? renderMessageStep() : renderRecipientsStep()}
                </ScrollView>
            }

            {/* Outside the form so the step's buttons are always visible */}
            {!isLoading &&
                <View style={styles.footer}>
                    {step === 1 &&
                        <PrimaryButton text="Siguiente" icon="arrow-forward" onPress={goToRecipients} style={styles.footerButton} />
                    }
                    {step === 2 &&
                        <>
                            <PrimaryButton text="Regresar" icon="arrow-back" onPress={() => setStep(1)} style={[styles.footerButton, styles.halfButton]} />
                            <PrimaryButton text="Enviar" icon="send" onPress={handleSubmit(onSubmit)} style={[styles.footerButton, styles.halfButton]} />
                        </>
                    }
                </View>
            }

            <AccountsSelectSheet
                isVisible={isAccountsSheetVisible}
                selected={selectedAccounts}
                onConfirm={setSelectedAccounts}
                onClose={() => setIsAccountsSheetVisible(false)}
            />

            <ProjectsSelectSheet
                isVisible={isProjectsSheetVisible}
                selected={selectedProjects}
                onConfirm={setSelectedProjects}
                onClose={() => setIsProjectsSheetVisible(false)}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
    },
    form: {
        flex: 1,
    },
    container: {
        alignItems: "center",
        gap: 16,
        width: "96%",
        marginHorizontal: "auto",
        paddingVertical: 12,
    },
    stepText: {
        alignSelf: "flex-start",
        fontSize: 14,
        fontWeight: "bold",
        color: Colors.textSecondary,
    },
    footer: {
        flexDirection: "row",
        justifyContent: "center",
        gap: 8,
        paddingVertical: 4,
        paddingHorizontal: "2%",
    },
    footerButton: {
        paddingVertical: 4,
    },
    halfButton: {
        flex: 1,
    },
    field: {
        width: "100%",
        gap: 8,
    },
    labelRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    label: {
        color: Colors.secondary,
        fontSize: 18,
        fontWeight: "bold"
    },
    charCount: {
        color: Colors.textSecondary,
        fontSize: 14,
    },
    input: {
        width: "100%",
        borderRadius: 10,
        borderWidth: 1,
        borderColor: Colors.border,
        padding: 10,
        color: Colors.textPrimary,
    },
    textArea: {
        height: 160,
        textAlignVertical: "top",
    },
    selectButton: {
        height: 48,
    },
    roles: {
        gap: 8,
    },
    formError: {
        fontWeight: "bold",
        color: Colors.error
    }
});
