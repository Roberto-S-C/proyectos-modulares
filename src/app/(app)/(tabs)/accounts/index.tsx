import AccountListItem from "@/src/components/Account/AccountListItem";
import Loading from "@/src/components/Loading";
import NotFoundItem from "@/src/components/NotFoundItem";
import SelectField from "@/src/components/SelectField";
import Colors from "@/src/constants/Colors";
import { searchAccounts } from "@/src/services/accountService";
import { Account, Role } from "@/src/types/account.type";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AccountsScreen() {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');
    const [order, setOrder] = useState(false);
    const [reload, setReload] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const router = useRouter();

    useEffect(() => {
        setIsLoading(true);
        searchAccounts(email, role).then(res => {
            setAccounts(res.data);
            setIsLoading(false);
        })
        setReload(false);
    }, [email, role, reload]);

    useEffect(() => {
        const sortedAccounts = [...accounts].sort((a, b) => {
            if (a.name < b.name) return order ? -1 : 1;
            if (a.name > b.name) return order ? 1 : -1;
            return 0;
        });

        setAccounts(sortedAccounts);
    }, [order])

    return (
        <SafeAreaView style={styles.screen}>

            <View style={styles.container}>

                <TextInput
                    style={styles.textInput}
                    placeholder="Correo"
                    onChangeText={setEmail}
                />

                <View style={styles.filtersContainer}>

                    <SelectField
                        value={role}
                        onChange={setRole}
                        placeholder="Rol"
                        options={[
                            { label: 'Todos', value: '' },
                            ...[Role.Admin, Role.Evaluador, Role.Alumno, Role.Usuario].map(roleOption => ({ label: roleOption, value: roleOption }))
                        ]}
                        style={styles.picker}
                    />

                </View>

                {isLoading && <Loading />}

                {!isLoading && accounts.length > 0 &&
                    <FlatList
                        data={accounts}
                        renderItem={({ item }) => <AccountListItem {...item} onPress={() => router.push({ pathname: '/(app)/(tabs)/accounts/[id]', params: { id: item.id } })} />}
                        keyExtractor={item => item.id}
                        style={styles.list}
                        contentContainerStyle={styles.listContent}
                        ListHeaderComponent={() =>
                            <View style={styles.listHeader}>
                                <TouchableOpacity onPress={() => setOrder(!order)}>
                                    <Ionicons name="swap-vertical" size={36} color={order ? Colors.textPrimary : Colors.textSecondary} />
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => setReload(!reload)}>
                                    <Ionicons name="reload" size={36} color={Colors.textPrimary} />
                                </TouchableOpacity>
                            </View>
                        }
                    />
                }
                {!isLoading && accounts.length === 0 &&
                    <NotFoundItem text="Cuentas no encontradas" />
                }
            </View>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        alignItems: 'center',
    },
    container: {
        flex: 1,
        alignItems: 'stretch',
        gap: 4,
        margin: 8,
        width: '96%',
    },
    textInputContainer: {
        flexDirection: 'row'
    },
    textInput: {
        margin: 16,
        // iOS inputs have no default padding and shrink to the text; same height as the filters below
        minHeight: 52,
        paddingHorizontal: 12,
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'semibold',
        color: Colors.textSecondary,
        borderRadius: 10,

        backgroundColor: Colors.itemBackgroundColor,

        // iOS
        shadowColor: Colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 8,

        // Android
        elevation: 4,
    },
    filtersContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: 16,
        gap: 8
    },
    picker: {
        flex: 1,
        minHeight: 52,
        borderWidth: 0,
        backgroundColor: Colors.itemBackgroundColor,

        // iOS
        shadowColor: Colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 8,

        // Android
        elevation: 4,
    },
    list: {
        flex: 1,
    },
    listContent: {
        padding: 16,
    },
    listHeader: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 16
    }
});
