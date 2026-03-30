import React, { useState } from "react";
import { View, Text, TextInput, ScrollView, Pressable, TouchableOpacity } from "react-native";
import { Plus, Trash2, ChevronDown, Check } from "lucide-react-native";
import { router } from "expo-router";

// Importações de Estilo e Componentes
import { Colors } from "../../constants/theme";
import { Header } from "../../components/header";
import { GenerateButton } from "../../components/generate_button";
import { dispensaStyles as styles } from "../../styles/dispensa_styles";
import { useDispensa } from "../../hooks/useDispensa";

// Dados Iniciais
const INITIAL_INGREDIENTS = [
    { id: "1", name: "Ovo", qty: "12", unit: "un", selected: true },
    { id: "2", name: "Tomate", qty: "4", unit: "un", selected: true },
    { id: "3", name: "Cebola", qty: "2", unit: "un", selected: false },
    { id: "4", name: "Alface", qty: "1", unit: "un", selected: false },
    { id: "5", name: "Queijo", qty: "1", unit: "un", selected: false },
];

// Tela de Dispensa
export default function DispensaScreen() {
    const [activeInput, setActiveInput] = useState<string | null>(null);
    const [activeListInput, setActiveListInput] = useState<string | null>(null);

    const {
        searchText,
        setSearchText,
        filteredIngredients,
        toggleIngredient,
        removeIngredient,
        selectedCount
    } = useDispensa(INITIAL_INGREDIENTS);

    // Função de navegação para a IA
    const handleGerarReceitas = () => {
        router.push({
            pathname: "/detalhe_receita",
            params: { tipo: 'ia' }
        });
    };

    return (
        <View style={styles.container}>
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
                {/* CARD DE ADIÇÃO */}
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

                {/* SEÇÃO DE INGREDIENTES */}
                <Text style={[styles.sectionLabel]}>
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
                                    keyboardType="numeric"
                                    onFocus={() => setActiveListInput(item.id)}
                                    onBlur={() => setActiveListInput(null)}
                                    style={[
                                        styles.listInputQty,
                                        activeListInput === item.id && styles.inputFocused
                                    ]}
                                />
                                <View style={styles.listPickerUnit}>
                                    <Text style={styles.unitText}>{item.unit}</Text>
                                    <ChevronDown size={14} color={Colors.brown} />
                                </View>
                            </View>
                        </View>

                        {/* BOTÃO DE EXCLUSÃO */}
                        <TouchableOpacity
                            onPress={() => removeIngredient(item.id)}
                            activeOpacity={0.5}
                        >
                            <Trash2 size={18} color={Colors.errorDark} />
                        </TouchableOpacity>
                    </View>
                ))}
            </ScrollView>

            {/* BOTÃO GERAR RECEITAS (Componente Reutilizável) */}
            <GenerateButton
                selectedCount={selectedCount}
                onPress={handleGerarReceitas}
                style={styles.floatingBtn}
            />
        </View>
    );
}