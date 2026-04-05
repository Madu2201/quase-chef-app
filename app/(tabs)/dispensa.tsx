import { router } from "expo-router";
import { Check, ChevronDown, Trash2 } from "lucide-react-native";
import React, { useState } from "react";
import { ActivityIndicator, Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";

// Meus imports
import { GenerateButton } from "../../components/generate_button";
import { Header } from "../../components/header";
import { Colors, Radius } from "../../constants/theme";
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

    const handleAdd = async () => {
        if (!nomeNovo.trim()) {
            Alert.alert("Atenção", "Por favor, digite o nome do ingrediente."); return;
        }
        if (!qtdNova.trim()) {
            Alert.alert("Atenção", "Por favor, digite a quantidade."); return;
        }

        const qtdNum = parseFloat(qtdNova.replace(',', '.'));
        if (isNaN(qtdNum)) {
            Alert.alert("Atenção", "A quantidade precisa ser um número (Ex: 1.5, 2, 500)."); return;
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

    // 🔥 PREPARANDO O TERRENO PARA A IA DO SEU AMIGO
    const handleGerarReceitas = () => {
        const selecionados = ingredients
            .filter(item => item.selected)
            .map(item => item.name);

        if (selecionados.length === 0) {
            Alert.alert("Atenção", "Selecione pelo menos um ingrediente da sua dispensa!");
            return;
        }

        // Manda os dados mastigados para a tela de Seleção da IA
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
            <Header title="Sua Dispensa" />

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                
                <View style={styles.addCard}>
                    <Text style={styles.sectionLabel}>Adicionar Novo Ingrediente</Text>
                    
                    <View style={styles.row}>
                        <TextInput
                            style={[styles.inputBase, { flex: 2 }]}
                            placeholder="Ex: Tomate"
                            value={nomeNovo}
                            onChangeText={setNomeNovo}
                            placeholderTextColor={Colors.subtext}
                        />
                        <TextInput
                            style={[styles.inputBase, { flex: 1 }]}
                            placeholder="Qtd"
                            value={qtdNova}
                            onChangeText={setQtdNova}
                            keyboardType="numeric"
                            placeholderTextColor={Colors.subtext}
                        />
                        
                        <TouchableOpacity 
                            style={[styles.inputBase as any, { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 10 }]}
                            onPress={() => setShowUnitPicker(!showUnitPicker)}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.pickerText}>{unidadeNova}</Text>
                            <ChevronDown size={16} color={Colors.subtext} />
                        </TouchableOpacity>
                    </View>

                    {showUnitPicker && (
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 15, padding: 10, backgroundColor: Colors.background, borderRadius: Radius.md, borderWidth: 1, borderColor: Colors.subtext + '20' }}>
                            <Text style={{ width: '100%', fontSize: 12, color: Colors.subtext, marginBottom: 4 }}>Escolha a unidade:</Text>
                            {UNIDADES_ACEITAS.map((unidade) => (
                                <TouchableOpacity
                                    key={unidade}
                                    onPress={() => { setUnidadeNova(unidade); setShowUnitPicker(false); }}
                                    style={{
                                        paddingHorizontal: 12, paddingVertical: 6, borderRadius: Radius.sm,
                                        backgroundColor: unidadeNova === unidade ? Colors.secondary : Colors.light,
                                        borderWidth: 1, borderColor: unidadeNova === unidade ? Colors.secondary : Colors.subtext + '30',
                                    }}
                                >
                                    <Text style={{ color: unidadeNova === unidade ? Colors.light : Colors.dark, fontWeight: '500' }}>{unidade}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                    
                    <TouchableOpacity 
                        style={{ backgroundColor: Colors.secondary, padding: 12, borderRadius: 8, marginTop: 15, alignItems: 'center' }}
                        onPress={handleAdd}
                        activeOpacity={0.8}
                    >
                        <Text style={{ color: Colors.light, fontWeight: 'bold', fontSize: 15 }}>+ Adicionar à Dispensa</Text>
                    </TouchableOpacity>
                </View>

                <Text style={[styles.sectionLabel, { marginTop: 10, marginBottom: 10 }]}>Meus Ingredientes</Text>

                {isLoading ? (
                    <ActivityIndicator size="large" color={Colors.secondary} style={{ marginTop: 30 }} />
                ) : filteredIngredients.length === 0 ? (
                    <Text style={{ textAlign: 'center', color: Colors.subtext, marginTop: 30 }}>
                        Sua dispensa está vazia ou nenhum item foi encontrado.
                    </Text>
                ) : (
                    filteredIngredients.map((item) => (
                        <View key={item.id} style={styles.ingredientItem}>
                            
                            <TouchableOpacity
                                onPress={() => toggleIngredient(item.id)}
                                style={[
                                    styles.checkbox,
                                    item.selected && styles.checkboxActive
                                ]}
                                activeOpacity={0.7}
                            >
                                {item.selected && <Check size={14} color={Colors.light} strokeWidth={3} />}
                            </TouchableOpacity>

                            <View style={styles.ingredientInfo}>
                                <Text style={styles.ingredientName} numberOfLines={1}>{item.name}</Text>
                            </View>

                            <View style={styles.row}>
                                <Text style={{ fontSize: 15, color: Colors.dark, fontWeight: '600' }}>{item.qty}</Text>
                                <View style={styles.listPickerUnit}>
                                    <Text style={styles.unitText}>{item.unit}</Text>
                                </View>
                                
                                <TouchableOpacity
                                    onPress={() => removeIngredient(item.id)}
                                    activeOpacity={0.5}
                                    style={{ marginLeft: 5 }}
                                >
                                    <Trash2 size={18} color={'#E53E3E'} />
                                </TouchableOpacity>
                            </View>
                            
                        </View>
                    ))
                )}
            </ScrollView>

            <GenerateButton
                selectedCount={selectedCount}
                onPress={handleGerarReceitas}
                style={styles.floatingBtn}
            />
        </View>
    );
}