import Paragraph from '@/src/components/Paragraph';
import Title from '@/src/components/Title';
import { useVideoPlayer, VideoView } from 'expo-video';
import { ScrollView, StyleSheet, View } from 'react-native';

const videoSource = require('@/src/assets/videos/intro.mp4');


export default function UserHomeScreen() {
    const player = useVideoPlayer(videoSource, player => {
        player.loop = true;
        // player.play();
    });

    return (
        <ScrollView>
            <View style={styles.container}>
                <VideoView style={styles.video} player={player} />
                <View style={styles.content}>
                    <Title text='Proyectos Modulares' />
                    <Paragraph text='Los proyectos modulares representan una innovadora forma de abordar el desarrollo de software.' />
                    <Paragraph text='Esta metodología se centra en la división de sistemas complejos en módulos independientes e interconectados.' />
                    <Paragraph text='Los estudiantes tienen la oportunidad de adquirir habilidades fundamentales en diseño de software, trabajo en equipo y resolución de problemas mientras participan en la planificación, implementación y mantenimiento de proyectos reales.' />
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    video: {
        width: 350,
        height: 275,
    },
    content: {
        gap: 12,
        paddingHorizontal: 28
    }
});
