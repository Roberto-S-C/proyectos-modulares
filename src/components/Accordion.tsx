import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useCallback, useRef, useState } from "react";
import { Animated, Easing, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Colors from "../constants/Colors";

interface Props {
    title: string,
    content: React.ReactNode,
    initiallyExpanded?: boolean,
    onToggle?: (isExpanded: boolean) => void
}

export default function Accordion({ title, content, initiallyExpanded = true, onToggle }: Props) {
    const [isExpanded, setIsExpanded] = useState<boolean>(initiallyExpanded);
    const rotation = useRef(new Animated.Value(initiallyExpanded ? 1 : 0)).current;

    const toggle = useCallback(() => {
        setIsExpanded(prev => {
            const next = !prev;

            Animated.timing(rotation, {
                toValue: next ? 1 : 0,
                duration: 200,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
            }).start();

            onToggle?.(next);
            return next;
        });
    }, [rotation, onToggle]);

    const caretRotation = rotation.interpolate({
        inputRange: [0, 1],
        outputRange: ["0deg", "180deg"],
    });

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.titleContainer}
                onPress={toggle}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityState={{ expanded: isExpanded }}
                accessibilityLabel={title}
            >
                <Text style={styles.title} numberOfLines={2}>{title}</Text>
                <Animated.View style={{ transform: [{ rotate: caretRotation }] }}>
                    <Ionicons name="caret-down" size={24} color={"black"} />
                </Animated.View>
            </TouchableOpacity>

            {isExpanded &&
                <View style={styles.contentContainer}>
                    {content}
                </View>
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.itemBackgroundColor,
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: 10,
    },
    titleContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 8,
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    title: {
        flex: 1,
        fontSize: 18,
        fontWeight: "bold",
        color: Colors.primary,
    },
    contentContainer: {
        borderTopWidth: 1,
        borderTopColor: Colors.border,
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
});
