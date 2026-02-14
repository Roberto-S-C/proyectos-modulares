import { StyleSheet, Text } from "react-native";
import Colors from "../constants/Colors";

interface Props {
    text: string;
}

export default function Paragraph({ text }: Props) {
    return <Text style={styles.paragraph}>{text}</Text>
}

const styles = StyleSheet.create({
    paragraph: {
        textAlign: 'justify',
        fontSize: 16,
        lineHeight: 24,
        color: Colors.textPrimary
    }
});