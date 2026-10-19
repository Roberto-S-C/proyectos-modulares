import AddMemberListItem from "@/src/components/Account/AddMemberListItem";
import CustomAlert, { AlertProps } from "@/src/components/CustomAlert";
import Loading from "@/src/components/Loading";
import ModuleCheckbox from "@/src/components/Module/ModuleCheckbox";
import PrimaryButton from "@/src/components/PrimaryButton";
import Colors from "@/src/constants/Colors";
import { searchAccounts } from "@/src/services/accountService";
import { sendNotification } from "@/src/services/notificationService";
import { Account, Role } from "@/src/types/account.type";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { ActivityIndicator, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
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

const MIN_SEARCH_LENGTH = 3;
const MAX_SEARCH_RESULTS = 10;

export default function AddNotificationScreen() {
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
    const [email, setEmail] = useState("");
    const [searchResults, setSearchResults] = useState<Account[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    const router = useRouter();

    const {
        handleSubmit,
        control,
        watch,
        formState: { errors }
    } = useForm<FormInputs>({
        defaultValues: {
            title: "",
            content: ""
        }
    });

    const titleLength = watch("title")?.length ?? 0;
    const contentLength = watch("content")?.length ?? 0;

    // Waits until the ADMIN stops typing before searching
    useEffect(() => {
        const query = email.trim();
        if (query.length < MIN_SEARCH_LENGTH) {
            setSearchResults([]);
            setIsSearching(false);
            return;
        }

        setIsSearching(true);
        const timeout = setTimeout(async () => {
            try {
                const res = await searchAccounts(query, "");
                const accounts: Account[] = res.data ?? [];
                setSearchResults(accounts.filter(account => account.role !== Role.Admin).slice(0, MAX_SEARCH_RESULTS));
            }
            catch (e) {
                setSearchResults([]);
            }
            finally {
                setIsSearching(false);
            }
        }, 300);

        return () => clearTimeout(timeout);
    }, [email]);

    const isAccountSelected = (account: Account) => selectedAccounts.some(selected => selected.id === account.id);

    const toggleAccount = (account: Account) => {
        setSelectedAccounts(previous => previous.some(selected => selected.id === account.id)
            ? previous.filter(selected => selected.id !== account.id)
            : [...previous, account]);
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
        if (roles.length === 0 && selectedAccounts.length === 0) {
            showAlert("Seleccione al menos un rol o una cuenta", 'error');
            return;
        }

        setIsLoading(true);
        try {
            await sendNotification({
                title: data.title.trim(),
                content: data.content.trim(),
                roles,
                receiverIds: selectedAccounts.map(account => account.id)
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

    return (
        <SafeAreaView style={styles.screen} edges={['bottom']}>
            {isLoading && <Loading />}

            {isAlertVisible && <CustomAlert {...alertProps} />}

            {!isLoading &&
                <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
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

                        {selectedAccounts.map(account =>
                            <AddMemberListItem key={account.id} account={account} isSelected={true} onPress={() => toggleAccount(account)} />
                        )}

                        <TextInput
                            style={styles.input}
                            placeholder="Buscar por correo"
                            autoCapitalize="none"
                            keyboardType="email-address"
                            value={email}
                            onChangeText={setEmail}
                        />

                        {isSearching && <ActivityIndicator color={Colors.primary} />}

                        {!isSearching && email.trim().length >= MIN_SEARCH_LENGTH && searchResults.length === 0 &&
                            <Text style={styles.hint}>Cuentas no encontradas</Text>
                        }

                        {!isSearching && searchResults
                            .filter(account => !isAccountSelected(account))
                            .map(account =>
                                <AddMemberListItem key={account.id} account={account} isSelected={false} onPress={() => toggleAccount(account)} />
                            )}
                    </View>

                    <PrimaryButton text="Enviar" icon="send" onPress={handleSubmit(onSubmit)} />
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
        alignItems: "center",
        gap: 16,
        width: "96%",
        marginHorizontal: "auto",
        paddingVertical: 12,
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
    roles: {
        gap: 8,
    },
    hint: {
        textAlign: "center",
        color: Colors.textSecondary,
    },
    formError: {
        fontWeight: "bold",
        color: Colors.error
    }
});
