import Loading from '@/src/components/Loading';
import NotFoundItem from '@/src/components/NotFoundItem';
import ProjectList from '@/src/components/Project/ProjectList';
import SemesterPicker from '@/src/components/SemesterPicker';
import Colors from '@/src/constants/Colors';
import { AuthContext } from '@/src/contexts/AuthContext';
import { getAccountDetails } from '@/src/services/accountService';
import { AccountDetails } from '@/src/types/account.type';
import { Project } from '@/src/types/project.types';
import getPresentationSemesters, { sortSemesters } from '@/src/utils/semesterUtils';
import { useContext, useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function EvaluatorHomeScreen() {
    const [account, setAccount] = useState<AccountDetails>();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [selectedSemester, setSelectedSemester] = useState<string | null>(null);
    const [evaluatedProjects, setEvaluatedProjects] = useState<Project[]>([]);

    const authContext = useContext(AuthContext);

    const evaluatedSemesters = useMemo(() => {
        const semesters = new Set<string>();
        account?.evaluatedProjects?.forEach(project => semesters.add(project.presentationDate));
        return sortSemesters(Array.from(semesters));
    }, [account]);

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


    useEffect(() => {
        if (account?.evaluatedProjects) {
            let selectedSemesterProjects = account.evaluatedProjects.filter(project => project.presentationDate === selectedSemester);
            setEvaluatedProjects(selectedSemesterProjects);
        }
    }, [selectedSemester, account]);

    return (
        <SafeAreaView style={styles.screen}>

            {isLoading && <Loading />}

            {!isLoading && account?.evaluatedProjects && account.evaluatedProjects.length === 0 &&
                <NotFoundItem text='No cuentas con evaluaciones' />
            }

            {!isLoading && account?.evaluatedProjects && account.evaluatedProjects.length > 0 &&
                <View style={styles.headerContainer}>
                    <Text style={styles.headerText}>Evaluaciones</Text>
                    <SemesterPicker
                        value={selectedSemester}
                        onChange={setSelectedSemester}
                        semesters={evaluatedSemesters}
                        style={styles.semesterPicker}
                    />
                </View>
            }

            {!isLoading && account?.evaluatedProjects && account.evaluatedProjects.length > 0 &&
                <View style={styles.list}>
                    <ProjectList projects={evaluatedProjects} />
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
    headerContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: 'center',
        gap: 16,
        paddingVertical: 16,
        marginHorizontal: 8
    },
    headerText: {
        fontSize: 28,
        fontWeight: "bold",
        color: Colors.secondary,
    },
    semesterPicker: {
        flex: 1,
        maxWidth: 160
    },
    list: {
        flex: 1,
    }
});