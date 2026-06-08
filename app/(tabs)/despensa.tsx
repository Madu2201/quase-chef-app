import { Check, Edit2, Trash2 } from "lucide-react-native";
import React from "react";
import { ActivityIndicator, Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Meus imports
import { AddItemCard } from "../../components/AddItemCard";
import { EditItemCard } from "../../components/EditItemCard";
import { GenerateButton } from "../../components/generate_button";
import { Header } from "../../components/header";
import { Colors } from "../../constants/theme";
import { useDespensaScreen } from "../../hooks/useDespensa";
import { useSelecaoIA } from "../../hooks/useSelecaoIA";
import { despensaStyles as styles } from "../../styles/despensa_styles";
import { formatarPercentual } from "../../utils/normalization";

export default function DespensaScreen() {
  const insets = useSafeAreaInsets();

  // Funcionamento geral da tela e lógica de negócios encapsulados no hook personalizado
  const {
    filteredIngredients,
    searchText,
    setSearchText,
    handleAdd,
    nomeNovo,
    setNomeNovo,
    qtdNova,
    setQtdNova,
    metaNova,
    setMetaNova,
    unidadeNova,
    setUnidadeNova,
    showUnitPickerNew,
    setShowUnitPickerNew,
    activeInput,
    setActiveInput,
    editingId,
    setEditingId,
    editForm,
    setEditForm,
    showUnitPickerEdit,
    setShowUnitPickerEdit,
    startEditing,
    saveEdit,
    showMetaHelp,
    toggleIngredient,
    removeIngredient,
    selectedCount,
    selectedIngredientIds,
    isLoading,
  } = useDespensaScreen();

  // Funcionamento da inteligência artificial
  const { handleGerarReceita, isGenerating } = useSelecaoIA();

  // Funções auxiliares
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
    onClose: () => void,
  ) => (
    <View style={styles.unitPickerContainer}>
      {units.map((u) => (
        <TouchableOpacity
          key={u}
          onPress={() => {
            onSelect(u);
            onClose();
          }}
          style={[styles.unitChip, activeUnit === u && styles.unitChipActive]}
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
        title="Sua Despensa"
        centerTitle
        searchText={searchText}
        setSearchText={setSearchText}
        searchPlaceholder="Buscar ingredientes..."
      />

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 150 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* === PAINEL DE ADIÇÃO INTELIGENTE === */}
        <AddItemCard
          label="Adicionar Ingrediente"
          placeholder="Ex: Tomate, Arroz..."
          nameValue={nomeNovo}
          onNameChange={setNomeNovo}
          qtyValue={qtdNova}
          onQtyChange={setQtdNova}
          unitValue={unidadeNova}
          onUnitChange={setUnidadeNova}
          onAddPress={handleAdd}
          showUnitPicker={showUnitPickerNew}
          onToggleUnitPicker={() => setShowUnitPickerNew(!showUnitPickerNew)}
          activeInput={activeInput}
          onNameFocus={() => setActiveInput("nome")}
          onNameBlur={() => setActiveInput(null)}
          onQtyFocus={() => setActiveInput("qtd")}
          onQtyBlur={() => setActiveInput(null)}
          metaValue={metaNova}
          onMetaChange={setMetaNova}
          onMetaFocus={() => setActiveInput("meta")}
          onMetaBlur={() => setActiveInput(null)}
          qtyLabel="ESTOQUE ATUAL"
          onMetaHelp={showMetaHelp}
          styles={styles}
          useAddPanelStyle={true}
        />

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Seu Estoque</Text>
        </View>

        {/* === LISTA DE INGREDIENTES VIVA === */}
        {isLoading ? (
          <ActivityIndicator
            size="large"
            color={Colors.secondary}
            style={styles.activityIndicatorContainer}
          />
        ) : filteredIngredients.length === 0 ? (
          <Text style={styles.emptyText}>
            {searchText ? "Nenhum resultado." : "Sua despensa está vazia."}
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
                  item.qty === 0 && !isEditing && styles.ingredientCardEmpty,
                ]}
              >
                {/* --- MODO EXPANDIDO (EDIÇÃO) --- */}
                {isEditing ? (
                  <EditItemCard
                    editForm={editForm}
                    setEditForm={setEditForm}
                    onSave={saveEdit}
                    onClose={() => setEditingId(null)}
                    styles={styles}
                    showUnitPicker={showUnitPickerEdit}
                    setShowUnitPicker={setShowUnitPickerEdit}
                    renderUnitPicker={renderUnitPicker}
                  />
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
                            item.qty <= 0 && styles.checkboxDisabled,
                            styles.checkboxMargin,
                          ]}
                          disabled={item.qty <= 0 && !item.selected}
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
                          style={[
                            styles.viewNameText,
                            item.qty <= 0 && styles.viewNameTextDisabled
                          ]}
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
                        Meta: {item.ideal_qty} {item.unit} ({formatarPercentual(pct)}%)
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

      {/* === BOTÃO DE GERAR RECEITAS COM IA === */}
      <GenerateButton
        selectedCount={selectedCount}
        disabled={isGenerating}
        loading={isGenerating}
        label="Gerar receitas"
        onPress={() =>
          selectedCount > 0
            ? void handleGerarReceita(selectedIngredientIds)
            : Alert.alert("Atenção", "Selecione ingredientes!")
        }
        style={styles.floatingBtn}
      />
    </View>
  );
}
