import Colors from "@/src/constants/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import { FlatList, Modal, Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export type SelectOption<T extends string> = { label: string, value: T };

interface OptionListProps<T extends string> {
    options: SelectOption<T>[],
    selectedValue: T,
    onSelect: (value: T) => void,
}

/** The option rows, with a checkmark on the selected one. Shared by SelectField's sheet and PickerModal. */
export function SelectOptionList<T extends string>({ options, selectedValue, onSelect }: OptionListProps<T>) {
    return (
        <FlatList
            data={options}
            keyExtractor={option => option.value === '' ? '__empty__' : option.value}
            renderItem={({ item }) => {
                const isSelected = item.value === selectedValue;
                return (
                    <Pressable
                        style={({ pressed }) => [styles.option, pressed && styles.optionPressed]}
                        onPress={() => onSelect(item.value)}
                    >
                        <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>{item.label}</Text>
                        {isSelected && <Ionicons name="checkmark" size={24} color={Colors.primary} />}
                    </Pressable>
                );
            }}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
    );
}

interface Props<T extends string> {
    value: T,
    options: SelectOption<T>[],
    onChange: (value: T) => void,
    // Shown while no option is chosen (value '', the filters' "any")
    placeholder?: string,
    // Sheet title, defaults to the placeholder
    title?: string,
    disabled?: boolean,
    // The field box, so each screen keeps its own width
    style?: StyleProp<ViewStyle>,
}

/**
 * A field that opens a bottom sheet with the options. Used instead of @react-native-picker/picker,
 * which is a dropdown on Android but an inline wheel on iOS that the app's layouts clip.
 */
export default function SelectField<T extends string>({
    value,
    options,
    onChange,
    placeholder = "Seleccionar",
    title,
    disabled = false,
    style
}: Props<T>) {
    const [isOpen, setIsOpen] = useState(false);
    const insets = useSafeAreaInsets();

    const selected = options.find(option => option.value === value);
    const showPlaceholder = !selected || value === '';

    const onSelect = (newValue: T) => {
        setIsOpen(false);
        if (newValue !== value) onChange(newValue);
    };

    return (
        <>
            <Pressable
                style={[styles.field, disabled && styles.fieldDisabled, style]}
                onPress={() => setIsOpen(true)}
                disabled={disabled}
            >
                <Text style={[styles.fieldText, showPlaceholder && styles.placeholderText]} numberOfLines={1}>
                    {showPlaceholder ? placeholder : selected.label}
                </Text>
                <Ionicons name="chevron-down" size={20} color={Colors.textSecondary} />
            </Pressable>

            <Modal
                animationType="slide"
                transparent={true}
                visible={isOpen}
                onRequestClose={() => setIsOpen(false)}
                statusBarTranslucent={true}
                navigationBarTranslucent={true}
            >
                <View style={styles.root}>
                    <Pressable style={styles.backdrop} onPress={() => setIsOpen(false)} />

                    <View style={[styles.sheet, { paddingBottom: insets.bottom + 16 }]}>
                        <View style={styles.header}>
                            <Text style={styles.title}>{title ?? placeholder}</Text>
                            <Pressable onPress={() => setIsOpen(false)} style={styles.closeButton}>
                                <Ionicons name="close" size={28} color={Colors.textSecondary} />
                            </Pressable>
                        </View>

                        <SelectOptionList options={options} selectedValue={value} onSelect={onSelect} />
                    </View>
                </View>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    field: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 8,
        minHeight: 48,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: 10,
        backgroundColor: Colors.itemBackgroundColor,
    },
    fieldDisabled: {
        opacity: 0.5,
    },
    fieldText: {
        flexShrink: 1,
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.primary,
    },
    placeholderText: {
        color: Colors.textSecondary,
    },
    root: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    sheet: {
        maxHeight: '60%',
        gap: 12,
        paddingTop: 16,
        paddingHorizontal: 16,
        backgroundColor: Colors.itemBackgroundColor,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.primary,
    },
    closeButton: {
        position: 'absolute',
        right: 0,
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 14,
        paddingHorizontal: 8,
    },
    optionPressed: {
        backgroundColor: Colors.selectedItemBackgroundColor,
    },
    optionText: {
        fontSize: 18,
        color: Colors.textPrimary,
    },
    optionTextSelected: {
        fontWeight: 'bold',
        color: Colors.primary,
    },
    separator: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: Colors.border,
    },
});
