import { router } from "expo-router";
import { Check, ChevronDown, Plus, Trash2 } from "lucide-react-native";
import React, { useState } from "react";
import { ActivityIndicator, Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";

import { GenerateButton } from "../../components/generate_button";
import { Header } from "../../components/header";
import { UNIDADES_ACEITAS } from "../../constants/ingredients";
import { Colors } from "../../constants/theme";
import { useDispensa } from "../../hooks/useDispensa";
import { dispensaStyles as styles } from "../../styles/dispensa_styles";
import { validarQuantidade } from "../../utils/validation";

export default function DispensaScreen() {
    const {
        filteredIngredients,
        searchText,
        setSearchText,
        addIngredient,
        toggleIngredient,
        removeIngredient,
        editIngredient,
        selectedCount,
        isLoading
    } = useDispensa();

    const [nomeNovo, setNomeNovo] = useState("");
    const [qtdNova, setQtdNova] = useState("");
    const [unidadeNova, setUnidadeNova] = useState("un");
    const [showUnitPicker, setShowUnitPicker] = useState(false);
    
    // Estados para Edição In-line
    const [activeInput, setActiveInput] = useState<string | null>(null);
    const [editValue, setEditValue] = useState("");

    const handleAdd = async () => {
        // Validação básica
        if (!nomeNovo.trim()) {
            Alert.alert("Atenção", "Por favor, digite o nome do ingrediente.");
            return;
        }
        if (!qtdNova.trim()) {
            Alert.alert("Atenção", "Por favor, digite a quantidade.");
            return;
        }

        // Valida quantidade
        const validQtd = validarQuantidade(qtdNova);
        if (!validQtd.valido) {
            Alert.alert("Atenção", validQtd.erro || "Quantidade inválida");
            return;
        }

        try {
            await addIngredient(nomeNovo, qtdNova, unidadeNova);
            setNomeNovo("");
            setQtdNova("");
            setUnidadeNova("un");
            setShowUnitPicker(false);
        } catch (e) {
            Alert.alert("Erro", "Falha ao adicionar ingrediente. Tente novamente.");
        }
    };

    const handleGerarReceitas = () => {
        if (selectedCount === 0) {
            Alert.alert("Atenção", "Selecione pelo menos um ingrediente para gerar receitas!");
            return;
        }
        router.push("/selecao_ia");
    };

    // --- FUNÇÕES DE EDIÇÃO IN-LINE ---
    const startEditQty = (id: string, currentQty: string) => {
        setEditValue(currentQty);
        setActiveInput(`${id}-qty`);
    };

    const saveEditQty = (id: string) => {
        if (editValue.trim() === '') {
            setActiveInput(null);
            return;
        }
        
        const validQtd = validarQuantidade(editValue);
        if (!validQtd.valido) {
            Alert.alert("Atenção", validQtd.erro || "Quantidade inválida");
            return;
        }
        
        editIngredient(id, 'quantidade', editValue);
        setActiveInput(null);
    };

    const toggleEditUnit = (id: string) => {
        setActiveInput(activeInput === `${id}-unit` ? null : `${id}-unit`);
    };

    const saveEditUnit = (id: string, unit: string) => {
        editIngredient(id, 'unidade', unit);
        setActiveInput(null);
    };

    return (
        <View style={styles.container}>
            {/* Header conectado à Busca do Contexto Global */}
            <Header 
                title="Sua Dispensa" 
                centerTitle
                searchText={searchText}
                setSearchText={setSearchText}
                searchPlaceholder="Buscar na dispensa..." 
            />

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                
                {/* --- CARD DE ADIÇÃO (MANTIDO INTACTO) --- */}
                <View style={styles.addCard}>
                    <Text style={styles.sectionLabel}>Novo Ingrediente</Text>
                    <TextInput
                        style={[styles.inputBase, styles.inputFull]}
                        placeholder="Ex: Tomate, Arroz, Feijão..."
                        placeholderTextColor={Colors.subtext}
                        value={nomeNovo}
                        onChangeText={setNomeNovo}
                    />
                    <View style={styles.row}>
                        <TextInput
                            style={[styles.inputBase, styles.inputField]}
                            placeholder="Qtd (Ex: 2)"
                            placeholderTextColor={Colors.subtext}
                            keyboardType="numeric"
                            value={qtdNova}
                            onChangeText={setQtdNova}
                        />
                        <TouchableOpacity style={styles.pickerMock} onPress={() => setShowUnitPicker(!showUnitPicker)} activeOpacity={0.8}>
                            <Text style={styles.pickerText}>{unidadeNova}</Text>
                            <ChevronDown size={18} color={Colors.subtext} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.btnAdd} onPress={handleAdd} activeOpacity={0.8}>
                            <Plus size={20} color={Colors.light} />
                        </TouchableOpacity>
                    </View>

                    {showUnitPicker && (
                        <View style={styles.unitPickerDropdown}>
                            {UNIDADES_ACEITAS.map(u => (
                                <TouchableOpacity
                                    key={u}
                                    style={[styles.unitBadge, unidadeNova === u && styles.unitBadgeActive]}
                                    onPress={() => { setUnidadeNova(u); setShowUnitPicker(false); }}
                                >
                                    <Text style={[styles.unitBadgeText, unidadeNova === u && styles.unitBadgeTextActive]}>{u}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                </View>

                {/* --- LISTA DA DISPENSA (AGORA MAPEA FILTERED_INGREDIENTS) --- */}
                {isLoading ? (
                    <ActivityIndicator size="large" color={Colors.secondary} style={{ marginTop: 20 }} />
                ) : filteredIngredients.length === 0 ? (
                    <Text style={styles.emptyText}>
                        {searchText ? "Nenhum ingrediente encontrado com essa busca." : "Sua dispensa está vazia."}
                    </Text>
                ) : (
                    filteredIngredients.map((item) => (
                        <View key={item.id} style={{ marginBottom: 8 }}>
                            <View style={[styles.ingredientItem, !item.selected && { opacity: 0.6 }]}>
                                
                                <TouchableOpacity onPress={() => toggleIngredient(item.id)} style={[styles.checkbox, item.selected && styles.checkboxActive]} activeOpacity={0.8}>
                                    {item.selected && <Check size={14} color={Colors.light} strokeWidth={3} />}
                                </TouchableOpacity>

                                <View style={styles.ingredientInfo}>
                                    <Text style={styles.ingredientName}>{item.name}</Text>

                                    <View style={styles.controlsRow}>
                                        
                                        {/* IN-LINE EDIT: Quantidade */}
                                        {activeInput === `${item.id}-qty` ? (
                                            <TextInput
                                                style={styles.inlineInput}
                                                value={editValue}
                                                onChangeText={setEditValue}
                                                keyboardType="numeric"
                                                autoFocus
                                                onBlur={() => saveEditQty(item.id)}
                                                onSubmitEditing={() => saveEditQty(item.id)}
                                            />
                                        ) : (
                                            <TouchableOpacity style={styles.listInputQtyWrap} onPress={() => startEditQty(item.id, item.qty)}>
                                                <Text style={styles.listInputQtyText}>{item.qty}</Text>
                                            </TouchableOpacity>
                                        )}

                                        {/* IN-LINE EDIT: Unidade */}
                                        <TouchableOpacity style={styles.listPickerUnit} onPress={() => toggleEditUnit(item.id)}>
                                            <Text style={styles.unitText}>{item.unit}</Text>
                                            <ChevronDown size={12} color={Colors.subtext} />
                                        </TouchableOpacity>

                                    </View>
                                </View>

                                <TouchableOpacity onPress={() => removeIngredient(item.id)} style={styles.deleteButton}>
                                    <Trash2 size={20} color={'#E53E3E'} />
                                </TouchableOpacity>
                            </View>

                            {/* PAINEL FLUTUANTE DE UNIDADES IN-LINE (Aparece se ativo) */}
                            {activeInput === `${item.id}-unit` && (
                                <View style={styles.inlineUnitPanel}>
                                    {UNIDADES_ACEITAS.map(u => (
                                        <TouchableOpacity 
                                            key={u} 
                                            style={[styles.inlineUnitChip, item.unit === u && styles.inlineUnitChipActive]} 
                                            onPress={() => saveEditUnit(item.id, u)}
                                        >
                                            <Text style={[styles.inlineUnitText, item.unit === u && styles.inlineUnitTextActive]}>{u}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )}
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