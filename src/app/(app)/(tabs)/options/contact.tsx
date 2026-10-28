import CustomAlert, { AlertProps } from "@/src/components/CustomAlert";
import PrimaryButton from "@/src/components/PrimaryButton";
import SelectField from "@/src/components/SelectField";
import Colors from "@/src/constants/Colors";
import { AuthContext } from "@/src/contexts/AuthContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as Linking from "expo-linking";
import { useContext, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Every address here receives the messages; add more to reach other developers
const DEVELOPERS_EMAILS: string[] = ["robertosanchezcazares@gmail.com"];

const REASONS = ["Reportar un problema", "Sugerencia", "Otro"] as const;
type Reason = typeof REASONS[number];

const SUBJECT_MAX_LENGTH = 100;
const MESSAGE_MAX_LENGTH = 1000;

interface FormInputs {
    reason: Reason | '',
    subject: string,
    message: string
}

export default function ContactScreen() {
    const [isAlertVisible, setIsAlertVisible] = useState(false);
    const [alertProps, setAlertProps] = useState<AlertProps>({
        message: '',
        onDismiss: () => setIsAlertVisible(false),
        isVisible: false,
        style: 'error'
    });

    const authContext = useContext(AuthContext);

    const {
        handleSubmit,
        control,
        watch,
        reset,
        formState: { errors }
    } = useForm<FormInputs>({
        defaultValues: { reason: '', subject: '', message: '' }
    });

    const subjectLength = watch("subject")?.length ?? 0;
    const messageLength = watch("message")?.length ?? 0;

    // Opens the user's mail app with the email ready, so it's sent from their own address
    const onSubmit: SubmitHandler<FormInputs> = async (data) => {
        const user = authContext.authState?.user;
        const subject = `[Proyectos Modulares] ${data.reason}: ${data.subject.trim()}`;
        // The account and role help find who wrote, the sender's email is already on the email
        const body = `${data.message.trim()}\n\n---\nRol: ${user?.role ?? 'Desconocido'}\nCuenta: ${user?.id ?? 'Desconocida'}`;
        const url = `mailto:${DEVELOPERS_EMAILS.join(',')}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

        try {
            // Not checked with canOpenURL first: on iOS that needs the scheme declared in the Info.plist
            await Linking.openURL(url);
            reset();
        }
        catch (e) {
            setAlertProps({
                message: `No se encontró una aplicación de correo. Escríbenos a ${DEVELOPERS_EMAILS.join(', ')}`,
                onDismiss: () => setIsAlertVisible(false),
                isVisible: true,
                style: 'error'
            });
            setIsAlertVisible(true);
        }
    }

    return (
        <SafeAreaView style={styles.screen} edges={['bottom']}>
            {isAlertVisible && <CustomAlert {...alertProps} />}

            <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag">
                {/* The header already shows the "Contacto" title */}
                <Ionicons name="mail" size={80} color={Colors.secondary} />
                <Text style={styles.description}>Envíanos tus dudas, problemas o sugerencias sobre la aplicación.</Text>

                <View style={styles.field}>
                    <Text style={styles.label}>Motivo</Text>
                    <Controller
                        name="reason"
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { value, onChange } }) =>
                            <SelectField
                                value={value}
                                onChange={onChange}
                                placeholder="Seleccionar motivo"
                                title="Motivo"
                                options={REASONS.map(reason => ({ label: reason, value: reason }))}
                            />
                        }
                    />
                    {errors.reason && <Text style={styles.formError}>Seleccione un motivo</Text>}
                </View>

                <View style={styles.field}>
                    <View style={styles.labelRow}>
                        <Text style={styles.label}>Asunto</Text>
                        <Text style={styles.charCount}>{subjectLength}/{SUBJECT_MAX_LENGTH}</Text>
                    </View>
                    <Controller
                        name="subject"
                        control={control}
                        rules={{ required: true, validate: value => value.trim().length > 0 }}
                        render={({ field: { value, onBlur, onChange } }) =>
                            <TextInput
                                style={styles.input}
                                maxLength={SUBJECT_MAX_LENGTH}
                                placeholder="Asunto"
                                onChangeText={onChange}
                                onBlur={onBlur}
                                value={value}
                            />
                        }
                    />
                    {errors.subject && <Text style={styles.formError}>Introduzca un asunto</Text>}
                </View>

                <View style={styles.field}>
                    <View style={styles.labelRow}>
                        <Text style={styles.label}>Mensaje</Text>
                        <Text style={styles.charCount}>{messageLength}/{MESSAGE_MAX_LENGTH}</Text>
                    </View>
                    <Controller
                        name="message"
                        control={control}
                        rules={{ required: true, validate: value => value.trim().length > 0 }}
                        render={({ field: { value, onBlur, onChange } }) =>
                            <TextInput
                                style={[styles.input, styles.textArea]}
                                multiline={true}
                                maxLength={MESSAGE_MAX_LENGTH}
                                placeholder="Escribe tu mensaje"
                                onChangeText={onChange}
                                onBlur={onBlur}
                                value={value}
                            />
                        }
                    />
                    {errors.message && <Text style={styles.formError}>Introduzca un mensaje</Text>}
                </View>

                <PrimaryButton text="Enviar" icon="send" onPress={handleSubmit(onSubmit)} style={styles.button} />

                {/* Shown so users without a mail app can still copy the addresses */}
                <View style={styles.hint}>
                    <Text style={styles.hintText}>Correo de contacto:</Text>
                    {DEVELOPERS_EMAILS.map(email =>
                        <Text key={email} style={styles.hintEmail} selectable>{email}</Text>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
    },
    container: {
        flexGrow: 1,
        alignItems: "center",
        gap: 16,
        width: "92%",
        marginHorizontal: "auto",
        paddingVertical: 16,
    },
    description: {
        textAlign: "center",
        fontSize: 16,
        color: Colors.textSecondary,
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
        // Explicit, since iOS inputs have no default padding
        padding: 10,
        color: Colors.textPrimary,
    },
    textArea: {
        height: 200,
        textAlignVertical: "top",
    },
    button: {
        width: "100%",
    },
    hint: {
        alignItems: "center",
        gap: 4,
    },
    hintText: {
        fontSize: 14,
        color: Colors.textSecondary,
    },
    hintEmail: {
        fontSize: 14,
        fontWeight: "bold",
        color: Colors.primary,
    },
    formError: {
        fontWeight: "bold",
        color: Colors.error
    }
});
