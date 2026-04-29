import React, {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import { Alert } from "react-native";
import { supabase } from "../services/supabase";
import { DispensaContextData, Ingredient } from "../types/dispensa";
import { normalizarTexto } from "../utils/normalization";
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