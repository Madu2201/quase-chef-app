import React, { useState } from "react";
import { View, Text, TextInput, ScrollView, Pressable, TouchableOpacity } from "react-native";
import { Plus, Trash2, ChevronDown, Check, Sparkles } from "lucide-react-native";

// Importações do Projeto
import { Colors } from "../../constants/theme";
import { Header } from "../../components/header";
import { dispensaStyles as styles } from "../../styles/dispensa_styles";
import { useDispensa } from "../../hooks/useDispensa";

const INITIAL_INGREDIENTS = [
    { id: "1", name: "Ovo", qty: "12", unit: "un", selected: true },
    { id: "2", name: "Tomate", qty: "4", unit: "un", selected: true },
    { id: "3", name: "Cebola", qty: "2", unit: "un", selected: false },
];

export default function DispensaScreen() {
    const [activeInput, setActiveInput] = useState<string | null>(null);

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
            {/* Header Slim Fixo */}
            <Header
                title="Minha Dispensa"
                centerTitle={true}
                searchText={searchText}
                setSearchText={setSearchText}
                searchPlaceholder="Buscar na sua dispensa..."
            />

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* CARD DE ADIÇÃO: Agora rola com a página */}
                <View style={styles.addCard}>
                    <Text style={styles.sectionLabel}>Novo Ingrediente</Text>

                    <TextInput
                        placeholder="Ex: Arroz, Feijão..."
                        onFocus={() => setActiveInput('nome')}
                        onBlur={() => setActiveInput(null)}
                        style={[
                            styles.inputBase,
                            styles.inputFull,
                            activeInput === 'nome' && styles.inputFocused
                        ]}
                        placeholderTextColor={Colors.subtext}
                    />

                    <View style={styles.row}>
                        <View style={styles.inputField}>
                            <TextInput
                                placeholder="Qtd"
                                keyboardType="numeric"
                                onFocus={() => setActiveInput('qtd')}
                                onBlur={() => setActiveInput(null)}
                                style={[
                                    styles.inputBase,
                                    activeInput === 'qtd' && styles.inputFocused
                                ]}
                                placeholderTextColor={Colors.subtext}
                            />
                        </View>

                        <TouchableOpacity style={styles.pickerMock} activeOpacity={0.8}>
                            <Text style={styles.pickerText}>un</Text>
                            <ChevronDown size={16} color={Colors.dark} />
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.btnAdd} activeOpacity={0.7}>
                            <Plus size={22} color={Colors.light} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Listagem de ingredientes */}
                <Text style={[styles.sectionLabel, { marginBottom: 16, marginTop: 8 }]}>
                    Ingredientes na dispensa
                </Text>

                {filteredIngredients.map((item) => (
                    <View key={item.id} style={styles.ingredientItem}>
                        <Pressable
                            onPress={() => toggleIngredient(item.id)}
                            style={[styles.checkbox, item.selected && styles.checkboxActive]}
                        >
                            {item.selected && <Check size={14} color={Colors.light} strokeWidth={4} />}
                        </Pressable>

                        <View style={styles.ingredientInfo}>
                            <Text style={styles.ingredientName}>{item.name}</Text>
                            <View style={styles.controlsRow}>
                                <TextInput
                                    defaultValue={item.qty}
                                    style={styles.listInputQty}
                                    keyboardType="numeric"
                                />
                                <View style={styles.listPickerUnit}>
                                    <Text style={styles.unitText}>{item.unit}</Text>
                                    <ChevronDown size={14} color={Colors.dark} />
                                </View>
                            </View>
                        </View>

                        <TouchableOpacity onPress={() => removeIngredient(item.id)}>
                            <Trash2 size={20} color={Colors.subtext} opacity={0.5} />
                        </TouchableOpacity>
                    </View>
                ))}
            </ScrollView>

            {/* Botão Flutuante */}
            {selectedCount > 0 && (
                <TouchableOpacity style={styles.floatingBtn} activeOpacity={0.9}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
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