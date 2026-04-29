import { router } from "expo-router";
import { Check, ChevronDown, Edit2, HelpCircle, Trash2, X } from "lucide-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { GenerateButton } from "../../components/generate_button";
import { Header } from "../../components/header";
import { UNIDADES_ACEITAS } from "../../constants/ingredients";
import { Colors } from "../../constants/theme";
import { useDispensa } from "../../hooks/useDispensa";
import { dispensaStyles as styles } from "../../styles/dispensa_styles";
import { validateQuantity } from "../../utils/validation";

export default function DispensaScreen() {
  const {
    filteredIngredients,
    searchText,
    setSearchText,
    addIngredient,
    toggleIngredient,
    removeIngredient,
    updateIngredientFull,
    selectedCount,
    isLoading,
  } = useDispensa();

  // Estados de Criação
  const [nomeNovo, setNomeNovo] = useState("");
  const [qtdNova, setQtdNova] = useState("");
  const [metaNova, setMetaNova] = useState("");
  const [unidadeNova, setUnidadeNova] = useState("un");
  const [showUnitPickerNew, setShowUnitPickerNew] = useState(false);
  const [isAddingIngredient, setIsAddingIngredient] = useState(false);

  // Estados de Edição em Lote
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    qty: "",
    ideal_qty: "",
    unit: "un",
  });
  const [showUnitPickerEdit, setShowUnitPickerEdit] = useState(false);

  // Adicionar ingrediente
  const handleAdd = async () => {
    if (isAddingIngredient) return; // Previne cliques duplos

    if (!nomeNovo.trim() || !qtdNova.trim() || !metaNova.trim()) {
      return Alert.alert(
        "Atenção",
        "Preencha o nome, a quantidade atual e a meta."
      );
    }

    const qty = validateQuantity(qtdNova);
    const ideal = validateQuantity(metaNova);

    if (qty === null || ideal === null) {
      return Alert.alert(
        "Erro",
        "Quantidade deve ser um número entre 0 e 99999."
      );
    }

    if (qty === 0 || ideal === 0) {
      return Alert.alert(
        "Atenção",
        "Quantidade não pode ser zero. Defina um valor maior que zero."
      );
    }

    try {
      setIsAddingIngredient(true);
      await addIngredient(nomeNovo, qty, ideal, unidadeNova);
      setNomeNovo("");
      setQtdNova("");
      setMetaNova("");
      setShowUnitPickerNew(false);
    } catch (e) {
      Alert.alert("Erro", "Falha ao adicionar ingrediente.");
    } finally {
      setIsAddingIngredient(false);
    }
    return;
  };

  // Iniciar edição
  const startEditing = (item: any) => {
    setEditingId(item.id);
    setEditForm({
      name: item.name,
      qty: String(item.qty),
      ideal_qty: String(item.ideal_qty),
      unit: item.unit,
    });
  };

  // Salvar edição
  const saveEdit = () => {
    if (
      !editForm.name.trim() ||
      !editForm.qty.trim() ||
      !editForm.ideal_qty.trim()
    ) {
      return Alert.alert("Atenção", "Nenhum campo pode ficar vazio.");
    }

    const qty = validateQuantity(editForm.qty);
    const ideal = validateQuantity(editForm.ideal_qty);

    if (qty === null || ideal === null) {
      return Alert.alert(
        "Erro",
        "Quantidade deve ser um número entre 0 e 99999."
      );
    }

    updateIngredientFull(editingId!, editForm.name, qty, ideal, editForm.unit);
    setEditingId(null);
  };

  // Mostrar ajuda sobre Meta
  const showMetaHelp = () => {
    Alert.alert(
      "O que é a Meta?",
      "É a quantidade que você sempre quer ter na dispensa (ex: 5kg de Arroz). Nossa IA usará isso para gerar sua Lista de Compras automaticamente quando o estoque baixar!"
    );
  };

  // Determinar cor da barra de progresso
  const getProgressBarColor = (pct: number) => {
    if (pct <= 25) return styles.progressBarRed;
    if (pct <= 50) return styles.progressBarOrange;
    return styles.progressBarGreen;
  };

  // Renderizar picker de unidades
  const renderUnitPicker = (
    units: string[],
    activeUnit: string,
    onSelect: (unit: string) => void,
    onClose: () => void
  ) => (
    <View style={styles.unitPickerContainer}>
      {units.map((u) => (
        <TouchableOpacity
          key={u}
          onPress={() => {
            onSelect(u);
            onClose();
          }}
          style={[
            styles.unitChip,
            activeUnit === u && styles.unitChipActive,
          ]}
        >
          <Text
            style={[
              styles.unitChipText,
              activeUnit === u && styles.unitChipTextActive,
            ]}
          >
            {u}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <Header
        title="Sua Dispensa"
        centerTitle
        searchText={searchText}
        setSearchText={setSearchText}
        searchPlaceholder="Buscar ingredientes..."
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* === PAINEL DE ADIÇÃO INTELIGENTE === */}
        <View style={styles.addPanel}>
          <Text style={styles.addPanelTitle}>Adicionar Ingrediente</Text>

          <View style={styles.addPanelRow}>
            <TextInput
              style={[styles.addPanelNameInput, { fontFamily: "System" }]}
              placeholder="Ex: Tomate, Arroz..."
              placeholderTextColor={Colors.subtext}
              value={nomeNovo}
              onChangeText={setNomeNovo}
            />
            <TouchableOpacity
              style={styles.addPanelUnitButton}
              onPress={() => setShowUnitPickerNew(!showUnitPickerNew)}
            >
              <Text style={styles.addPanelUnitText}>{unidadeNova}</Text>
              <ChevronDown size={16} color={Colors.subtext} />
            </TouchableOpacity>
          </View>

          {showUnitPickerNew &&
            renderUnitPicker(
              UNIDADES_ACEITAS,
              unidadeNova,
              setUnidadeNova,
              () => setShowUnitPickerNew(false)
            )}

          <View style={styles.addPanelFieldsRow}>
            <View style={styles.addPanelField}>
              <Text style={styles.addPanelFieldLabel}>ESTOQUE ATUAL</Text>
              <TextInput
                style={[styles.addPanelFieldInput, { fontFamily: "System" }]}
                placeholder="0"
                keyboardType="numeric"
                value={qtdNova}
                onChangeText={setQtdNova}
              />
            </View>
            <View style={styles.addPanelField}>
              <View style={styles.addPanelFieldHeader}>
                <Text style={styles.addPanelFieldLabel}>META IDEAL</Text>
                <TouchableOpacity onPress={showMetaHelp}>
                  <HelpCircle size={14} color={Colors.secondary} />
                </TouchableOpacity>
              </View>
              <TextInput
                style={[styles.addPanelFieldInput, { fontFamily: "System" }]}
                placeholder="0"
                keyboardType="numeric"
                value={metaNova}
                onChangeText={setMetaNova}
              />
            </View>
            <TouchableOpacity
              onPress={handleAdd}
              style={styles.addPanelButton}
            >
              <Check size={20} color={Colors.light} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Seu Estoque</Text>
        </View>

        {/* === LISTA DE INGREDIENTES VIVA === */}
        {isLoading ? (
          <ActivityIndicator
            size="large"
            color={Colors.secondary}
            style={{ marginTop: 20 }}
          />
        ) : filteredIngredients.length === 0 ? (
          <Text style={styles.emptyText}>
            {searchText ? "Nenhum resultado." : "Sua dispensa está vazia."}
          </Text>
        ) : (
          filteredIngredients.map((item) => {
            // Lógica Inteligente da Barra
            const pct =
              item.ideal_qty > 0
                ? Math.min(100, Math.max(0, (item.qty / item.ideal_qty) * 100))
                : 100;

            const isEditing = editingId === item.id;

            return (
              <View
                key={item.id}
                style={[
                  styles.ingredientCard,
                  item.qty === 0 && !isEditing && styles.ingredientCardEmpty
                ]}
              >
                {/* --- MODO EXPANDIDO (EDIÇÃO) --- */}
                {isEditing ? (
                  <View style={styles.editingContainer}>
                    <View style={styles.editingHeader}>
                      <Text style={styles.editingTitle}>Editar Ingrediente</Text>
                      <TouchableOpacity
                        onPress={() => setEditingId(null)}
                        style={styles.editingCloseButton}
                      >
                        <X size={20} color={Colors.subtext} />
                      </TouchableOpacity>
                    </View>

                    <TextInput
                      style={[styles.editingNameInput, { fontFamily: "System" }]}
                      value={editForm.name}
                      onChangeText={(t) =>
                        setEditForm({ ...editForm, name: t })
                      }
                    />

                    <View style={styles.editingFieldsRow}>
                      <View style={styles.editingField}>
                        <Text style={styles.editingFieldLabel}>Atual</Text>
                        <TextInput
                          style={[styles.editingFieldInput, { fontFamily: "System" }]}
                          keyboardType="numeric"
                          value={editForm.qty}
                          onChangeText={(t) =>
                            setEditForm({ ...editForm, qty: t })
                          }
                        />
                      </View>
                      <View style={styles.editingField}>
                        <Text style={styles.editingFieldLabel}>Meta</Text>
                        <TextInput
                          style={[styles.editingFieldInput, { fontFamily: "System" }]}
                          keyboardType="numeric"
                          value={editForm.ideal_qty}
                          onChangeText={(t) =>
                            setEditForm({ ...editForm, ideal_qty: t })
                          }
                        />
                      </View>
                      <View style={styles.editingField}>
                        <Text style={styles.editingFieldLabel}>Unid.</Text>
                        <TouchableOpacity
                          style={[
                            styles.editingFieldInput,
                            { alignItems: "center" },
                          ]}
                          onPress={() =>
                            setShowUnitPickerEdit(!showUnitPickerEdit)
                          }
                        >
                          <Text style={{ color: Colors.dark }}>
                            {editForm.unit}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>

                    {showUnitPickerEdit &&
                      renderUnitPicker(
                        UNIDADES_ACEITAS,
                        editForm.unit,
                        (unit) =>
                          setEditForm({ ...editForm, unit }),
                        () => setShowUnitPickerEdit(false)
                      )}

                    <TouchableOpacity
                      onPress={saveEdit}
                      style={styles.editingSaveButton}
                    >
                      <Text style={styles.editingSaveButtonText}>
                        Salvar Alterações
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  /* --- MODO VISUALIZAÇÃO (DASHBOARD) --- */
                  <View style={styles.viewContainer}>
                    <View style={styles.viewHeader}>
                      <View style={styles.viewNameSection}>
                        <TouchableOpacity
                          onPress={() => toggleIngredient(item.id)}
                          style={[
                            styles.checkbox,
                            item.selected && styles.checkboxActive,
                            { marginRight: 12 },
                          ]}
                        >
                          {item.selected && (
                            <Check
                              size={14}
                              color={Colors.light}
                              strokeWidth={3}
                            />
                          )}
                        </TouchableOpacity>
                        <Text
                          style={styles.viewNameText}
                          numberOfLines={1}
                        >
                          {item.name}
                        </Text>
                      </View>

                      <View style={styles.viewActions}>
                        <TouchableOpacity onPress={() => startEditing(item)}>
                          <Edit2 size={18} color={Colors.subtext} />
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => removeIngredient(item.id)}
                        >
                          <Trash2 size={18} color="#C53030" />
                        </TouchableOpacity>
                      </View>
                    </View>

                    {/* Resumo de Dados e Barra de Progresso */}
                    <View style={styles.viewStatsRow}>
                      <Text style={styles.viewStatsLeft}>
                        Temos: {item.qty} {item.unit}
                      </Text>
                      <Text style={styles.viewStatsRight}>
                        Meta: {item.ideal_qty} {item.unit} ({Math.round(pct)}%)
                      </Text>
                    </View>

                    <View style={styles.progressBarContainer}>
                      <View
                        style={[
                          styles.progressBar,
                          getProgressBarColor(pct),
                          { width: `${pct}%` },
                        ]}
                      />
                    </View>
                  </View>
                )}
              </View>
            );
          })
        )}
      </ScrollView>

      <GenerateButton
        selectedCount={selectedCount}
        onPress={() =>
          selectedCount > 0
            ? router.push("/selecao_ia")
            : Alert.alert("Atenção", "Selecione ingredientes!")
        }
        style={styles.floatingBtn}
      />
    </View>
  );
}
