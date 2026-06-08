import {
  Check,
  Edit2,
  FileDown,
  PackagePlus,
  Share2,
  Trash2,
  Wand2,
} from "lucide-react-native";
import React from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from "react-native";

import { AddItemCard } from "../../components/AddItemCard";
import { EditItemCard } from "../../components/EditItemCard";
import { Header } from "../../components/header";
import { Colors } from "../../constants/theme";
import { useListaCompras } from "../../hooks/useListaCompras";
import { listaStyles as styles } from "../../styles/lista_styles";
import { exportarListaPendentes } from "../../utils/exportPdf";

export default function ListaScreen() {
  const {
    nomeItem,
    setNomeItem,
    quantidade,
    setQuantidade,
    unidade,
    setUnidade,
    showUnitPicker,
    setShowUnitPicker,
    searchText,
    setSearchText,
    activeInput,
    setActiveInput,
    undoVisible,
    editingId,
    setEditingId,
    editForm,
    setEditForm,
    showUnitPickerEdit,
    setShowUnitPickerEdit,
    filteredPendentes,
    filteredComprados,
    handleToggleWithUndo,
    handleUndoClick,
    handleAddItem,
    handleEditarQuantidade,
    handleSalvarQuantidade,
    handleGuardarEstoque,
    pendentes,
    comprados,
    isLoading,
    isGeneratingList,
    gerarListaDaDespensa,
    removerItem,
    limparComprados,
    compartilharLista,
    toggleItem,
  } = useListaCompras();

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
    <View style={styles.containerFlex}>
      <Header
        title="Lista de Compras"
        centerTitle
        searchText={searchText}
        setSearchText={setSearchText}
        searchPlaceholder="Buscar na lista..."
        rightElement={
          <View style={styles.headerRightContainer}>
            <TouchableOpacity onPress={() => exportarListaPendentes(pendentes)}>
              <FileDown size={24} color={Colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity onPress={compartilharLista}>
              <Share2 size={24} color={Colors.primary} />
            </TouchableOpacity>
          </View>
        }
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <AddItemCard
          label="Adicionar item"
          placeholder="Ex: Tomate"
          nameValue={nomeItem}
          onNameChange={setNomeItem}
          qtyValue={quantidade}
          onQtyChange={setQuantidade}
          unitValue={unidade}
          onUnitChange={setUnidade}
          onAddPress={handleAddItem}
          showUnitPicker={showUnitPicker}
          onToggleUnitPicker={() => setShowUnitPicker(!showUnitPicker)}
          activeInput={activeInput}
          onNameFocus={() => setActiveInput("nome")}
          onNameBlur={() => setActiveInput(null)}
          onQtyFocus={() => setActiveInput("qtd")}
          onQtyBlur={() => setActiveInput(null)}
          styles={styles}
          useAddPanelStyle={true}
        />

        <TouchableOpacity
          onPress={gerarListaDaDespensa}
          style={[styles.magicButton, isGeneratingList && { opacity: 0.5 }]}
          disabled={isGeneratingList}
        >
          <Wand2 size={20} color={Colors.light} />
          <Text style={styles.magicButtonText}>Completar via Despensa</Text>
        </TouchableOpacity>

        {isLoading ? (
          <ActivityIndicator
            color={Colors.primary}
            style={styles.activityIndicatorContainer}
          />
        ) : (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                Para Comprar ({filteredPendentes.length})
              </Text>
            </View>

            {filteredPendentes.length === 0 && searchText !== "" && (
              <Text style={styles.emptyText}>Nenhum item pendente encontrado.</Text>
            )}

            {filteredPendentes.map((item) =>
              editingId === item.id ? (
                // Modo de edição de quantidade
                <View
                  key={item.id}
                  style={styles.editingCard}
                >
                  <EditItemCard
                    isListMode
                    editForm={editForm}
                    setEditForm={setEditForm}
                    onSave={handleSalvarQuantidade}
                    onClose={() => setEditingId(null)}
                    styles={styles}
                    showUnitPicker={showUnitPickerEdit}
                    setShowUnitPicker={setShowUnitPickerEdit}
                    renderUnitPicker={renderUnitPicker}
                  />
                </View>
              ) : (
                // Modo de visualização normal (reformatado como dashboard)
                <View key={item.id} style={styles.itemCardView}>
                  <View style={styles.itemViewHeader}>
                    <View style={styles.itemViewNameSection}>
                      <TouchableOpacity
                        onPress={() => handleToggleWithUndo(item.id)}
                        style={[styles.checkbox, styles.checkboxMargin]}
                      />
                      <Text style={styles.itemViewNameText} numberOfLines={1}>
                        {item.nome}
                      </Text>
                    </View>
                    <View style={styles.itemViewActions}>
                      <TouchableOpacity
                        onPress={() =>
                          handleEditarQuantidade(item)
                        }
                      >
                        <Edit2 size={18} color={Colors.subtext} />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => removerItem(item.id)}>
                        <Trash2 size={18} color={Colors.primary} />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <Text style={styles.itemViewStats}>
                    {item.quantidade_comprar} {item.unidade}
                  </Text>
                </View>
              ),
            )}

            {filteredComprados.length > 0 && (
              <View style={styles.historicoCompradoContainer}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitleOff}>Histórico Comprado</Text>
                  <TouchableOpacity onPress={limparComprados}>
                    <Text style={styles.clearText}>LIMPAR TUDO</Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  onPress={handleGuardarEstoque}
                  style={styles.btnGuardarEstoque}
                >
                  <PackagePlus size={20} color={Colors.light} />
                  <Text style={styles.btnGuardarEstoqueText}>
                    Guardar no Estoque
                  </Text>
                </TouchableOpacity>
                {filteredComprados.map((item) => (
                  <View
                    key={item.id}
                    style={[styles.itemCard, styles.itemCardComprado]}
                  >
                    <TouchableOpacity
                      onPress={() => toggleItem(item.id)}
                      style={[styles.checkboxActive, styles.checkboxMargin]}
                    >
                      <Check size={12} color={Colors.light} />
                    </TouchableOpacity>
                    <Text style={styles.itemNameStrikethrough}>
                      {item.nome}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </>
        )}
      </ScrollView>

      {/* Toast de Undo - Minimalista */}
      {undoVisible && (
        <View style={styles.undoToast}>
          <Text style={styles.undoText}>Item marcado como comprado</Text>
          <TouchableOpacity onPress={handleUndoClick}>
            <Text style={styles.undoButton}>DESFAZER</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
