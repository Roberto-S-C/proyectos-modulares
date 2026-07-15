import ProjectList from '@/src/components/Project/ProjectList';
import Title from '@/src/components/Title';
import axios, { AxiosResponse } from 'axios';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Account {
    id: string,
    name: string,
    lastname: string,
    email: string,
    profile_picture: string,
    role: string,
    projects: any // Evaluators Projects
}

async function getAccountDetails(id: string): Promise<Account | null> {
    const response: AxiosResponse<Account> = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/accounts/${id}`);
    return response.data;
}

export default function EvaluatorHomeScreen() {
    const [account, setAccount] = useState<Account | null>(null);

    useEffect(() => {
        // getAccountDetails(user["cognito:username"]).then(account => setAccount(account))
    }, [])

    return (
        <SafeAreaView style={styles.screen}>
            <FlatList
                data={account?.projects}
                renderItem={({ item }) => <ProjectList projects={[item]} />}
                keyExtractor={(item) => item.id.toString()}
                ListHeaderComponent={
                    <View style={styles.headerContainer}>
                        <Title text="Mis Proyectos" />
                    </View>
                }
                contentContainerStyle={styles.listContent}
                scrollEnabled={true}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        justifyContent: 'center',
        width: '100%',
    },
    headerContainer: {
        alignItems: 'center',
        gap: 16,
        paddingVertical: 16,
    },
    listContent: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});