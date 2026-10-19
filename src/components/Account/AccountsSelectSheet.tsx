import AddMemberListItem from "@/src/components/Account/AddMemberListItem";
import PrimaryButton from "@/src/components/PrimaryButton";
import Colors from "@/src/constants/Colors";
import { searchAccounts } from "@/src/services/accountService";
import { Account, Role } from "@/src/types/account.type";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, KeyboardAvoidingView, Modal, Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface Props {
    isVisible: boolean,
    selected: Account[],
    onConfirm: (accounts: Account[]) => void,
    onClose: () => void,
}

const MIN_SEARCH_LENGTH = 3;
const MAX_SEARCH_RESULTS = 10;

/**
 * Bottom sheet to search accounts by email and select several. It edits a draft copy of
 * `selected`: only "Confirmar" hands it back, closing it any other way discards the changes.
 * ADMIN accounts aren't listed (they can't receive notifications).
 */
export default function AccountsSelectSheet({ isVisible, selected, onConfirm, onClose }: Props) {
    const [draft, setDraft] = useState<Account[]>([]);
    const [email, setEmail] = useState("");
    const [results, setResults] = useState<Account[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    const insets = useSafeAreaInsets();

    // Starts from the current selection and an empty search every time it opens
    useEffect(() => {
        if (isVisible) {
            setDraft(selected);
            setEmail("");
            setResults([]);
        }
    }, [isVisible]);

    // Waits until the ADMIN stops typing before searching
    useEffect(() => {
        const query = email.trim();
        if (query.length < MIN_SEARCH_LENGTH) {
            setResults([]);
            setIsSearching(false);
            return;
        }

        setIsSearching(true);
        const timeout = setTimeout(async () => {
            try {
                const res = await searchAccounts(query, "");
                const accounts: Account[] = res.data ?? [];
                setResults(accounts.filter(account => account.role !== Role.Admin).slice(0, MAX_SEARCH_RESULTS));
            }
            catch (e) {
                setResults([]);
            }
            finally {
                setIsSearching(false);
            }
        }, 300);

        return () => clearTimeout(timeout);
    }, [email]);

    const isInDraft = (account: Account) => draft.some(selectedAccount => selectedAccount.id === account.id);

    const toggleAccount = (account: Account) => {
        setDraft(previous => previous.some(selectedAccount => selectedAccount.id === account.id)
            ? previous.filter(selectedAccount => selectedAccount.id !== account.id)
            : [...previous, account]);
    }

    // Search results go first so the keyboard doesn't cover them; selected accounts follow (a
    // selected account that's also a result is only listed once, among the results, checked)
    const listedAccounts = [...results, ...draft.filter(account => !results.some(result => result.id === account.id))];

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}
            statusBarTranslucent={true}
            navigationBarTranslucent={true}
        >
            <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === "ios" ? "padding" : undefined}>
                <Pressable style={styles.backdrop} onPress={onClose} />

                <View style={[styles.sheet, { paddingBottom: insets.bottom + 16 }]}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Seleccionar cuentas</Text>
                        <Pressable onPress={onClose} style={styles.closeButton}>
                            <Ionicons name="close" size={28} color={Colors.textSecondary} />
                        </Pressable>
                    </View>

                    <TextInput
                        style={styles.input}
                        placeholder="Buscar por correo"
                        autoCapitalize="none"
                        keyboardType="email-address"
                        value={email}
                        onChangeText={setEmail}
                    />

                    <FlatList
                        style={styles.list}
                        contentContainerStyle={styles.listContent}
                        data={listedAccounts}
                        keyExtractor={item => item.id}
                        keyboardShouldPersistTaps="handled"
                        renderItem={({ item }) =>
                            <AddMemberListItem account={item} isSelected={isInDraft(item)} onPress={() => toggleAccount(item)} />
                        }
                        // Above the list, next to the search box, so the keyboard never covers it
                        ListHeaderComponent={
                            <>
                                {isSearching && <ActivityIndicator color={Colors.primary} />}
                                {!isSearching && email.trim().length >= MIN_SEARCH_LENGTH && results.length === 0 &&
                                    <Text style={styles.hint}>Cuentas no encontradas</Text>
                                }
                                {!isSearching && email.trim().length < MIN_SEARCH_LENGTH && draft.length === 0 &&
                                    <Text style={styles.hint}>Escriba al menos {MIN_SEARCH_LENGTH} caracteres del correo</Text>
                                }
                            </>
                        }
                    />

                    <PrimaryButton
                        text={`Confirmar (${draft.length})`}
                        onPress={() => {
                            onConfirm(draft);
                            onClose();
                        }}
                        style={styles.button}
                    />
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
    },
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    sheet: {
        height: '75%',
        gap: 12,
        paddingTop: 16,
        paddingHorizontal: 16,
        backgroundColor: Colors.itemBackgroundColor,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.primary,
    },
    closeButton: {
        position: 'absolute',
        right: 0,
    },
    input: {
        width: '100%',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: Colors.border,
        padding: 10,
        color: Colors.textPrimary,
    },
    list: {
        flex: 1,
    },
    listContent: {
        gap: 4,
        paddingBottom: 8,
    },
    hint: {
        textAlign: 'center',
        marginBottom: 8,
        color: Colors.textSecondary,
    },
    button: {
        alignSelf: 'center',
    },
});
