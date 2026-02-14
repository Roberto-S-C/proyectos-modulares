import AccountListItem from "@/src/components/AccountListItem";
import Loading from "@/src/components/Loading";
import NotFoundItem from "@/src/components/NotFoundItem";
import Colors from "@/src/constants/Colors";
import Ionicons from '@expo/vector-icons/Ionicons';
import { Picker } from '@react-native-picker/picker';
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

enum Role {
    Admin = 'ROLE_ADMIN',
    Evaluador = 'ROLE_EVALUADOR',
    Alumno = 'ROLE_ALUMNO',
    Usuario = 'ROLE_USUARIO',
}

interface Account {
    id: string,
    name: string,
    lastname: string,
    email: string,
    role: Role
}

async function fetchUsers(email: string, role: string): Promise<Account[]> {
    let params = { email, role }
    let queryString = new URLSearchParams(params).toString();
    let apiUrl = `${process.env.EXPO_PUBLIC_API_URL}/accounts?${queryString}`;
    let response = await fetch(apiUrl)
    let users = await response.json();
    return users;
}

export default function UsersScreen() {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');
    const [order, setOrder] = useState(false);
    const [reload, setReload] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        fetchUsers(email, role)
            .then(data => {
                setAccounts(data)
                setIsLoading(false);
            });
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
                    placeholder="Correo..."
                    onChangeText={setEmail}
                />

                <View style={styles.filtersContainer}>

                    <Picker
                        selectedValue={role}
                        onValueChange={(itemValue) =>
                            setRole(itemValue)}
                        style={styles.picker}
                        selectionColor={Colors.secondary}
                    >
                        <Picker.Item label='ROL' value='' style={styles.pickerItem} />
                        <Picker.Item label={Role.Admin.split('_')[1]} value={Role.Admin} style={styles.pickerItem} />
                        <Picker.Item label={Role.Evaluador.split('_')[1]} value={Role.Evaluador} style={styles.pickerItem} />
                        <Picker.Item label={Role.Alumno.split('_')[1]} value={Role.Alumno} style={styles.pickerItem} />
                        <Picker.Item label={Role.Usuario.split('_')[1]} value={Role.Usuario} style={styles.pickerItem} />
                    </Picker>

                </View>

                {isLoading && <Loading />}

                {!isLoading && accounts.length > 0 &&
                    <FlatList
                        data={accounts}
                        renderItem={({ item }) => <AccountListItem {...item} />}
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
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'semibold',
        color: Colors.textSecondary,
        // borderRadius: 8,

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
        alignItems: 'center',
        height: 52,
        color: Colors.textPrimary,
        backgroundColor: Colors.itemBackgroundColor,

        // iOS
        shadowColor: Colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 8,

        // Android
        elevation: 4,
    },
    pickerItem: {
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.textSecondary
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
