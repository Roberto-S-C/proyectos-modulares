import AddMemberListItem from "@/src/components/Account/AddMemberListItem";
import CustomAlert, { AlertProps } from "@/src/components/CustomAlert";
import Loading from "@/src/components/Loading";
import NotFoundItem from "@/src/components/NotFoundItem";
import RoundedOptionButton from "@/src/components/RoundedOptionButton";
import Colors from "@/src/constants/Colors";
import { getAvailableMembers } from "@/src/services/accountService";
import { addProjectMember } from "@/src/services/projectService";
import { Account } from "@/src/types/account.type";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AddMembers() {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [order, setOrder] = useState(false);
    const [reload, setReload] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isAlertVisible, setIsAlertVisible] = useState(false);
    const [aletProps, setAlertProps] = useState<AlertProps>({
        message: "",
        onDismiss: () => setIsAlertVisible(false),
        isVisible: isAlertVisible,
        style: "error"
    });

    const [selectedAccountId, setSelectedAccountId] = useState<string>("");
    const seachParams = useLocalSearchParams<{ id: string }>();
    const projectId = Number(seachParams.id);

    const router = useRouter();

    useFocusEffect(
        useCallback(() => {
            setIsLoading(true);
            const fetchAvailableMembers = async () => {
                try {
                    const res = await getAvailableMembers();
                    setAccounts(res.data);
                }
                catch (e) {

                }
                finally {
                    setIsLoading(false);
                }
            }
            fetchAvailableMembers();
        }, [reload])
    );

    useEffect(() => {
        const sortedAccounts = [...accounts].sort((a, b) => {
            if (a.name < b.name) return order ? -1 : 1;
            if (a.name > b.name) return order ? 1 : -1;
            return 0;
        });

        setAccounts(sortedAccounts);
    }, [order])

    const onSubmit = async () => {
        setIsLoading(true);
        try {
            const res = await addProjectMember(projectId, { memberId: selectedAccountId });
            if (res.status === 200) {
                setAlertProps({
                    message: "Miembro añadido",
                    onDismiss: () => router.replace("/(app)/(tabs)"),
                    isVisible: true,
                    style: "success"
                });
                setIsAlertVisible(true);
            }
            else throw new Error("Unable to add member to project");
        }
        catch (e) {
            setAlertProps({
                ...aletProps,
                message: 'No es posible añadir al miembro',
                isVisible: true,
                style: 'error'
            });
        }
        finally {
            setIsLoading(false);
            setIsAlertVisible(true);
        }
    }

    return (
        <SafeAreaView style={styles.screen}>

            <View style={styles.container}>

                {isLoading && <Loading />}

                {!isLoading && isAlertVisible &&
                    <CustomAlert {...aletProps} />
                }

                {!isLoading && accounts.length > 0 &&
                    <FlatList
                        data={accounts}
                        renderItem={({ item }) => <AddMemberListItem account={item} isSelected={selectedAccountId === item.id} onPress={() => setSelectedAccountId(item.id)} />}
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
                                <RoundedOptionButton text="Añadir Miembro" icon="add" onPress={onSubmit} />
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