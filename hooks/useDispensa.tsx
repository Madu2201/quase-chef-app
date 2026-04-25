import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Alert } from "react-native";
import { supabase } from "../services/supabase";
import { DispensaContextData, EditField, Ingredient } from "../types/dispensa";
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
          ideal_qty: Number(item.quantidade_ideal || 0), 
          unit: item.unidade,
          selected: item.selected,
        })) || [],
      );
    } catch (e) {
      console.error("Erro ao carregar dispensa:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    user?.id ? buscarDispensa() : setIngredients([]);
  }, [user?.id]);

  const filteredIngredients = useMemo(() => {
    const term = searchText.toLowerCase().trim();
    return term
      ? ingredients.filter((i) => i.name.toLowerCase().includes(term))
      : ingredients;
  }, [ingredients, searchText]);

  // Adiciona ingrediente com Meta definida
  const addIngredient = async (nome: string, qtd: number, ideal_qtd: number, unidade: string) => {
    if (!user?.id) return;
    const { data, error } = await supabase
      .from("dispensa")
      .insert([
        {
          user_id: user.id,
          nome_base: nome.trim(),
          quantidade: qtd,
          quantidade_ideal: ideal_qtd,
          unidade,
          selected: true,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    
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
  };

  const toggleIngredient = async (id: string) => {
    const backup = [...ingredients];
    const item = ingredients.find((i) => i.id === id);
    if (!item) return;

    setIngredients((prev) =>
      prev.map((i) => (i.id === id ? { ...i, selected: !i.selected } : i)),
    );
    const { error } = await supabase
      .from("dispensa")
      .update({ selected: !item.selected })
      .eq("id", id);
    if (error) setIngredients(backup);
  };

  const removeIngredient = async (id: string) => {
    const backup = [...ingredients];
    setIngredients((prev) => prev.filter((i) => i.id !== id));
    const { error } = await supabase.from("dispensa").delete().eq("id", id);
    if (error) setIngredients(backup);
  };

  // Edição genérica (Qtd, Meta ou Unidade)
  const editIngredient = async (
    id: string,
    field: EditField,
    value: any,
  ) => {
    const backup = [...ingredients];
    
    // Mapeamento campos da interface -> colunas do banco
    const fieldMap: Record<EditField, string> = {
        quantidade: "quantidade",
        quantidade_ideal: "quantidade_ideal",
        unidade: "unidade"
    };

    // Update Otimista no Estado
    setIngredients((prev) =>
      prev.map((i) => {
        if (i.id !== id) return i;
        if (field === "quantidade") return { ...i, qty: Number(value) };
        if (field === "quantidade_ideal") return { ...i, ideal_qty: Number(value) };
        if (field === "unidade") return { ...i, unit: value };
        return i;
      }),
    );

    // Tratamento do valor para o Supabase
    const dbValue = (field === "quantidade" || field === "quantidade_ideal") 
        ? Number(String(value).replace(",", ".")) 
        : value;

    const { error } = await supabase
      .from("dispensa")
      .update({ [fieldMap[field]]: dbValue })
      .eq("id", id);

    if (error) setIngredients(backup);
  };

  // NOVA FUNÇÃO: Atualiza o card inteiro de uma vez
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
        editIngredient,
        updateIngredientFull,
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