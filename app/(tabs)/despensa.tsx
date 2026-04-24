import { router } from "expo-router";
import { Check, ChevronDown, Edit2, HelpCircle, Trash2, X } from "lucide-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator, Alert, ScrollView, Text, TextInput, TouchableOpacity, View
} from "react-native";

import { GenerateButton } from "../../components/generate_button";
import { Header } from "../../components/header";
import { UNIDADES_ACEITAS } from "../../constants/ingredients";
import { Colors } from "../../constants/theme";
import { useDispensa } from "../../hooks/useDispensa";
import { dispensaStyles as styles } from "../../styles/despensa_styles";
import { Ingredient } from "../../types/dispensa";

export default function DispensaScreen() {
  const {
    filteredIngredients, searchText, setSearchText,
    addIngredient, toggleIngredient, removeIngredient, updateIngredientFull,
    selectedCount, isLoading,
  } = useDispensa();

  // Estados de Criação
  const [nomeNovo, setNomeNovo] = useState("");
  const [qtdNova, setQtdNova] = useState("");
  const [metaNova, setMetaNova] = useState("");
  const [unidadeNova, setUnidadeNova] = useState("un");
  const [showUnitPickerNew, setShowUnitPickerNew] = useState(false);

  // Estados de Edição em Lote
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: "", qty: "", ideal_qty: "", unit: "un" });
  const [showUnitPickerEdit, setShowUnitPickerEdit] = useState(false);

  const handleAdd = async () => {
    if (!nomeNovo.trim() || !qtdNova.trim() || !metaNova.trim()) {
      return Alert.alert("Atenção", "Preencha o nome, a quantidade atual e a meta.");
    }
    try {
      await addIngredient(
        nomeNovo,
        Number(qtdNova.replace(",", ".")),
        Number(metaNova.replace(",", ".")),
        unidadeNova
      );
      setNomeNovo(""); setQtdNova(""); setMetaNova("");
      setShowUnitPickerNew(false);
    } catch (e) {
      Alert.alert("Erro", "Falha ao adicionar ingrediente.");
    }
  };

  const startEditing = (item: any) => {
    setEditingId(item.id);
    setEditForm({
      name: item.name,
      qty: String(item.qty),
      ideal_qty: String(item.ideal_qty),
      unit: item.unit
    });
  };

  const saveEdit = () => {
    if (!editForm.name.trim() || !editForm.qty.trim() || !editForm.ideal_qty.trim()) {
      return Alert.alert("Atenção", "Nenhum campo pode ficar vazio.");
    }
    updateIngredientFull(
      editingId!,
      editForm.name,
      Number(editForm.qty.replace(",", ".")),
      Number(editForm.ideal_qty.replace(",", ".")),
      editForm.unit
    );
    setEditingId(null);
  };

  const showMetaHelp = () => {
    Alert.alert(
      "O que é a Meta?",
      "É a quantidade que você sempre quer ter na dispensa (ex: 5kg de Arroz). Nossa IA usará isso para gerar sua Lista de Compras automaticamente quando o estoque baixar!"
    );
  };

  return (
    <View style={styles.container}>
      <Header
        title="Sua Despensa"
        centerTitle
        searchText={searchText}
        setSearchText={setSearchText}
        searchPlaceholder="Buscar ingredientes..."
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* === PAINEL DE ADIÇÃO INTELIGENTE === */}
        <View style={{ backgroundColor: Colors.light, borderRadius: 16, padding: 16, marginBottom: 24, elevation: 2, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: Colors.subtitle, marginBottom: 12 }}>Adicionar Ingrediente</Text>
          
          <View style={{ flexDirection: 'row', gap: 8, marginBottom: 12 }}>
            <TextInput
              style={{ flex: 1, backgroundColor: Colors.background, borderRadius: 8, paddingHorizontal: 12, height: 44, color: Colors.subtitle }}
              placeholder="Ex: Tomate, Arroz..."
              placeholderTextColor={Colors.subtext}
              value={nomeNovo}
              onChangeText={setNomeNovo}
            />
            <TouchableOpacity
              style={{ backgroundColor: Colors.background, borderRadius: 8, paddingHorizontal: 12, height: 44, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}
              onPress={() => setShowUnitPickerNew(!showUnitPickerNew)}
            >
              <Text style={{ color: Colors.subtitle, marginRight: 4 }}>{unidadeNova}</Text>
              <ChevronDown size={16} color={Colors.subtext} />
            </TouchableOpacity>
          </View>

          {showUnitPickerNew && (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
              {UNIDADES_ACEITAS.map(u => (
                <TouchableOpacity key={u} onPress={() => { setUnidadeNova(u); setShowUnitPickerNew(false); }}
                  style={{ backgroundColor: unidadeNova === u ? Colors.primary : Colors.background, paddingVertical: 6, paddingHorizontal: 12, borderRadius: 12 }}>
                  <Text style={{ color: unidadeNova === u ? Colors.light : Colors.subtitle, fontSize: 12 }}>{u}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 11, color: Colors.subtext, marginBottom: 4, fontWeight: 'bold' }}>ESTOQUE ATUAL</Text>
              <TextInput style={{ backgroundColor: Colors.background, borderRadius: 8, paddingHorizontal: 12, height: 44, color: Colors.subtitle }} placeholder="0" keyboardType="numeric" value={qtdNova} onChangeText={setQtdNova} />
            </View>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4, gap: 4 }}>
                <Text style={{ fontSize: 11, color: Colors.subtext, fontWeight: 'bold' }}>META IDEAL</Text>
                <TouchableOpacity onPress={showMetaHelp}>
                  <HelpCircle size={14} color={Colors.primary} />
                </TouchableOpacity>
              </View>
              <TextInput style={{ backgroundColor: Colors.background, borderRadius: 8, paddingHorizontal: 12, height: 44, color: Colors.subtitle }} placeholder="0" keyboardType="numeric" value={metaNova} onChangeText={setMetaNova} />
            </View>
            <TouchableOpacity onPress={handleAdd} style={{ backgroundColor: Colors.primary, height: 44, width: 44, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginTop: 18 }}>
              <Check size={20} color={Colors.light} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Seu Estoque</Text>
        </View>

        {/* === LISTA DE INGREDIENTES VIVA === */}
        {isLoading ? (
          <ActivityIndicator size="large" color={Colors.secondary} style={{ marginTop: 20 }} />
        ) : filteredIngredients.length === 0 ? (
          <Text style={styles.emptyText}>{searchText ? "Nenhum resultado." : "Sua dispensa está vazia."}</Text>
        ) : (
          filteredIngredients.map((item: Ingredient) => {
            
            // Lógica Inteligente da Barra
            const pct = item.ideal_qty > 0 ? Math.min(100, Math.max(0, (item.qty / item.ideal_qty) * 100)) : 100;
            let barColor = "#38A169"; // Verde (Tudo ok)
            if (pct <= 25) barColor = Colors.errorDark || "#C53030"; // Vermelho (Crítico)
            else if (pct <= 50) barColor = "#ffb514"; // Laranja (Atenção)

            const isEditing = editingId === item.id;

            return (
              <View key={item.id} style={[{ backgroundColor: Colors.light, borderRadius: 12, padding: 16, marginBottom: 12, elevation: 2, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } }, !item.selected && { opacity: 0.6 }]}>
                
                {/* --- MODO EXPANDIDO (EDIÇÃO) --- */}
                {isEditing ? (
                  <View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                      <Text style={{ fontWeight: 'bold', fontSize: 16, color: Colors.primary }}>Editar Ingrediente</Text>
                      <TouchableOpacity onPress={() => setEditingId(null)}><X size={20} color={Colors.subtext} /></TouchableOpacity>
                    </View>
                    <TextInput style={{ backgroundColor: Colors.background, borderRadius: 8, padding: 10, marginBottom: 8 }} value={editForm.name} onChangeText={t => setEditForm({...editForm, name: t})} />
                    
                    <View style={{ flexDirection: 'row', gap: 8, marginBottom: 12 }}>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 10, color: Colors.subtext, marginBottom: 2 }}>Atual</Text>
                        <TextInput style={{ backgroundColor: Colors.background, borderRadius: 8, padding: 10 }} keyboardType="numeric" value={editForm.qty} onChangeText={t => setEditForm({...editForm, qty: t})} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 10, color: Colors.subtext, marginBottom: 2 }}>Meta</Text>
                        <TextInput style={{ backgroundColor: Colors.background, borderRadius: 8, padding: 10 }} keyboardType="numeric" value={editForm.ideal_qty} onChangeText={t => setEditForm({...editForm, ideal_qty: t})} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 10, color: Colors.subtext, marginBottom: 2 }}>Unid.</Text>
                        <TouchableOpacity style={{ backgroundColor: Colors.background, borderRadius: 8, padding: 10, alignItems: 'center' }} onPress={() => setShowUnitPickerEdit(!showUnitPickerEdit)}>
                          <Text>{editForm.unit}</Text>
                        </TouchableOpacity>
                      </View>
                    </View>

                    {showUnitPickerEdit && (
                      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
                        {UNIDADES_ACEITAS.map(u => (
                          <TouchableOpacity key={u} onPress={() => { setEditForm({...editForm, unit: u}); setShowUnitPickerEdit(false); }}
                            style={{ backgroundColor: editForm.unit === u ? Colors.primary : Colors.background, paddingVertical: 6, paddingHorizontal: 12, borderRadius: 12 }}>
                            <Text style={{ color: editForm.unit === u ? Colors.light : Colors.subtitle, fontSize: 12 }}>{u}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}

                    <TouchableOpacity onPress={saveEdit} style={{ backgroundColor: Colors.primary, padding: 12, borderRadius: 8, alignItems: 'center' }}>
                      <Text style={{ color: Colors.light, fontWeight: 'bold' }}>Salvar Alterações</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  
                /* --- MODO VISUALIZAÇÃO (DASHBOARD) --- */
                  <View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                        <TouchableOpacity onPress={() => toggleIngredient(item.id)} style={[styles.checkbox, item.selected && styles.checkboxActive, { marginRight: 12 }]}>
                          {item.selected && <Check size={14} color={Colors.light} strokeWidth={3} />}
                        </TouchableOpacity>
                        <Text style={{ fontSize: 16, fontWeight: 'bold', color: Colors.subtitle, flex: 1 }} numberOfLines={1}>{item.name}</Text>
                      </View>

                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
                        <TouchableOpacity onPress={() => startEditing(item)}><Edit2 size={18} color={Colors.subtext} /></TouchableOpacity>
                        <TouchableOpacity onPress={() => removeIngredient(item.id)}><Trash2 size={18} color={Colors.errorDark || "#C53030"} /></TouchableOpacity>
                      </View>
                    </View>

                    {/* Resumo de Dados e Barra de Progresso */}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                      <Text style={{ fontSize: 13, color: Colors.subtitle, fontWeight: '600' }}>
                        Temos: {item.qty} {item.unit}
                      </Text>
                      <Text style={{ fontSize: 12, color: Colors.subtext }}>
                        Meta: {item.ideal_qty} {item.unit} ({Math.round(pct)}%)
                      </Text>
                    </View>

                    <View style={{ height: 8, backgroundColor: Colors.background, borderRadius: 4, overflow: 'hidden' }}>
                      <View style={{ height: '100%', width: `${pct}%`, backgroundColor: barColor, borderRadius: 4 }} />
                    </View>
                  </View>
                )}
              </View>
            );
          })
        )}
      </ScrollView>

      <GenerateButton selectedCount={selectedCount} onPress={() => selectedCount > 0 ? router.push("/selecao_ia") : Alert.alert("Atenção", "Selecione ingredientes!")} style={styles.floatingBtn} />
    </View>
  );
}