import Paragraph from '@/components/Paragraph';
import Title from '@/components/Title';
import { useVideoPlayer, VideoView } from 'expo-video';
import { StyleSheet, View } from 'react-native';

const videoSource = require('../../../assets/videos/intro.mp4');


export default function UserHomeScreen() {
    const player = useVideoPlayer(videoSource, player => {
        player.loop = true;
        player.play();
    });

    return (
        <View style={styles.container}>
            <VideoView style={styles.video} player={player} />
            <View style={styles.content}>
                <Title text='Proyectos Modulares' />
                <Paragraph text='Los proyectos modulares representan una innovadora forma de abordar el desarrollo de software. Esta metodología se centra en la división de sistemas complejos en módulos independientes e interconectados, lo que permite una gestión más eficiente y una mayor flexibilidad en el proceso de desarrollo.' />
                <Paragraph text='Los estudiantes tienen la oportunidad de adquirir habilidades fundamentales en diseño de software, trabajo en equipo y resolución de problemas mientras participan en la planificación, implementación y mantenimiento de proyectos reales.' />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        // paddingHorizontal: 50,
    },
    video: {
        width: 350,
        height: 275,
    },
    content: {
        justifyContent: 'space-between',
        gap: 8,
        paddingHorizontal: 28 
    }
});
