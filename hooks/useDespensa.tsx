import React, {
  createContext, useCallback, useContext, useEffect, useMemo, useRef, useState
} from "react";
import { Alert } from "react-native";

// Meus imports
import { INGREDIENTES_LIVRES } from "../constants/ingredients";
import { supabase } from "../services/supabase";
import {
  AbatimentoResultado, DespensaContextData, DespensaScreenHookData, DespensaUpdatePayload, Ingredient,
} from "../types/despensa";
import type { CompraItem } from "../types/lista";
import { EditForm } from "../types/lista";
import {
  converterDaBaseParaUnidade, converterParaUnidadeBase, formatarQuantidade, nomesIngredientesCompativeis,
  normalizarTexto
} from "../utils/normalization";
import { calcularUpsertDecision } from "../utils/upsertUtils";
import { validateQuantity } from "../utils/validation";
import { useAuth } from "./useAuth";
import { useNetworkStatus } from "./useNetworkStatus";

const DespensaContext = createContext<DespensaContextData>(
  {} as DespensaContextData,
);

// Função principal para gerenciamento da despensa, incluindo lógica de negócios e integrações com o banco de dados
export function DespensaProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { isOffline, notifyInternetRequired } = useNetworkStatus();
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const ingredientsRef = useRef<Ingredient[]>([]);
  const [searchText, setSearchText] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    ingredientsRef.current = ingredients;
  }, [ingredients]);

  // Busca inicial do banco (Agora com quantidade_ideal)
  const buscarDespensa = useCallback(async () => {
    if (!user?.id) return;
    if (isOffline) {
      setIsLoading(false);
      return;
    }
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("dispensa")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setIngredients(
        data?.map((item) => ({
          id: item.id,
          name: item.nome_base,
          qty: Number(item.quantidade),
          ideal_qty: Number(item.quantidade_ideal || item.quantidade),
          unit: item.unidade,
          selected: item.selected,
        })) || [],
      );
    } catch (error) {
      console.error("Erro ao buscar despensa:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user, isOffline]);

  useEffect(() => {
    buscarDespensa();
  }, [buscarDespensa]);

  // Filtro de pesquisa
  const filteredIngredients = useMemo(
    () =>
      ingredients.filter((i) =>
        i.name.toLowerCase().includes(searchText.toLowerCase()),
      ),
    [ingredients, searchText],
  );

  // Adicionar ingrediente (com validação e formatação)
  const addIngredient = async (
    nome: string,
    qtd: number,
    ideal_qtd: number,
    unidade: string,
  ) => {
    if (!user?.id) return;
    if (!notifyInternetRequired("Reconecte-se para adicionar itens à despensa.")) {
      return;
    }

    const { data, error } = await supabase
      .from("dispensa")
      .insert([
        {
          user_id: user.id,
          nome_base: nome,
          quantidade: qtd,
          quantidade_ideal: ideal_qtd,
          unidade: unidade,
          selected: false,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Erro ao inserir:", error);
      Alert.alert("Erro", "Não foi possível adicionar o ingrediente.");
    } else if (data) {
      setIngredients((prev) => [
        {
          id: data.id,
          name: data.nome_base,
          qty: Number(data.quantidade),
          ideal_qty: Number(data.quantidade_ideal),
          unit: data.unidade,
          selected: data.selected,
        },
        ...prev,
      ]);
    }
  };

  // Atualizar ingrediente
  const toggleIngredient = async (id: string) => {
    const item = ingredients.find((i) => i.id === id);
    if (!item) return;

    if (
      !notifyInternetRequired(
        "Reconecte-se para atualizar itens da despensa.",
      )
    ) {
      return;
    }

    // Impede a seleção de itens com quantidade zero
    if (item.qty <= 0 && !item.selected) {
      Alert.alert(
        "Ingrediente Esgotado",
        "Você não pode selecionar itens com quantidade zero para gerar receitas."
      );
      return;
    }

    setIngredients((prev) =>
      prev.map((i) => (i.id === id ? { ...i, selected: !i.selected } : i)),
    );

    const { error } = await supabase
      .from("dispensa")
      .update({ selected: !item.selected })
      .eq("id", id);

    if (error) {
      setIngredients((prev) =>
        prev.map((i) => (i.id === id ? { ...i, selected: item.selected } : i)),
      );
    }
  };

  // Remover ingrediente
  const removeIngredient = async (id: string) => {
    if (!notifyInternetRequired("Reconecte-se para remover itens da despensa.")) {
      return;
    }
    const backup = [...ingredients];
    setIngredients((prev) => prev.filter((i) => i.id !== id));
    const { error } = await supabase.from("dispensa").delete().eq("id", id);
    if (error) {
      setIngredients(backup);
      Alert.alert("Erro", "Não foi possível remover o ingrediente.");
    }
  };

  // Atualiza o card inteiro de uma vez
  const updateIngredientFull = async (
    id: string,
    name: string,
    qty: number,
    ideal_qty: number,
    unit: string,
  ) => {
    if (!notifyInternetRequired("Reconecte-se para editar a despensa.")) {
      return;
    }

    const formattedQty = formatarQuantidade(qty);
    const formattedIdeal = formatarQuantidade(ideal_qty);

    const backup = [...ingredients];
    setIngredients((prev) =>
      prev.map((i) =>
        i.id === id
          ? {
            ...i,
            name,
            qty: formattedQty,
            ideal_qty: formattedIdeal,
            unit,
          }
          : i,
      ),
    );

    // Atualiza no banco de dados
    const { error } = await supabase
      .from("dispensa")
      .update({
        nome_base: name,
        quantidade: formattedQty,
        quantidade_ideal: formattedIdeal,
        unidade: unit,
      })
      .eq("id", id);

    if (error) {
      setIngredients(backup);
      Alert.alert("Erro", "Falha ao salvar as edições do ingrediente.");
    }
  };

  // Adicionar ingrediente de compra (com lógica de upsert inteligente)
  const upsertIngredientFromCompra = async (
    nome: string,
    qtyComprada: number,
    unidadeComprada: string,
  ): Promise<boolean> => {
    if (!user?.id) return false;
    if (
      !notifyInternetRequired(
        "Reconecte-se para guardar itens na despensa.",
      )
    ) {
      return false;
    }

    const nomeNorm = normalizarTexto(nome);
    const existente = ingredientsRef.current.find(
      (ing) => normalizarTexto(ing.name) === nomeNorm,
    );

    // Mock para usar a nossa função pura
    const itemCompradoMock: CompraItem = {
      id: "",
      user_id: user.id,
      nome,
      quantidade_comprar: qtyComprada,
      unidade: unidadeComprada,
      comprado: false,
    };

    // Decidir o que deve ser feito (INSERT, UPDATE ou IGNORAR) e qual será a nova quantidade
    const decision = calcularUpsertDecision(itemCompradoMock, existente);
    const formattedNovoValor = formatarQuantidade(decision.novoValor);

    if (decision.acao === "INSERT") {
      const { data, error } = await supabase
        .from("dispensa")
        .insert([
          {
            user_id: user.id,
            nome_base: nome,
            quantidade: formattedNovoValor,
            quantidade_ideal: formattedNovoValor,
            unidade: decision.unidadeFinal,
            selected: false,
          },
        ])
        .select()
        .single();

      if (error) {
        console.error("Erro ao inserir novo item no estoque:", error);
        return false;
      }

      if (!data) {
        return false;
      }

      // Adiciona o novo ingrediente na lista localmente
      const novoIngrediente: Ingredient = {
        id: data.id,
        name: data.nome_base,
        qty: Number(data.quantidade),
        ideal_qty: Number(data.quantidade_ideal || data.quantidade),
        unit: data.unidade,
        selected: data.selected,
      };
      ingredientsRef.current = [novoIngrediente, ...ingredientsRef.current];
      setIngredients(ingredientsRef.current);
      return true;
    } else {
      if (!existente) return false;

      const { error } = await supabase
        .from("dispensa")
        .update({
          quantidade: formattedNovoValor,
          unidade: decision.unidadeFinal,
        })
        .eq("id", existente.id);

      if (error) {
        console.error("Erro ao atualizar estoque:", error);
        return false;
      }

      ingredientsRef.current = ingredientsRef.current.map((i) =>
        i.id === existente.id
          ? { ...i, qty: formattedNovoValor, unit: decision.unidadeFinal }
          : i,
      );
      setIngredients(ingredientsRef.current);
      return true;
    }
  };

  // Contagem de itens selecionados para geração de receitas
  const selectedCount = useMemo(
    () => ingredients.filter((i) => i.selected).length,
    [ingredients],
  );
  // Nomes dos itens selecionados
  const selectedIngredients = useMemo(
    () => ingredients.filter((i) => i.selected).map((i) => i.name),
    [ingredients],
  );
  // IDs dos itens selecionados
  const selectedIngredientIds = useMemo(
    () => ingredients.filter((i) => i.selected).map((i) => i.id),
    [ingredients],
  );

  // Abater ingredientes da receita (após preparo) com lógica de compatibilidade, baixa confiança e ingredientes livres
  const abaterIngredientesDaReceita = async (
    rawIngredients: string,
  ): Promise<AbatimentoResultado> => {
    if (!user?.id || !rawIngredients) {
      return {
        sucesso: false,
        abatidos: 0,
        ignoradosIncompativeis: 0,
        ignoradosNaoEncontrados: 0,
        ignoradosBaixaConfianca: 0,
        ignoradosLivres: 0,
        ignoradosDetalhes: [],
        mensagem: "Usuário não autenticado ou ingredientes inválidos.",
      };
    }

    if (
      !notifyInternetRequired(
        "Reconecte-se para atualizar a despensa após o preparo.",
      )
    ) {
      return {
        sucesso: false,
        abatidos: 0,
        ignoradosIncompativeis: 0,
        ignoradosNaoEncontrados: 0,
        ignoradosBaixaConfianca: 0,
        ignoradosLivres: 0,
        ignoradosDetalhes: [],
        mensagem: "Reconecte-se à internet para atualizar sua despensa.",
      };
    }

    let ingredientesReceita: any[] = [];
    try {
      ingredientesReceita = JSON.parse(rawIngredients);
    } catch (error) {
      console.error(
        "Erro ao parseredientes da receita para abatimento:",
        error,
      );
      return {
        sucesso: false,
        abatidos: 0,
        ignoradosIncompativeis: 0,
        ignoradosNaoEncontrados: 0,
        ignoradosBaixaConfianca: 0,
        ignoradosLivres: 0,
        ignoradosDetalhes: [],
        mensagem: "Não foi possível interpretar os ingredientes da receita.",
      };
    }

    if (
      !Array.isArray(ingredientesReceita) ||
      ingredientesReceita.length === 0
    ) {
      return {
        sucesso: true,
        abatidos: 0,
        ignoradosIncompativeis: 0,
        ignoradosNaoEncontrados: 0,
        ignoradosBaixaConfianca: 0,
        ignoradosLivres: 0,
        ignoradosDetalhes: [],
      };
    }

    // Atualizar estoque localmente com base nos ingredientes da receita, aplicando as regras de negócio
    const estoqueAtualizado = [...ingredients];
    const alteracoes: DespensaUpdatePayload[] = [];
    let ignoradosIncompativeis = 0;
    let ignoradosNaoEncontrados = 0;
    let ignoradosBaixaConfianca = 0;
    let ignoradosLivres = 0;
    const ignoradosDetalhes: any[] = [];

    for (const ingredienteReceita of ingredientesReceita) {
      const nomeReceita =
        ingredienteReceita?.nome_base ||
        ingredienteReceita?.texto_original ||
        "";
      if (!nomeReceita) continue;

      const ehLivre = INGREDIENTES_LIVRES.some((livre) =>
        nomesIngredientesCompativeis(nomeReceita, livre),
      );
      if (ehLivre) {
        ignoradosLivres += 1;
        ignoradosDetalhes.push({
          nome: nomeReceita,
          motivo: 'livre',
          detalhes: 'Ingrediente da lista de bases livres (sal, água, óleo)',
        });
        continue;
      }

      const nomeReceitaNormalizado = normalizarTexto(nomeReceita);
      const indexDespensaExato = estoqueAtualizado.findIndex(
        (item) => normalizarTexto(item.name) === nomeReceitaNormalizado,
      );
      const indexDespensaCompativel =
        indexDespensaExato >= 0
          ? indexDespensaExato
          : estoqueAtualizado.findIndex((item) =>
            nomesIngredientesCompativeis(nomeReceita, item.name),
          );

      const indexDespensa = indexDespensaCompativel;
      if (indexDespensa < 0) {
        ignoradosNaoEncontrados += 1;
        ignoradosDetalhes.push({
          nome: nomeReceita,
          motivo: 'nao_encontrado',
          detalhes: 'Não encontrado no estoque da despensa',
        });
        continue;
      }

      const itemDespensa = estoqueAtualizado[indexDespensa];
      const estoqueBase = converterParaUnidadeBase(
        itemDespensa.qty,
        itemDespensa.unit,
      );

      let quantidadeConsumir = 0;

      const quantidadeGramasMl =
        Number(ingredienteReceita?.quantidade_gramas_ml) || 0;
      const baixaConfianca = Boolean(ingredienteReceita?.baixa_confianca);
      if (baixaConfianca && quantidadeGramasMl > 0) {
        ignoradosBaixaConfianca += 1;
        ignoradosDetalhes.push({
          nome: nomeReceita,
          motivo: 'baixa_confianca',
          detalhes: `Quantidade com baixa confiança (${quantidadeGramasMl}${estoqueBase.unidadeBase}). Ignorado por segurança.`,
        });
        continue;
      }

      // PRIORIDADE 1: Se IA preencheu quantidade_gramas_ml, isso é sinal de conversão
      if (quantidadeGramasMl > 0) {
        // Estoque DEVE estar em g/ml para usar essa métrica
        if (["g", "ml"].includes(estoqueBase.unidadeBase)) {
          quantidadeConsumir = quantidadeGramasMl;
        } else {
          // IA tentou conversão, mas estoque é em unidades → INCOMPATÍVEL
          ignoradosIncompativeis += 1;
          ignoradosDetalhes.push({
            nome: nomeReceita,
            motivo: 'incompativel',
            detalhes: `Receita em ${estoqueBase.unidadeBase}ml/g, mas estoque em ${estoqueBase.unidadeBase}`,
          });
          continue;
        }
      } else {
        // PRIORIDADE 2: quantidade_gramas_ml = 0 → unidades soltas
        const quantidadeReceita = Number(ingredienteReceita?.quantidade) || 0;
        const unidadeReceita = ingredienteReceita?.unidade || "un";
        const receitaBase = converterParaUnidadeBase(
          quantidadeReceita,
          unidadeReceita,
        );

        if (receitaBase.unidadeBase !== estoqueBase.unidadeBase) {
          ignoradosIncompativeis += 1;
          ignoradosDetalhes.push({
            nome: nomeReceita,
            motivo: 'incompativel',
            detalhes: `Receita em ${receitaBase.unidadeBase}, estoque em ${estoqueBase.unidadeBase}`,
          });
          continue;
        }

        quantidadeConsumir = receitaBase.valor;
      }

      const novoValorBase = Math.max(0, estoqueBase.valor - quantidadeConsumir);
      const novoValorUnidadeOriginal = formatarQuantidade(
        converterDaBaseParaUnidade(novoValorBase, itemDespensa.unit),
      );

      // Regra: se chegar a 0, desativa o item (selected: false)
      const novoStatusSelected =
        novoValorUnidadeOriginal > 0 ? itemDespensa.selected : false;

      const itemAtualizado = {
        ...itemDespensa,
        qty: novoValorUnidadeOriginal,
        unit: itemDespensa.unit,
        selected: novoStatusSelected,
      };

      estoqueAtualizado[indexDespensa] = itemAtualizado;
      alteracoes.push({
        id: itemDespensa.id,
        quantidade: novoValorUnidadeOriginal,
        unidade: itemDespensa.unit,
        selected: novoStatusSelected,
      });
    }

    if (alteracoes.length === 0) {
      return {
        sucesso: true,
        abatidos: 0,
        ignoradosIncompativeis,
        ignoradosNaoEncontrados,
        ignoradosBaixaConfianca,
        ignoradosLivres,
        ignoradosDetalhes,
      };
    }

    for (const item of alteracoes) {
      const { error } = await supabase
        .from("dispensa")
        .update({
          quantidade: item.quantidade,
          unidade: item.unidade,
          selected: item.selected,
        })
        .eq("id", item.id);

      if (error) {
        console.error("Erro ao abater ingredientes da despensa:", error);
        await buscarDespensa();
        return {
          sucesso: false,
          abatidos: 0,
          ignoradosIncompativeis,
          ignoradosNaoEncontrados,
          ignoradosBaixaConfianca,
          ignoradosLivres,
          ignoradosDetalhes,
          mensagem: "Falha ao atualizar a despensa no banco de dados.",
        };
      }
    }

    setIngredients(estoqueAtualizado);
    return {
      sucesso: true,
      abatidos: alteracoes.length,
      ignoradosIncompativeis,
      ignoradosNaoEncontrados,
      ignoradosBaixaConfianca,
      ignoradosLivres,
      ignoradosDetalhes,
    };
  };

  // Provider com todos os dados e funções para a despensa
  return (
    <DespensaContext.Provider
      value={{
        ingredients,
        filteredIngredients,
        searchText,
        setSearchText,
        addIngredient,
        toggleIngredient,
        removeIngredient,
        updateIngredientFull,
        upsertIngredientFromCompra,
        abaterIngredientesDaReceita,
        selectedCount,
        selectedIngredients,
        selectedIngredientIds,
        isLoading,
        buscarDespensa,
      }}
    >
      {children}
    </DespensaContext.Provider>
  );
}

export const useDespensa = () => useContext(DespensaContext);

// Hook para a tela de despensa, separando a lógica de UI da lógica de negócios e acesso a dados
export function useDespensaScreen(): DespensaScreenHookData {
  const {
    filteredIngredients,
    searchText,
    setSearchText,
    addIngredient,
    toggleIngredient,
    removeIngredient,
    updateIngredientFull,
    selectedCount,
    selectedIngredientIds,
    isLoading,
  } = useDespensa();

  const [nomeNovo, setNomeNovo] = useState("");
  const [qtdNova, setQtdNova] = useState("");
  const [metaNova, setMetaNova] = useState("");
  const [unidadeNova, setUnidadeNova] = useState("un");
  const [showUnitPickerNew, setShowUnitPickerNew] = useState(false);
  const [isAddingIngredient, setIsAddingIngredient] = useState(false);
  const [activeInput, setActiveInput] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<EditForm>({
    name: "",
    qty: "",
    ideal_qty: "",
    unit: "un",
  });
  const [showUnitPickerEdit, setShowUnitPickerEdit] = useState(false);

  // Função para adicionar um novo ingrediente com validação e formatação, usando a função do contexto
  const handleAdd = async () => {
    if (isAddingIngredient) return;

    if (!nomeNovo.trim() || qtdNova.trim() === "" || metaNova.trim() === "") {
      Alert.alert("Atenção", "Preencha o nome, a quantidade atual e a meta.");
      return;
    }

    const qty = validateQuantity(qtdNova);
    const ideal = validateQuantity(metaNova);

    if (qty === null || ideal === null) {
      Alert.alert("Erro", "Quantidade deve ser um número entre 0 e 99999.");
      return;
    }

    try {
      setIsAddingIngredient(true);
      await addIngredient(nomeNovo, qty, ideal, unidadeNova);
      setNomeNovo("");
      setQtdNova("");
      setMetaNova("");
      setShowUnitPickerNew(false);
    } catch {
      Alert.alert("Erro", "Falha ao adicionar ingrediente.");
    } finally {
      setIsAddingIngredient(false);
    }
  };

  // Função para iniciar a edição de um ingrediente usando a função do contexto
  const startEditing = (item: Ingredient) => {
    setEditingId(item.id);
    setShowUnitPickerEdit(false);
    setEditForm({
      name: item.name,
      qty: String(item.qty),
      ideal_qty: String(item.ideal_qty),
      unit: item.unit,
    });
  };

  // Função para salvar a edição de um ingrediente com validação e formatação, usando a função do contexto
  const saveEdit = (form?: EditForm) => {
    const finalForm = form || editForm;

    if (
      !finalForm.name.trim() ||
      finalForm.qty.trim() === "" ||
      finalForm.ideal_qty.trim() === ""
    ) {
      Alert.alert("Atenção", "Nenhum campo pode ficar vazio.");
      return;
    }

    const qty = validateQuantity(finalForm.qty);
    const ideal = validateQuantity(finalForm.ideal_qty);

    if (qty === null || ideal === null || !editingId) {
      Alert.alert("Erro", "Quantidade deve ser um número entre 0 e 99999.");
      return;
    }

    updateIngredientFull(editingId, finalForm.name, qty, ideal, finalForm.unit);
    setEditingId(null);
    setShowUnitPickerEdit(false);
  };

  // Função para exibir ajuda sobre a meta
  const showMetaHelp = () => {
    Alert.alert(
      "O que é a Meta?",
      "É a quantidade que você sempre quer ter na despensa (ex: 5kg de Arroz). Nossa IA usará isso para gerar sua Lista de Compras automaticamente quando o estoque baixar!",
    );
  };

  return {
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
    isAddingIngredient,
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
  };
}
