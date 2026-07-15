import Loading from '@/src/components/Loading';
import NotFoundItem from '@/src/components/NotFoundItem';
import Paragraph from '@/src/components/Paragraph';
import Title from '@/src/components/Title';
import Colors from '@/src/constants/Colors';
import axios, { AxiosResponse } from 'axios';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, View } from 'react-native';


interface ProjectImage {
    id: number,
    url: string
}

interface Project {
    id: number,
    name: string,
    status: string,
    description: string,
    images: ProjectImage[]
}

async function getProjectDescription(id: number): Promise<Project | null> {
    const response: AxiosResponse<Project> = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/projects/${id}/description`);
    return response.data;
}

export default function ProjectDescriptionScreen() {
    const { id } = useLocalSearchParams();
    const [project, setProject] = useState<Project | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        getProjectDescription(parseInt(id.toString())).then(project => setProject(project));
        setIsLoading(false);
    }, []);

    return (
        <ScrollView style={styles.screen} contentContainerStyle={{alignItems: 'center'}}>
            {isLoading && <Loading />}

            {!project && <NotFoundItem text='Proyecto no encontrado' />}

            { project && !isLoading &&
                <View style={styles.container}>
                    <Image source={{uri: `${process.env.EXPO_PUBLIC_CDN_DOMAIN}/${project?.images[0].url}`}} style={styles.image} />
                    <Title text={project.name} />
                    <Paragraph text={project.description} />
                </View>
            }
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
    },
    container: {
        alignItems: 'center',
        gap: 8,
        marginVertical: 16, 
        width: '92%',
    },
    image: {
        width: 300,
        height: 300
    },
    description: {
        textAlign: 'justify',
        fontSize: 16,
        color: Colors.textSecondary
    }
});