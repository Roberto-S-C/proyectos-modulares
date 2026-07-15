import AddMemberListItem from "@/src/components/Account/AddMemberListItem";
import Loading from "@/src/components/Loading";
import NotFoundItem from "@/src/components/NotFoundItem";
import RoundedOptionButton from "@/src/components/RoundedOptionButton";
import Colors from "@/src/constants/Colors";
import { getAvailableMembers } from "@/src/services/accountService";
import { Account } from "@/src/types/account.type";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AddMembers() {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [order, setOrder] = useState(false);
    const [reload, setReload] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const [selectedAccountId, setSelectedAccountId] = useState<string>('');

    useEffect(() => {
        setIsLoading(true);
        getAvailableMembers().then(res => {
            setAccounts(res.data);
            setIsLoading(false);
        })
    }, [reload]);

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

                {isLoading && <Loading />}

                {!isLoading && accounts.length > 0 &&
                    <FlatList
                        data={accounts}
                        renderItem={({ item }) => <AddMemberListItem account={item} selectedAccountId={selectedAccountId} setSelectedAccountId={setSelectedAccountId} />}
                        keyExtractor={item => item.id}
                        extraData={selectedAccountId}
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
                        ListFooterComponent={() =>
                            <View style={{ marginTop: 16 }}>
                                <RoundedOptionButton text="Añadir Miembro" icon="add" onPress={() => null} />
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