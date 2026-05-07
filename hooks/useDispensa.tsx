import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Alert } from "react-native";
import { INGREDIENTES_LIVRES } from "../constants/ingredients";
import { supabase } from "../services/supabase";
import { AbatimentoResultado, DispensaContextData, Ingredient } from "../types/dispensa";
import {
  converterDaBaseParaUnidade,
  converterParaUnidadeBase,
  nomesIngredientesCompativeis,
  normalizarTexto,
} from "../utils/normalization";
import { calcularUpsertDecision } from "../utils/upsertUtils";
import { useAuth } from "./useAuth";

const DispensaContext = createContext<DispensaContextData>(
  {} as DispensaContextData,
);

export function DispensaProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [searchText, setSearchText] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Busca inicial do banco (Agora com quantidade_ideal)
  const buscarDispensa = async () => {
    if (!user?.id) return;
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
        })) || []
      );
    } catch (error) {
      console.error("Erro ao buscar dispensa:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    buscarDispensa();
  }, [user]);

  const filteredIngredients = useMemo(
    () =>
      ingredients.filter((i) =>
        i.name.toLowerCase().includes(searchText.toLowerCase()),
      ),
    [ingredients, searchText],
  );

  const addIngredient = async (
    nome: string,
    qtd: number,
    ideal_qtd: number,
    unidade: string,
  ) => {
    if (!user?.id) return;

    const { data, error } = await supabase
      .from("dispensa")
      .insert([
        {
          user_id: user.id,
          nome_base: nome,
          quantidade: qtd,
          quantidade_ideal: ideal_qtd, // Novo campo
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

  const toggleIngredient = async (id: string) => {
    const item = ingredients.find((i) => i.id === id);
    if (!item) return;

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

  const removeIngredient = async (id: string) => {
    const backup = [...ingredients];
    setIngredients((prev) => prev.filter((i) => i.id !== id));
    const { error } = await supabase.from("dispensa").delete().eq("id", id);
    if (error) setIngredients(backup);
  };

  // Atualiza o card inteiro de uma vez
  const updateIngredientFull = async (
    id: string,
    name: string,
    qty: number,
    ideal_qty: number,
    unit: string
  ) => {
    const backup = [...ingredients];
    setIngredients((prev) =>
      prev.map((i) => (i.id === id ? { ...i, name, qty, ideal_qty, unit } : i))
    );

    const { error } = await supabase
      .from("dispensa")
      .update({ nome_base: name, quantidade: qty, quantidade_ideal: ideal_qty, unidade: unit })
      .eq("id", id);

    if (error) {
      setIngredients(backup);
      Alert.alert("Erro", "Falha ao salvar as edições do ingrediente.");
    }
  };

  // NOVA FUNÇÃO (FASE 2): Integração do Upsert para Listas de Compras
  const upsertIngredientFromCompra = async (nome: string, qtyComprada: number, unidadeComprada: string): Promise<boolean> => {
    if (!user?.id) return false;

    const nomeNorm = normalizarTexto(nome);
    const existente = ingredients.find((ing) => normalizarTexto(ing.name) === nomeNorm);

    // Mock para usar a nossa função pura
    const itemCompradoMock = {
      nome,
      quantidade_comprar: qtyComprada,
      unidade: unidadeComprada,
    } as any;

    const decision = calcularUpsertDecision(itemCompradoMock, existente);

    if (decision.acao === 'INSERT') {
      const { data, error } = await supabase
        .from("dispensa")
        .insert([{
          user_id: user.id,
          nome_base: nome,
          quantidade: decision.novoValor,
          quantidade_ideal: decision.novoValor, // A primeira compra vira a meta
          unidade: decision.unidadeFinal,
          selected: false
        }])
        .select()
        .single();

      if (error) {
        console.error("Erro ao inserir novo item no estoque:", error);
        return false;
      }

      if (data) {
        setIngredients((prev) => [{
          id: data.id,
          name: data.nome_base,
          qty: Number(data.quantidade),
          ideal_qty: Number(data.quantidade_ideal || data.quantidade),
          unit: data.unidade,
          selected: data.selected
        }, ...prev]);
      }
      return true;
    } else {
      if (!existente) return false;
      
      const { error } = await supabase
        .from("dispensa")
        .update({ quantidade: decision.novoValor, unidade: decision.unidadeFinal })
        .eq("id", existente.id);

      if (error) {
        console.error("Erro ao atualizar estoque:", error);
        return false;
      }

      setIngredients((prev) =>
        prev.map((i) =>
          i.id === existente.id
            ? { ...i, qty: decision.novoValor, unit: decision.unidadeFinal }
            : i
        )
      );
      return true;
    }
  };

  const selectedCount = useMemo(
    () => ingredients.filter((i) => i.selected).length,
    [ingredients],
  );

  const abaterIngredientesDaReceita = async (
    rawIngredients: string
  ): Promise<AbatimentoResultado> => {
    if (!user?.id || !rawIngredients) {
      return {
        sucesso: false,
        abatidos: 0,
        ignoradosIncompativeis: 0,
        ignoradosNaoEncontrados: 0,
        ignoradosBaixaConfianca: 0,
        ignoradosLivres: 0,
        mensagem: "Usuário não autenticado ou ingredientes inválidos.",
      };
    }

    let ingredientesReceita: any[] = [];
    try {
      ingredientesReceita = JSON.parse(rawIngredients);
    } catch (error) {
      console.error("Erro ao parsear ingredientes da receita para abatimento:", error);
      return {
        sucesso: false,
        abatidos: 0,
        ignoradosIncompativeis: 0,
        ignoradosNaoEncontrados: 0,
        ignoradosBaixaConfianca: 0,
        ignoradosLivres: 0,
        mensagem: "Não foi possível interpretar os ingredientes da receita.",
      };
    }

    if (!Array.isArray(ingredientesReceita) || ingredientesReceita.length === 0) {
      return {
        sucesso: true,
        abatidos: 0,
        ignoradosIncompativeis: 0,
        ignoradosNaoEncontrados: 0,
        ignoradosBaixaConfianca: 0,
        ignoradosLivres: 0,
      };
    }

    const estoqueAtualizado = [...ingredients];
    const alteracoes: Array<{ id: string; quantidade: number; unidade: string }> = [];
    let ignoradosIncompativeis = 0;
    let ignoradosNaoEncontrados = 0;
    let ignoradosBaixaConfianca = 0;
    let ignoradosLivres = 0;

    for (const ingredienteReceita of ingredientesReceita) {
      const nomeReceita = ingredienteReceita?.nome_base || ingredienteReceita?.texto_original || "";
      if (!nomeReceita) continue;

      const ehLivre = INGREDIENTES_LIVRES.some((livre) =>
        nomesIngredientesCompativeis(nomeReceita, livre),
      );
      if (ehLivre) {
        ignoradosLivres += 1;
        continue;
      }

      const nomeReceitaNormalizado = normalizarTexto(nomeReceita);
      const indexDispensaExato = estoqueAtualizado.findIndex(
        (item) => normalizarTexto(item.name) === nomeReceitaNormalizado,
      );
      const indexDispensaCompativel =
        indexDispensaExato >= 0
          ? indexDispensaExato
          : estoqueAtualizado.findIndex((item) =>
              nomesIngredientesCompativeis(nomeReceita, item.name),
            );

      const indexDispensa = indexDispensaCompativel;
      if (indexDispensa < 0) {
        ignoradosNaoEncontrados += 1;
        continue;
      }

      const itemDispensa = estoqueAtualizado[indexDispensa];
      const estoqueBase = converterParaUnidadeBase(itemDispensa.qty, itemDispensa.unit);

      let quantidadeConsumir = 0;

      const quantidadeGramasMl = Number(ingredienteReceita?.quantidade_gramas_ml) || 0;
      const baixaConfianca = Boolean(ingredienteReceita?.baixa_confianca);
      if (baixaConfianca && quantidadeGramasMl > 0) {
        ignoradosBaixaConfianca += 1;
        continue;
      }

      if (quantidadeGramasMl > 0 && ["g", "ml"].includes(estoqueBase.unidadeBase)) {
        quantidadeConsumir = quantidadeGramasMl;
      } else {
        const quantidadeReceita = Number(ingredienteReceita?.quantidade) || 0;
        const unidadeReceita = ingredienteReceita?.unidade || "un";
        const receitaBase = converterParaUnidadeBase(quantidadeReceita, unidadeReceita);

        if (receitaBase.unidadeBase !== estoqueBase.unidadeBase) {
          ignoradosIncompativeis += 1;
          continue;
        }

        quantidadeConsumir = receitaBase.valor;
      }

      const novoValorBase = Math.max(0, estoqueBase.valor - quantidadeConsumir);
      const novoValorUnidadeOriginal = Number(
        converterDaBaseParaUnidade(novoValorBase, itemDispensa.unit).toFixed(3)
      );
      
      // Regra: se chegar a 0, desativa o item (selected: false)
      const novoStatusSelected = novoValorUnidadeOriginal > 0 ? itemDispensa.selected : false;

      const itemAtualizado = {
        ...itemDispensa,
        qty: novoValorUnidadeOriginal,
        unit: itemDispensa.unit,
        selected: novoStatusSelected,
      };

      estoqueAtualizado[indexDispensa] = itemAtualizado;
      alteracoes.push({
        id: itemDispensa.id,
        quantidade: novoValorUnidadeOriginal,
        unidade: itemDispensa.unit,
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
      };
    }

    for (const item of alteracoes) {
      const { error } = await supabase
        .from("dispensa")
        .update({ 
          quantidade: item.quantidade, 
          unidade: item.unidade,
          selected: item.selected 
        })
        .eq("id", item.id);

      if (error) {
        console.error("Erro ao abater ingredientes da despensa:", error);
        await buscarDispensa();
        return {
          sucesso: false,
          abatidos: 0,
          ignoradosIncompativeis,
          ignoradosNaoEncontrados,
          ignoradosBaixaConfianca,
          ignoradosLivres,
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
    };
  };

  return (
    <DispensaContext.Provider
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
        isLoading,
        buscarDispensa,
      }}
    >
      {children}
    </DispensaContext.Provider>
  );
}

export const useDispensa = () => useContext(DispensaContext);