import { StyleSheet, Text, View } from "react-native";

interface Props {
    text: string | null,
    fontSize: number,
    textColor: string,
    bgColor: string,
}

export default function RoundedText({ text, fontSize, textColor, bgColor }: Props) {
    if (!text) {
        return <View></View>;
    }

    return (
        <View style={styles.roundedTextContainer}>
            <Text
                style={[styles.text, { fontSize, color: textColor, backgroundColor: bgColor }]}>
                {text}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    roundedTextContainer: {
    },
    text: {
        padding: 12,
        borderRadius: 20,
        fontWeight: 'bold'
    }
});