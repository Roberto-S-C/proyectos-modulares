import { StyleSheet, Text } from "react-native";
import Colors from "../constants/Colors";

interface Props {
    text: string;
}

export default function Title({ text }: Props) {
    return <Text style={styles.title}>{text}</Text>
}

const styles = StyleSheet.create({
    title: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 28, 
        color: Colors.primary
    }
});