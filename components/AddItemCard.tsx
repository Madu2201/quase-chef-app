import { ChevronDown, Plus } from "lucide-react-native";
import React from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

import { UNIDADES_ACEITAS } from "../constants/ingredients";
import { Colors } from "../constants/theme";

interface AddItemCardProps {
    label: string;
    placeholder: string;
    nameValue: string;
    onNameChange: (text: string) => void;
    qtyValue: string;
    onQtyChange: (text: string) => void;
    unitValue: string;
    onUnitChange: (unit: string) => void;
    onAddPress: () => void;
    showUnitPicker: boolean;
    onToggleUnitPicker: () => void;
    activeInput: string | null;
    onNameFocus: () => void;
    onNameBlur: () => void;
    onQtyFocus: () => void;
    onQtyBlur: () => void;
    styles: any;
    iconSize?: number;
}

export function AddItemCard({
    label,
    placeholder,
    nameValue,
    onNameChange,
    qtyValue,
    onQtyChange,
    unitValue,
    onUnitChange,
    onAddPress,
    showUnitPicker,
    onToggleUnitPicker,
    activeInput,
    onNameFocus,
    onNameBlur,
    onQtyFocus,
    onQtyBlur,
    styles,
    iconSize = 18,
}: AddItemCardProps) {
    return (
        <View style={styles.addCard}>
            <Text style={styles.sectionLabel}>{label}</Text>

            <TextInput
                placeholder={placeholder}
                placeholderTextColor={Colors.subtext + "80"}
                value={nameValue}
                onChangeText={onNameChange}
                onFocus={onNameFocus}
                onBlur={onNameBlur}
                style={[
                    styles.inputBase,
                    styles.inputFull,
                    activeInput === "nome" && styles.inputFocused,
                ]}
            />

            <View style={styles.row}>
                <View style={styles.inputField}>
                    <TextInput
                        placeholder="Qtd"
                        placeholderTextColor={Colors.subtext + "80"}
                        value={qtyValue}
                        onChangeText={onQtyChange}
                        keyboardType="numeric"
                        onFocus={onQtyFocus}
                        onBlur={onQtyBlur}
                        style={[
                            styles.inputBase,
                            activeInput === "qtd" && styles.inputFocused,
                        ]}
                    />
                </View>

                <TouchableOpacity
                    style={styles.pickerMock}
                    activeOpacity={0.8}
                    onPress={onToggleUnitPicker}
                >
                    <Text style={styles.pickerText}>{unitValue}</Text>
                    <ChevronDown size={iconSize - 2} color={Colors.dark} />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.btnAdd}
                    activeOpacity={0.7}
                    onPress={onAddPress}
                >
                    <Plus size={iconSize + 4} color={Colors.light} />
                </TouchableOpacity>
            </View>

            {showUnitPicker && (
                <View style={styles.unitPickerDropdown}>
                    {UNIDADES_ACEITAS.map((u) => (
                        <TouchableOpacity
                            key={u}
                            style={[
                                styles.unitBadge,
                                unitValue === u && styles.unitBadgeActive,
                            ]}
                            onPress={() => {
                                onUnitChange(u);
                                onToggleUnitPicker();
                            }}
                        >
                            <Text
                                style={[
                                    styles.unitBadgeText,
                                    unitValue === u && styles.unitBadgeTextActive,
                                ]}
                            >
                                {u}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}
        </View>
    );
}
