import Colors from "@/src/constants/Colors";
import { StyleSheet, Text, View } from "react-native";

type Variant = "error" | "success";

interface Props {
    text: string | null,
    fontSize: number,
    variant?: Variant,
}

const VARIANT_STYLES: Record<Variant, { bgColor: string, textColor: string }> = {
    error: { bgColor: Colors.error, textColor: "white" },
    success: { bgColor: Colors.success, textColor: "white" },
};

export default function RoundedText({ text, fontSize, variant }: Props) {
    if (!text) {
        return <View></View>;
    }

    const { bgColor, textColor } = variant
        ? VARIANT_STYLES[variant]
        : { bgColor: Colors.primary, textColor: Colors.secondary };

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
        borderRadius: 10,
        fontWeight: 'bold'
    }
});
