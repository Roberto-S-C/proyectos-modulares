import Loading from "@/src/components/Loading";
import NotFoundItem from "@/src/components/NotFoundItem";
import PresentationSemesterListItem from "@/src/components/PresentationSemester/PresentationSemesterListItem";
import RoundedOptionButton from "@/src/components/RoundedOptionButton";
import { getPresentationSemesters } from "@/src/services/presentationSemesterService";
import { PresentationSemester } from "@/src/types/presentationSemester.type";
import { sortSemesters } from "@/src/utils/semesterUtils";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AdminCalendarScreen() {
    const [presentationSemesters, setPresentationSemesters] = useState<PresentationSemester[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useFocusEffect(
        useCallback(() => {
            setIsLoading(true);
            const fetchPresentationSemesters = async () => {
                try {
                    const res = await getPresentationSemesters();
                    const semesters: PresentationSemester[] = res.data;
                    const order = sortSemesters(semesters.map(item => item.semester)).reverse();
                    setPresentationSemesters([...semesters].sort((a, b) => order.indexOf(a.semester) - order.indexOf(b.semester)));
                }
                catch (e) {
                    setPresentationSemesters([]);
                }
                finally {
                    setIsLoading(false);
                }
            }
            fetchPresentationSemesters();
        }, [])
    );

    return (
        <SafeAreaView style={styles.screen}>
            {isLoading && <Loading />}

            {!isLoading &&
                <View style={styles.addButton}>
                    <RoundedOptionButton text="Añadir Semestre" icon="add" onPress={() => router.push("/(app)/admin/calendar/add")} />
                </View>
            }

            {!isLoading && presentationSemesters.length === 0 && <NotFoundItem text="No hay semestres disponibles" />}

            {!isLoading && presentationSemesters.length > 0 &&
                <View style={styles.container}>
                    <FlatList
                        data={presentationSemesters}
                        renderItem={({ item }) =>
                            <PresentationSemesterListItem {...item} onPress={() => router.push({ pathname: "/(app)/admin/calendar/[id]", params: { id: item.id } })} />
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
