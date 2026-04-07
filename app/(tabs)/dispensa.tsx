import { router } from "expo-router";
import { Check, ChevronDown, Plus, Trash2 } from "lucide-react-native";
import React, { useState } from "react";
import { ActivityIndicator, Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";

// Meus imports
import { GenerateButton } from "../../components/generate_button";
import { Header } from "../../components/header";
import { Colors } from "../../constants/theme";
import { useDispensa } from "../../hooks/useDispensa";
import { dispensaStyles as styles } from "../../styles/dispensa_styles";

const UNIDADES_ACEITAS = ['un', 'kg', 'g', 'L', 'ml', 'xícara', 'colher'];

export default function DispensaScreen() {
    const {
        ingredients,
        filteredIngredients,
        addIngredient,
        toggleIngredient,
        removeIngredient,
        selectedCount,
        isLoading
    } = useDispensa();

    const [nomeNovo, setNomeNovo] = useState("");
    const [qtdNova, setQtdNova] = useState("");
    const [unidadeNova, setUnidadeNova] = useState("un");
    const [showUnitPicker, setShowUnitPicker] = useState(false);
    const [activeInput, setActiveInput] = useState<string | null>(null);

    const handleAdd = async () => {
        if (!nomeNovo.trim() || !qtdNova.trim()) {
            Alert.alert("Atenção", "Preencha o nome e a quantidade."); return;
        }

        const qtdNum = parseFloat(qtdNova.replace(',', '.'));
        if (isNaN(qtdNum)) {
            Alert.alert("Atenção", "A quantidade precisa ser um número."); return;
        }

        try {
            await addIngredient(nomeNovo.trim(), String(qtdNum), unidadeNova);
            setNomeNovo("");
            setQtdNova("");
            setUnidadeNova("un");
            setShowUnitPicker(false);
        } catch (error: any) {
            Alert.alert("Erro", "Falha ao adicionar ingrediente.");
        }
    };

    const handleGerarReceitas = () => {
        const selecionados = ingredients
            .filter(item => item.selected)
            .map(item => item.name);

        if (selecionados.length === 0) {
            Alert.alert("Atenção", "Selecione pelo menos um ingrediente da sua dispensa!");
            return;
        }

        router.push({
            pathname: "/selecao_ia",
            params: {
                ingredientes_ia: selecionados.join(','),
                gerar_ia: "true"
            }
        });
    };

    return (
        <View style={styles.container}>
            <Header title="Minha Dispensa" centerTitle />

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* Card de Adição */}
                <View style={styles.addCard}>
                    <Text style={styles.sectionLabel}>Adicionar Ingrediente</Text>

                    <TextInput
                        placeholder="Ex: Tomate, Cebola, Alface..."
                        placeholderTextColor={Colors.subtext + '80'}
                        value={nomeNovo}
                        onChangeText={setNomeNovo}
                        onFocus={() => setActiveInput('nome')}
                        onBlur={() => setActiveInput(null)}
                        style={[styles.inputBase, styles.inputFull, activeInput === 'nome' && styles.inputFocused]}
                    />

                    <View style={styles.row}>
                        <View style={styles.inputField}>
                            <TextInput
                                placeholder="Qtd"
                                placeholderTextColor={Colors.subtext + '80'}
                                value={qtdNova}
                                onChangeText={setQtdNova}
                                keyboardType="numeric"
                                onFocus={() => setActiveInput('qtd')}
                                onBlur={() => setActiveInput(null)}
                                style={[styles.inputBase, activeInput === 'qtd' && styles.inputFocused]}
                            />
                        </View>

                        <TouchableOpacity
                            style={styles.pickerMock}
                            onPress={() => setShowUnitPicker(!showUnitPicker)}
                        >
                            <Text style={styles.pickerText}>{unidadeNova}</Text>
                            <ChevronDown size={16} color={Colors.subtext} />
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.btnAdd} onPress={handleAdd}>
                            <Plus size={22} color={Colors.light} />
                        </TouchableOpacity>
                    </View>

                    {showUnitPicker && (
                        <View style={styles.unitPickerDropdown}>
                            {UNIDADES_ACEITAS.map((unidade) => (
                                <TouchableOpacity
                                    key={unidade}
                                    onPress={() => { setUnidadeNova(unidade); setShowUnitPicker(false); }}
                                    style={[styles.unitBadge, unidadeNova === unidade && styles.unitBadgeActive]}
                                >
                                    <Text style={[styles.unitBadgeText, unidadeNova === unidade && styles.unitBadgeTextActive]}>{unidade}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                </View>

                <Text style={styles.sectionTitle}>Meus Ingredientes</Text>

                {isLoading ? (
                    <ActivityIndicator size="large" color={Colors.secondary} style={{ marginTop: 30 }} />
                ) : filteredIngredients.length === 0 ? (
                    <Text style={styles.emptyText}>Sua dispensa está vazia.</Text>
                ) : (
                    filteredIngredients.map((item) => (
                        <View key={item.id} style={styles.ingredientItem}>

                            {/* Checkbox Circular */}
                            <TouchableOpacity
                                onPress={() => toggleIngredient(item.id)}
                                style={[styles.checkbox, item.selected && styles.checkboxActive]}
                            >
                                {item.selected && <Check size={14} color={Colors.light} strokeWidth={3} />}
                            </TouchableOpacity>

                            {/* Nome e Seletores abaixo */}
                            <View style={styles.ingredientInfo}>
                                <Text style={styles.ingredientName}>{item.name}</Text>

                                <View style={styles.controlsRow}>
                                    <View style={styles.listInputQtyWrap}>
                                        <Text style={styles.listInputQtyText}>{item.qty}</Text>
                                    </View>

                                    <TouchableOpacity style={styles.listPickerUnit}>
                                        <Text style={styles.unitText}>{item.unit}</Text>
                                        <ChevronDown size={12} color={Colors.subtext} />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* Lixeira Vermelha */}
                            <TouchableOpacity onPress={() => removeIngredient(item.id)} style={styles.deleteButton}>
                                <Trash2 size={20} color={'#E53E3E'} />
                            </TouchableOpacity>
                        </View>
                    ))
                )}
            </ScrollView>

            <GenerateButton
                selectedCount={selectedCount}
                onPress={handleGerarReceitas}
                style={styles.floatingBtn}
                badgeContainerStyle={styles.badgeContainer}
            />
        </View>
    );
}