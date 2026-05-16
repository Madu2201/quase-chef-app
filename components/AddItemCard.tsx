import { Check, ChevronDown, HelpCircle, Plus } from "lucide-react-native";
import React, { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

// Meus imports
import { UNIDADES_ACEITAS } from "../constants/ingredients";
import { Colors } from "../constants/theme";

// Tipagem das Props do Componente
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
    useAddPanelStyle?: boolean; // Nova prop para usar estilo do addPanel
    metaValue?: string;
    onMetaChange?: (text: string) => void;
    onMetaFocus?: () => void;
    onMetaBlur?: () => void;
    qtyLabel?: string;
    metaLabel?: string;
    onMetaHelp?: () => void;
}

// Componente Principal
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
    useAddPanelStyle = false,
    metaValue,
    onMetaChange,
    onMetaFocus,
    onMetaBlur,
    qtyLabel = "QUANTIDADE",
    metaLabel = "META IDEAL",
    onMetaHelp,
}: AddItemCardProps) {
    const [isButtonPressed, setIsButtonPressed] = useState(false);

    // Se o estilo do addPanel está disponível, usa; senão usa o padrão
    const hasAddPanelStyles = useAddPanelStyle && styles.addPanel;

    if (hasAddPanelStyles) {
        return (
            <View style={styles.addPanel}>
                {/* Título da Seção */}
                <Text style={styles.addPanelTitle}>{label}</Text>

                {/* Primeira linha: Nome do Item + Seletor de Unidade */}
                <View style={styles.addPanelRow}>
                    <TextInput
                        style={[styles.addPanelNameInput, styles.fontSystem]}
                        placeholder={placeholder}
                        placeholderTextColor={Colors.subtext}
                        value={nameValue}
                        onChangeText={onNameChange}
                        onFocus={onNameFocus}
                        onBlur={onNameBlur}
                    />
                    <TouchableOpacity
                        style={styles.addPanelUnitButton}
                        onPress={onToggleUnitPicker}
                    >
                        <Text style={styles.addPanelUnitText}>{unitValue}</Text>
                        <ChevronDown size={16} color={Colors.subtext} />
                    </TouchableOpacity>
                </View>

                {/* Dropdown de Unidades */}
                {showUnitPicker && (
                    <View style={styles.unitPickerContainer}>
                        {UNIDADES_ACEITAS.map((u) => (
                            <TouchableOpacity
                                key={u}
                                onPress={() => {
                                    onUnitChange(u);
                                    onToggleUnitPicker();
                                }}
                                style={[
                                    styles.unitChip,
                                    unitValue === u && styles.unitChipActive,
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.unitChipText,
                                        unitValue === u && styles.unitChipTextActive,
                                    ]}
                                >
                                    {u}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}

                {/* Linha final: Campo de Quantidade + Campo Meta (se aplicável) + Botão de Adição */}
                <View style={styles.addPanelFieldsRow}>
                    <View style={styles.addPanelField}>
                        <Text style={styles.addPanelFieldLabel}>{qtyLabel}</Text>
                        <TextInput
                            style={[styles.addPanelFieldInput, styles.fontSystem]}
                            placeholder="0"
                            keyboardType="numeric"
                            value={qtyValue}
                            onChangeText={onQtyChange}
                            onFocus={onQtyFocus}
                            onBlur={onQtyBlur}
                        />
                    </View>
                    {metaValue !== undefined && (
                        <View style={styles.addPanelField}>
                            <View style={styles.addPanelFieldHeader}>
                                <Text style={styles.addPanelFieldLabel}>{metaLabel}</Text>
                                {onMetaHelp && (
                                    <TouchableOpacity onPress={onMetaHelp}>
                                        <HelpCircle size={14} color={Colors.secondary} />
                                    </TouchableOpacity>
                                )}
                            </View>
                            <TextInput
                                style={[styles.addPanelFieldInput, styles.fontSystem]}
                                placeholder="0"
                                keyboardType="numeric"
                                value={metaValue}
                                onChangeText={onMetaChange}
                                onFocus={onMetaFocus}
                                onBlur={onMetaBlur}
                            />
                        </View>
                    )}
                    <TouchableOpacity
                        onPress={onAddPress}
                        onPressIn={() => setIsButtonPressed(true)}
                        onPressOut={() => setIsButtonPressed(false)}
                        style={[
                            styles.addPanelButton,
                            isButtonPressed && styles.btnAddPressed,
                        ]}
                    >
                        <Check size={20} color={Colors.light} />
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    // Estilo padrão (compatível com lista)
    return (
        <View style={styles.addCard}>
            {/* Título da Seção */}
            <Text style={styles.sectionLabel}>{label}</Text>

            {/* Input Principal: Nome do Item */}
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
                {/* Input Secundário: Quantidade */}
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

                {/* Seletor de Unidade (Mock/Botão) */}
                <TouchableOpacity
                    style={styles.pickerMock}
                    activeOpacity={0.8}
                    onPress={onToggleUnitPicker}
                >
                    <Text style={styles.pickerText}>{unitValue}</Text>
                    <ChevronDown size={iconSize - 2} color={Colors.dark} />
                </TouchableOpacity>

                {/* Botão de Adição Final */}
                <TouchableOpacity
                    style={[
                        styles.btnAdd,
                        isButtonPressed && styles.btnAddPressed,
                    ]}
                    activeOpacity={0.7}
                    onPressIn={() => setIsButtonPressed(true)}
                    onPressOut={() => setIsButtonPressed(false)}
                    onPress={onAddPress}
                >
                    <Plus size={iconSize + 4} color={Colors.light} />
                </TouchableOpacity>
            </View>

            {/* Dropdown de Unidades (Condicional) */}
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