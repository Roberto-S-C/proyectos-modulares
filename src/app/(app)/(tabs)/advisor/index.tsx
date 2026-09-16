import Loading from '@/src/components/Loading';
import NotFoundItem from '@/src/components/NotFoundItem';
import HeaderSemesterDropdown from '@/src/components/Project/HeaderSemesterDropdown';
import ProjectList from '@/src/components/Project/ProjectList';
import { AuthContext } from '@/src/contexts/AuthContext';
import { getAccountDetails } from '@/src/services/accountService';
import { AccountDetails } from '@/src/types/account.type';
import { Project } from '@/src/types/project.types';
import getPresentationSemesters, { sortSemesters } from '@/src/utils/semesterUtils';
import { useFocusEffect } from 'expo-router';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AdvisorProjectsScreen() {
    const [account, setAccount] = useState<AccountDetails>();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [selectedSemester, setSelectedSemester] = useState<string | null>(null);
    const [advisedProjects, setAdvisedProjects] = useState<Project[]>([]);

    const authContext = useContext(AuthContext);

    const evaluatedSemesters = useMemo(() => {
        const semesters = new Set<string>();
        account?.evaluatedProjects?.forEach(project => semesters.add(project.presentationSemester));
        return sortSemesters(Array.from(semesters));
    }, [account]);

    useFocusEffect(
        useCallback(() => {
            const fetchAccountDetails = async () => {
                try {
                    if (!authContext.authState?.user.id) return;
                    const res = await getAccountDetails(authContext.authState?.user.id);
                    if (res.status === 200) {
                        setAccount(res.data);
                    }
                }
                catch (e) {

                }
                finally {
                    setIsLoading(false);
                }
            }
            fetchAccountDetails();
        }, [])
    )

    useEffect(() => {
        if (evaluatedSemesters.length === 0) return;
        const currentSemester = getPresentationSemesters()[0];
        setSelectedSemester(
            evaluatedSemesters.includes(currentSemester)
                ? currentSemester
                : evaluatedSemesters[evaluatedSemesters.length - 1]
        );
    }, [evaluatedSemesters]);

    useEffect(() => {
        if (account?.advisedProjects) {
            let selectedSemesterProjects = account.advisedProjects.filter(project => project.presentationSemester === selectedSemester);
            setAdvisedProjects(selectedSemesterProjects);
        }
    }, [selectedSemester, account]);

    return (
        <SafeAreaView style={styles.screen}>

            {isLoading && <Loading />}

            {!isLoading && account?.evaluatedProjects && account.evaluatedProjects.length === 0 &&
                <NotFoundItem text='No cuentas con evaluaciones' />
            }

            {!isLoading && account?.evaluatedProjects && account.evaluatedProjects.length > 0 &&
                <HeaderSemesterDropdown
                    text='Asesorias'
                    selectedSemester={selectedSemester}
                    setSelectedSemester={setSelectedSemester}
                    semesters={evaluatedSemesters}
                />
            }

            {!isLoading && account?.evaluatedProjects && account.evaluatedProjects.length > 0 &&
                <View style={styles.list}>
                    <ProjectList projects={advisedProjects} />
                </View>
            }

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        width: '96%',
        marginHorizontal: "auto"
    },
    list: {
        flex: 1,
    }
});