import {
  Check,
  Edit2,
  FileDown,
  PackagePlus,
  Share2,
  Trash2,
  Wand2,
} from "lucide-react-native";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from "react-native";

import { AddItemCard } from "../../components/AddItemCard";
import { EditItemCard } from "../../components/EditItemCard";
import { Header } from "../../components/header";
import { Colors } from "../../constants/theme";
import { useDespensa } from "../../hooks/useDespensa";
import { useListaCompras } from "../../hooks/useListaCompras";
import { listaStyles as styles } from "../../styles/lista_styles";
import { exportarListaPendentes } from "../../utils/exportPdf";

/**
 * Tela Principal de Lista de Compras (ListaScreen)
 *
 * Responsabilidades:
 * - Renderizar interface para gerenciar lista de compras
 * - Permitir adição, edição, remoção e compartilhamento de itens
 * - Sincronizar com Despensa para gerar lista automática
 * - Oferecer mecanismo de desfazer (undo) ao marcar como comprado
 *
 * Dependências:
 * - useListaCompras: Hook para todas as operações de negócio
 * - listaStyles: Stylesheet centralizado
 * - exportarListaPendentes: Utilitário para export em PDF
 */
export default function ListaScreen() {
  // ============ HOOK DE LISTA ============
  const {
    pendentes,
    comprados,
    isLoading,
    isGeneratingList,
    addItem,
    gerarListaDaDespensa,
    toggleItem,
    removerItem,
    limparComprados,
    atualizarQuantidade,
    compartilharLista,
    guardarNoEstoque,
  } = useListaCompras();

  // ============ HOOK DE DESPENSA ============
  const { upsertIngredientFromCompra } = useDespensa();

  // ============ ESTADOS DE FORMULÁRIO ============
  // Controle do painel de adição de itens
  const [nomeItem, setNomeItem] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [unidade, setUnidade] = useState("un");
  const [showUnitPicker, setShowUnitPicker] = useState(false);

  // ============ ESTADOS DE UI ============
  // Controle de busca
  const [searchText, setSearchText] = useState("");

  // Controle de foco de inputs
  const [activeInput, setActiveInput] = useState<string | null>(null);

  // Undo toast para desfazer marcação como comprado
  const [undoVisible, setUndoVisible] = useState(false);
  const [lastRemovedItem, setLastRemovedItem] = useState<string | null>(null);

  // Edição inline de quantidade
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    qty: "",
    ideal_qty: "",
    unit: "un",
  });
  const [showUnitPickerEdit, setShowUnitPickerEdit] = useState(false);

  // ============ REFERÊNCIAS ============
  // Timeout para limpar undo toast automaticamente
  const undoTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /**
   * Filtragem de itens (Memoizada para performance)
   */
  const filteredPendentes = useMemo(() => 
    pendentes.filter(item => 
      item.nome.toLowerCase().includes(searchText.toLowerCase())
    ),
    [pendentes, searchText]
  );

  const filteredComprados = useMemo(() => 
    comprados.filter(item => 
      item.nome.toLowerCase().includes(searchText.toLowerCase())
    ),
    [comprados, searchText]
  );

  /**
   * Marca item como comprado com suporte a undo
   * Mostra toast informativo por 3 segundos
   */
  const handleToggleWithUndo = async (itemId: string) => {
    const item = comprados.find((i) => i.id === itemId);

    if (item) {
      if (undoTimeoutRef.current) clearTimeout(undoTimeoutRef.current);

      setLastRemovedItem(itemId);
      setUndoVisible(true);

      undoTimeoutRef.current = setTimeout(() => {
        setUndoVisible(false);
        setLastRemovedItem(null);
      }, 3000);
    }

    await toggleItem(itemId);
  };

  /**
   * Desfaz a última marcação como comprado
   */
  const handleUndoClick = async () => {
    if (lastRemovedItem) {
      if (undoTimeoutRef.current) clearTimeout(undoTimeoutRef.current);
      await toggleItem(lastRemovedItem);
      setUndoVisible(false);
      setLastRemovedItem(null);
    }
  };

  /**
   * Adiciona novo item à lista
   * Validação básica: nome e quantidade obrigatórios
   */
  const handleAddItem = () => {
    if (!nomeItem.trim() || !quantidade.trim()) {
      Alert.alert("Atenção", "Preencha nome e quantidade.");
      return;
    }
    addItem(nomeItem, quantidade, unidade);
    setNomeItem("");
    setQuantidade("");
    setUnidade("un");
    setActiveInput(null);
  };

  /**
   * Inicia modo de edição de quantidade de um item
   */
  const handleEditarQuantidade = (item: any) => {
    setEditingId(item.id);
    setEditForm({
      name: item.nome,
      qty: String(item.quantidade_comprar),
      ideal_qty: "",
      unit: item.unidade,
    });
  };

  /**
   * Salva a edição de quantidade e fecha modo de edição
   */
  const handleSalvarQuantidade = async (form: any) => {
    if (!editingId) return;

    const novaQtd = parseFloat(form.qty.replace(",", "."));

    if (isNaN(novaQtd) || novaQtd <= 0) {
      Alert.alert(
        "Atenção",
        "A quantidade deve ser maior que zero. Se deseja remover o item, utilize o ícone de lixeira.",
      );
      return;
    }

    await atualizarQuantidade(editingId, novaQtd);
    setEditingId(null);
  };

  /**
   * Renderizar picker de unidades
   */
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

  /**
   * Compartilha a lista com outros usuários via Share API nativa
   */
  const handleCompartilhar = async () => {
    await compartilharLista();
  };

  /**
   * Salva itens comprados na despensa com confirmação
   */
  const handleGuardarEstoque = async () => {
    Alert.alert(
      "Guardar no Estoque",
      `Deseja salvar ${comprados.length} item(s) comprado(s) na despensa?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Guardar",
          style: "default",
          onPress: async () => {
            await guardarNoEstoque(async (nome, qtd, unit) => {
              return await upsertIngredientFromCompra(nome, qtd, unit);
            });
          },
        },
      ],
    );
  };

  /**
   * Limpeza de timeouts ao desmontar componente
   */
  useEffect(() => {
    return () => {
      if (undoTimeoutRef.current) clearTimeout(undoTimeoutRef.current);
    };
  }, []);

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
            <TouchableOpacity onPress={handleCompartilhar}>
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
                    item={{
                        id: item.id,
                        name: item.nome,
                        qty: item.quantidade_comprar,
                        unit: item.unidade
                    }}
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
