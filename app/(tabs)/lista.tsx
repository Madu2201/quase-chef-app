import {
    Check,
    Edit2,
    FileDown,
    PackagePlus,
    Share2,
    Trash2,
    Wand2,
} from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import { AddItemCard } from "../../components/AddItemCard";
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
  // Controle de foco de inputs
  const [activeInput, setActiveInput] = useState<string | null>(null);

  // Undo toast para desfazer marcação como comprado
  const [undoVisible, setUndoVisible] = useState(false);
  const [lastRemovedItem, setLastRemovedItem] = useState<string | null>(null);

  // Edição inline de quantidade
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editQuantidade, setEditQuantidade] = useState("");

  // ============ REFERÊNCIAS ============
  // Timeout para limpar undo toast automaticamente
  const undoTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
  const handleEditarQuantidade = (itemId: string, quantidade: number) => {
    setEditingId(itemId);
    setEditQuantidade(String(quantidade));
  };

  /**
   * Salva a edição de quantidade e fecha modo de edição
   */
  const handleSalvarQuantidade = async () => {
    if (!editingId) return;

    const novaQtd = parseFloat(editQuantidade.replace(",", "."));

    // 1. Mudamos a verificação de < 0 para <= 0
    // 2. Trocamos o título de "Erro" para "Atenção" para ser mais amigável
    if (isNaN(novaQtd) || novaQtd <= 0) {
      Alert.alert(
        "Atenção",
        "A quantidade deve ser maior que zero. Se deseja remover o item, utilize o ícone de lixeira.",
      );
      return;
    }

    await atualizarQuantidade(editingId, novaQtd);
    setEditingId(null);
    setEditQuantidade("");
  };

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
                Para Comprar ({pendentes.length})
              </Text>
            </View>

            {pendentes.map((item) =>
              editingId === item.id ? (
                // Modo de edição de quantidade
                <View
                  key={item.id}
                  style={[styles.itemCard, styles.itemCardEditing]}
                >
                  <View style={styles.itemEditContainer}>
                    <View style={styles.itemEditHeader}>
                      <Text style={styles.itemEditLabel}>
                        Editar Quantidade
                      </Text>
                      <TouchableOpacity onPress={() => setEditingId(null)}>
                        <Text style={styles.itemEditClose}>✕</Text>
                      </TouchableOpacity>
                    </View>
                    <View style={styles.itemEditRow}>
                      <TextInput
                        style={styles.itemEditInput}
                        placeholder="0"
                        keyboardType="decimal-pad"
                        value={editQuantidade}
                        onChangeText={setEditQuantidade}
                        placeholderTextColor={Colors.subtext}
                      />
                      <Text style={styles.itemEditUnit}>{item.unidade}</Text>
                      <TouchableOpacity
                        onPress={handleSalvarQuantidade}
                        style={styles.itemEditSaveBtn}
                      >
                        <Text style={styles.itemEditSaveText}>OK</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ) : (
                // Modo de visualização normal (reformatado como dashboard)
                <View key={item.id} style={styles.itemCardView}>
                  <View style={styles.itemViewHeader}>
                    <View style={styles.itemViewNameSection}>
                      <TouchableOpacity
                        onPress={() => handleToggleWithUndo(item.id)}
                        style={[styles.checkbox, { marginRight: 12 }]}
                      />
                      <Text style={styles.itemViewNameText} numberOfLines={1}>
                        {item.nome}
                      </Text>
                    </View>
                    <View style={styles.itemViewActions}>
                      <TouchableOpacity
                        onPress={() =>
                          handleEditarQuantidade(
                            item.id,
                            item.quantidade_comprar,
                          )
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

            {comprados.length > 0 && (
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
                {comprados.map((item) => (
                  <View
                    key={item.id}
                    style={[styles.itemCard, styles.itemCardComprado]}
                  >
                    <TouchableOpacity
                      onPress={() => toggleItem(item.id)}
                      style={styles.checkboxActive}
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
