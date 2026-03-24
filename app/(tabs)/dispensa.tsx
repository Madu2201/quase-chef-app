import React, { useState } from "react";
import { View, Text, TextInput, ScrollView, Pressable, TouchableOpacity } from "react-native";
import { Search, Plus, Trash2, ChevronDown, Check, Sparkles } from "lucide-react-native";

// Importações do Projeto
import { Colors } from "../../constants/theme";
import { dispensaStyles as styles } from "../../styles/dispensa_styles";
import { useDispensa } from "../../hooks/useDispensa";

const INITIAL_INGREDIENTS = [
    { id: "1", name: "Ovo", qty: "12", unit: "un", selected: true },
    { id: "2", name: "Tomate", qty: "4", unit: "un", selected: true },
    { id: "3", name: "Cebola", qty: "2", unit: "un", selected: false },
    { id: "4", name: "Alface", qty: "1", unit: "un", selected: false },
    { id: "5", name: "Frango", qty: "500", unit: "g", selected: true },
];

export default function DispensaScreen() {
    const [isFocused, setIsFocused] = useState(false);

    // Hook de Lógica
    const {
        searchText,
        setSearchText,
        filteredIngredients,
        toggleIngredient,
        removeIngredient,
        selectedCount
    } = useDispensa(INITIAL_INGREDIENTS);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>O que você tem em casa?</Text>
                </View>

                <View style={styles.headerContent}>
                    <View style={[styles.searchContainer, isFocused && styles.searchContainerFocused]}>
                        <Search size={20} color={Colors.primary} />
                        <TextInput
                            placeholder="Buscar na sua dispensa..."
                            style={styles.searchInput}
                            placeholderTextColor={Colors.primary + "80"}
                            value={searchText}
                            onChangeText={setSearchText}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            selectionColor={Colors.primary}
                        />
                    </View>

                    <View style={styles.addSection}>
                        <Text style={styles.sectionLabel}>Adicionar Ingrediente</Text>
                        <TextInput
                            placeholder="Ex: Arroz, Leite..."
                            style={styles.inputFull}
                            placeholderTextColor={Colors.subtext}
                            selectionColor={Colors.primary}
                        />
                        <View style={styles.row}>
                            <TextInput
                                placeholder="Qtd"
                                style={styles.inputSmall}
                                keyboardType="numeric"
                                selectionColor={Colors.primary}
                            />
                            <View style={styles.pickerContainer}>
                                <Text style={styles.unitText}>un</Text>
                                <ChevronDown size={16} color={Colors.dark} />
                            </View>
                            <TouchableOpacity style={styles.btnAdd} activeOpacity={0.8}>
                                <Plus size={24} color={Colors.light} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <Text style={styles.sectionLabel}>Ingredientes Na Dispensa</Text>

                {filteredIngredients.map((item) => (
                    <View key={item.id} style={styles.ingredientItem}>
                        <Pressable
                            onPress={() => toggleIngredient(item.id)}
                            style={[styles.checkbox, item.selected && styles.checkboxActive]}
                        >
                            {item.selected && <Check size={16} color={Colors.light} strokeWidth={4} />}
                        </Pressable>

                        <View style={styles.ingredientInfo}>
                            <Text style={styles.ingredientName}>{item.name}</Text>
                            <View style={styles.controlsRow}>
                                <TextInput
                                    value={item.qty}
                                    style={styles.listInputQty}
                                    keyboardType="numeric"
                                    selectionColor={Colors.primary}
                                />
                                <View style={styles.listPickerUnit}>
                                    <Text style={styles.unitText}>{item.unit}</Text>
                                    <ChevronDown size={14} color={Colors.dark} />
                                </View>
                            </View>
                        </View>

                        <View style={styles.rightIcons}>
                            <TouchableOpacity
                                onPress={() => removeIngredient(item.id)}
                                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                            >
                                <Trash2 size={20} color={Colors.subtext} />
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}
            </ScrollView>

            {selectedCount > 0 && (
                <TouchableOpacity style={styles.floatingBtn} activeOpacity={0.9}>
                    <View style={styles.floatingBtnLeft}>
                        <Sparkles size={22} color={Colors.light} fill={Colors.light} />
                        <Text style={styles.floatingBtnText}>Gerar receitas</Text>
                    </View>
                    <View style={styles.badgeContainer}>
                        <Text style={styles.badgeText}>{selectedCount} selecionados</Text>
                    </View>
                </TouchableOpacity>
            )}
        </View>
    );
}