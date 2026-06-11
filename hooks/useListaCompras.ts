import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Alert, Share } from "react-native";

// Meus imports
import { MESSAGES } from "../constants/messages";
import { supabase } from "../services/supabase";
import { Ingredient } from "../types/despensa";
import { CompraItem, EditForm } from "../types/lista";
import { formatarQuantidade } from "../utils/normalization";
import { filterByText, normalizeItemName, parseNumero } from "../utils/validation";
import { useAuth } from "./useAuth";
import { useDespensa } from "./useDespensa";
import { useNetworkStatus } from "./useNetworkStatus";

/// Busca e atualiza a lista de compras do usuário
export function useListaCompras() {
  const { user } = useAuth();
  const { ingredients, upsertIngredientFromCompra } = useDespensa();
  const { isOffline, notifyInternetRequired } = useNetworkStatus();
  const [items, setItems] = useState<CompraItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGeneratingList, setIsGeneratingList] = useState(false);

  const [nomeItem, setNomeItem] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [unidade, setUnidade] = useState("un");
  const [showUnitPicker, setShowUnitPicker] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [activeInput, setActiveInput] = useState<string | null>(null);
  const [undoVisible, setUndoVisible] = useState(false);
  const [undoStack, setUndoStack] = useState<string[]>([]); // Fila de itens para desfazer
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<EditForm>({
    name: "",
    qty: "",
    ideal_qty: "",
    unit: "un",
  });
  const [showUnitPickerEdit, setShowUnitPickerEdit] = useState(false);
  const undoTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const pendentes = useMemo(
    () => items.filter((item) => !item.comprado),
    [items],
  );
  const comprados = useMemo(
    () => items.filter((item) => item.comprado),
    [items],
  );

  // Carrega a lista do usuário ao montar
  const buscarLista = useCallback(async () => {
    if (!user?.id) return;
    if (isOffline) {
      setIsLoading(false);
      return;
    }
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("lista_compras")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setItems(data || []);
    } catch (e) {
      console.error("Erro ao buscar lista:", e);
    } finally {
      setIsLoading(false);
    }
  }, [user, isOffline]);

  // Atualiza a lista sempre que o usuário muda ou o hook é montado
  useEffect(() => {
    buscarLista();
  }, [buscarLista]);

  useEffect(() => {
    return () => {
      if (undoTimeoutRef.current) clearTimeout(undoTimeoutRef.current);
    };
  }, []);

  // Adiciona um item na lista
  const handleAddItem = async () => {
    if (!nomeItem.trim() || !quantidade.trim()) {
      Alert.alert(MESSAGES.ALERT_ATTENTION, MESSAGES.VALIDATION_LIST_ITEM_EMPTY);
      return;
    }

    await addItem(nomeItem, quantidade, unidade);
    setNomeItem("");
    setQuantidade("");
    setUnidade("un");
    setActiveInput(null);
  };

  const addItem = async (nome: string, qtd: string, unidade: string) => {
    if (!user?.id) return;
    if (!notifyInternetRequired(MESSAGES.OFFLINE_EDIT_LIST)) {
      return;
    }

    const qtdNumero = parseNumero(qtd);
    if (qtdNumero <= 0) {
      Alert.alert(MESSAGES.ALERT_ATTENTION, MESSAGES.VALIDATION_LIST_QUANTITY_INVALID);
      return;
    }

    // Normaliza o nome para comparação (case-insensitive)
    const nomeNormalizado = normalizeItemName(nome);

    // Verifica se já existe item com esse nome e unidade
    const itemExistente = items.find(
      (item) =>
        normalizeItemName(item.nome) === nomeNormalizado &&
        item.unidade === unidade &&
        !item.comprado,
    );

    if (itemExistente) {
      // Item existe: soma as quantidades
      const novaQuantidade = formatarQuantidade(itemExistente.quantidade_comprar + qtdNumero);
      await atualizarQuantidade(itemExistente.id, novaQuantidade);
      Alert.alert(
        MESSAGES.LABEL_SUCCESS,
        `Quantidade de ${nome} ${MESSAGES.INFO_ITEM_UPDATED} ${novaQuantidade} ${unidade}`,
      );
      return;
    }

    // Item não existe: adiciona novo
    const novoItem = {
      user_id: user.id,
      nome: normalizeItemName(nome),
      quantidade_comprar: formatarQuantidade(qtdNumero),
      unidade: unidade,
      comprado: false,
    };

    const { data, error } = await supabase
      .from("lista_compras")
      .insert([novoItem])
      .select();

    if (!error && data) {
      setItems((prev) => [data[0], ...prev]);
    } else if (error) {
      Alert.alert(MESSAGES.ERROR_ADD_LIST_ITEM, error.message);
    }
  };

  // Altera o status de um item (comprado / pendente)
  const handleToggleWithUndo = async (itemId: string) => {
    const item = pendentes.find((i) => i.id === itemId);

    if (item) {
      // Adiciona à fila de undo
      setUndoStack((prev) => [itemId, ...prev]);
      setUndoVisible(true);

      // Limpa o timeout anterior
      if (undoTimeoutRef.current) clearTimeout(undoTimeoutRef.current);

      // Define novo timeout de 6 segundos
      undoTimeoutRef.current = setTimeout(() => {
        setUndoStack([]);
        setUndoVisible(false);
      }, 6000);
    }

    await toggleItem(itemId);
  };

  // Desfaz a alteração do último item clicado
  const handleUndoClick = async () => {
    if (undoStack.length === 0) return;

    const lastItemId = undoStack[0];
    setUndoStack((prev) => prev.slice(1)); // Remove o primeiro da fila

    if (undoTimeoutRef.current) clearTimeout(undoTimeoutRef.current);

    if (undoStack.length === 1) {
      // Se era o último, esconde o toast
      setUndoVisible(false);
    } else {
      // Se há mais, reinicia o timeout
      undoTimeoutRef.current = setTimeout(() => {
        setUndoStack([]);
        setUndoVisible(false);
      }, 6000);
    }

    await toggleItem(lastItemId);
  };

  // Edita a quantidade de um item
  const handleEditarQuantidade = (item: CompraItem) => {
    setEditingId(item.id);
    setEditForm({
      name: item.nome,
      qty: String(item.quantidade_comprar),
      ideal_qty: "",
      unit: item.unidade,
    });
  };

  // Salva a quantidade editada de um item
  const handleSalvarQuantidade = async (form: EditForm) => {
    if (!editingId) return;

    const novaQtd = parseFloat(form.qty.replace(",", "."));
    if (isNaN(novaQtd) || novaQtd <= 0) {
      Alert.alert(
        MESSAGES.ALERT_ATTENTION,
        MESSAGES.VALIDATION_LIST_QUANTITY_ZERO,
      );
      return;
    }

    await atualizarQuantidade(editingId, novaQtd);
    setEditingId(null);
  };

  // Guarda os itens comprados na despensa e remove da lista
  const handleGuardarEstoque = async () => {
    Alert.alert(
      MESSAGES.DIALOG_SAVE_STOCK_TITLE,
      `Deseja salvar ${comprados.length} item(s) comprado(s) na despensa?`,
      [
        { text: MESSAGES.BUTTON_CANCEL, style: "cancel" },
        {
          text: MESSAGES.BUTTON_SAVE,
          style: "default",
          onPress: async () => {
            await guardarNoEstoque(upsertIngredientFromCompra);
          },
        },
      ],
    );
  };

  const filteredPendentes = useMemo(
    () => filterByText(pendentes, searchText),
    [pendentes, searchText],
  );

  const filteredComprados = useMemo(
    () => filterByText(comprados, searchText),
    [comprados, searchText],
  );

  // Atualiza a quantidade de um item específico
  const atualizarQuantidade = async (id: string, novaQuantidade: number) => {
    if (
      !notifyInternetRequired(
        MESSAGES.OFFLINE_UPDATE_LIST,
      )
    ) {
      return;
    }

    // Garante no máximo 2 casas decimais
    const qtdFormatada = formatarQuantidade(novaQuantidade);

    // Agora o hook confia que a validação foi feita antes da chamada
    setItems((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, quantidade_comprar: qtdFormatada } : i,
      ),
    );

    await supabase
      .from("lista_compras")
      .update({ quantidade_comprar: qtdFormatada })
      .eq("id", id);
  };

  // Atualiza a lista com itens faltantes da despensa
  const gerarListaDaDespensa = async () => {
    if (isGeneratingList) return; // Previne cliques duplos
    if (!user?.id) return;
    if (
      !notifyInternetRequired(
        MESSAGES.OFFLINE_GENERATE_LIST,
      )
    ) {
      return;
    }

    setIsGeneratingList(true);

    // Filtra apenas itens onde o estoque atual é menor que a meta
    const itensFaltantes = ingredients.filter((ing: Ingredient) => {
      const atual = ing.qty || 0;
      const ideal = ing.ideal_qty || 0;
      return atual < ideal;
    });

    if (itensFaltantes.length === 0) {
      setIsGeneratingList(false);
      return Alert.alert(
        MESSAGES.DIALOG_GENERATE_LIST_TITLE,
        MESSAGES.DIALOG_GENERATE_LIST_MESSAGE,
      );
    }

    try {
      // Processa cada item faltante
      for (const ing of itensFaltantes) {
        const nomeNormalizado = normalizeItemName(ing.name);
        const rawQtdFaltante = Math.max(0, (ing.ideal_qty || 0) - (ing.qty || 0));
        const qtdFaltante = formatarQuantidade(rawQtdFaltante);

        // Verifica se já existe na lista (não comprado)
        const itemExistente = pendentes.find(
          (item) =>
            normalizeItemName(item.nome) === nomeNormalizado &&
            item.unidade === ing.unit,
        );

        if (itemExistente) {
          // Atualiza quantidade ao invés de criar novo
          await supabase
            .from("lista_compras")
            .update({ quantidade_comprar: qtdFaltante })
            .eq("id", itemExistente.id);
        } else {
          // Cria novo item
          await supabase.from("lista_compras").insert([
            {
              user_id: user.id,
              nome: ing.name,
              quantidade_comprar: qtdFaltante,
              unidade: ing.unit,
              comprado: false,
            },
          ]);
        }
      }

      // Recarrega a lista do banco
      await buscarLista();
      Alert.alert(
        MESSAGES.DIALOG_GENERATE_LIST_SUCCESS_TITLE,
        MESSAGES.DIALOG_GENERATE_LIST_SUCCESS_MESSAGE,
      );
    } catch {
      Alert.alert(MESSAGES.ERROR_GENERATE_LIST, MESSAGES.ERROR_GENERATE_LIST_FAILED);
    } finally {
      setIsGeneratingList(false);
    }
  };

  // Alterna comprado / pendente
  const toggleItem = async (id: string) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;

    if (
      !notifyInternetRequired(
        MESSAGES.OFFLINE_UPDATE_LIST,
      )
    ) {
      return;
    }

    const novoStatus = !item.comprado;
    // Optimistic UI Update (atualiza tela antes do banco)
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, comprado: novoStatus } : i)),
    );

    await supabase
      .from("lista_compras")
      .update({ comprado: novoStatus })
      .eq("id", id);
  };

  // Remove item
  const removerItem = async (id: string) => {
    if (!notifyInternetRequired(MESSAGES.OFFLINE_EDIT_LIST)) {
      return;
    }
    setItems((prev) => prev.filter((i) => i.id !== id));
    await supabase.from("lista_compras").delete().eq("id", id);
  };

  // Limpa itens comprados
  const limparComprados = async () => {
    if (!notifyInternetRequired(MESSAGES.OFFLINE_CLEAR_LIST)) {
      return;
    }
    setItems((prev) => prev.filter((i) => !i.comprado));
    await supabase
      .from("lista_compras")
      .delete()
      .eq("user_id", user?.id)
      .eq("comprado", true);
  };

  // Guarda comprado no estoque e remove da lista
  const guardarNoEstoque = async (
    onUpsert: (nome: string, qtd: number, unit: string) => Promise<boolean>,
  ) => {
    if (!user?.id) return;
    if (
      !notifyInternetRequired(
        MESSAGES.OFFLINE_SAVE_LIST_STOCK,
      )
    ) {
      return;
    }

    const itensParaGuardar = items.filter((i) => i.comprado);

    if (itensParaGuardar.length === 0) {
      Alert.alert(MESSAGES.ALERT_ATTENTION, MESSAGES.VALIDATION_LIST_NO_ITEMS);
      return;
    }

    const idsGuardadosComSucesso: string[] = [];

    for (const item of itensParaGuardar) {
      const sucesso = await onUpsert(
        item.nome,
        Number(item.quantidade_comprar),
        item.unidade,
      );
      if (sucesso) {
        idsGuardadosComSucesso.push(item.id);
      }
    }

    // Mostra mensagem de sucesso/parcial/erro baseado nos resultados
    const total = itensParaGuardar.length;
    const ok = idsGuardadosComSucesso.length;

    if (ok > 0) {
      for (const id of idsGuardadosComSucesso) {
        await supabase.from("lista_compras").delete().eq("id", id);
      }
      setItems((prev) => prev.filter((i) => !idsGuardadosComSucesso.includes(i.id)));
    }

    if (ok === total) {
      Alert.alert(
        MESSAGES.DIALOG_STOCK_ALL_OK_TITLE,
        `${ok} ${ok === 1 ? MESSAGES.INFO_SAVE_STOCK_SINGULAR : MESSAGES.INFO_SAVE_STOCK_PLURAL} na sua despensa.`,
      );
    } else if (ok > 0) {
      Alert.alert(
        MESSAGES.DIALOG_STOCK_PARTIAL_TITLE,
        `${ok} de ${total} ${total === 1 ? MESSAGES.INFO_SAVE_STOCK_PARTIAL_ITEM : MESSAGES.INFO_SAVE_STOCK_PARTIAL_ITEMS} na despensa. Os restantes permanecem na lista para tentar de novo.`,
      );
    } else {
      Alert.alert(
        MESSAGES.DIALOG_STOCK_ERROR_TITLE,
        MESSAGES.DIALOG_STOCK_ERROR_MESSAGE,
      );
    }
  };

  // Compartilha a lista via Share API
  const compartilharLista = async () => {
    if (items.length === 0) {
      Alert.alert(MESSAGES.DIALOG_LIST_EMPTY_TITLE, MESSAGES.DIALOG_LIST_EMPTY_MESSAGE);
      return;
    }

    try {
      const listaFormatada = items
        .filter((i) => !i.comprado)
        .map(
          (item) =>
            `• ${item.nome}: ${item.quantidade_comprar} ${item.unidade}`,
        )
        .join("\n");

      const mensagem = `Confira minha lista de compras:\n\n${listaFormatada}`;

      await Share.share({
        message: mensagem,
        title: "Lista de Compras",
        url: undefined,
      });
    } catch (error) {
      Alert.alert(MESSAGES.ERROR_SHARE_LIST, String(error));
    }
  };

  return {
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
    // Operações CRUD
    toggleItem,
    removerItem,
    limparComprados,
    // Operações avançadas
    gerarListaDaDespensa,
    guardarNoEstoque,
    atualizarQuantidade,
    compartilharLista,
  };
}