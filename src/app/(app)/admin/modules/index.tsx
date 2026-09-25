import Loading from "@/src/components/Loading";
import ModuleListItem from "@/src/components/Module/Module";
import NotFoundItem from "@/src/components/NotFoundItem";
import RoundedOptionButton from "@/src/components/RoundedOptionButton";
import { getModules } from "@/src/services/moduleService";
import { AdminModule } from "@/src/types/module.type";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AdminModulesScreen() {
    const [modules, setModules] = useState<AdminModule[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useFocusEffect(
        useCallback(() => {
            setIsLoading(true);
            const fetchModules = async () => {
                try {
                    const res = await getModules();
                    setModules(res.data);
                }
                catch (e) {
                    setModules([]);
                }
                finally {
                    setIsLoading(false);
                }
            }
            fetchModules();
        }, [])
    );

    return (
        <SafeAreaView style={styles.screen}>
            {isLoading && <Loading />}

            {!isLoading &&
                <View style={styles.addButton}>
                    <RoundedOptionButton text="Añadir Módulo" icon="add" onPress={() => router.push("/(app)/admin/modules/add")} />
                </View>
            }

            {!isLoading && modules.length === 0 && <NotFoundItem text="No hay módulos disponibles" />}

            {!isLoading && modules.length > 0 &&
                <View style={styles.container}>
                    <FlatList
                        data={modules}
                        renderItem={({ item }) =>
                            <ModuleListItem {...item} onPress={() => router.push({ pathname: "/(app)/admin/modules/[id]", params: { id: item.id } })} />
                        }
                        keyExtractor={item => item.id.toString()}
                        contentContainerStyle={styles.list}
                    />
                </View>
            }
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1
    },
    container: {
        flex: 1,
        padding: 16
    },
    addButton: {
        height: 48,
        marginHorizontal: 16,
        marginTop: 16
    },
    list: {
        gap: 8
    }
});
