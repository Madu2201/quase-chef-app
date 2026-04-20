import React, {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
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

  // Busca inicial do banco
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
          qty: String(item.quantidade),
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

  // Filtro performático via Memo
  const filteredIngredients = useMemo(() => {
    const term = searchText.toLowerCase().trim();
    return term
      ? ingredients.filter((i) => i.name.toLowerCase().includes(term))
      : ingredients;
  }, [ingredients, searchText]);

  const addIngredient = async (nome: string, qtd: string, unidade: string) => {
    if (!user?.id) return;
    const { data, error } = await supabase
      .from("dispensa")
      .insert([
        {
          user_id: user.id,
          nome_base: nome.trim(),
          quantidade: Number(qtd.replace(",", ".")),
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
        qty: String(data.quantidade),
        unit: data.unidade,
        selected: data.selected,
      },
      ...prev,
    ]);
  };

  // Alterna seleção (Update Otimista)
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

  // Edição genérica (Qtd ou Unidade) com Rollback
  const editIngredient = async (
    id: string,
    field: EditField,
    value: string,
  ) => {
    const backup = [...ingredients];
    const isQty = field === "quantidade";

    setIngredients((prev) =>
      prev.map((i) =>
        i.id === id
          ? {
              ...i,
              qty: isQty ? value : i.qty,
              unit: !isQty ? value : i.unit,
            }
          : i,
      ),
    );

    const dbValue = isQty ? Number(value.replace(",", ".")) : value;
    const { error } = await supabase
      .from("dispensa")
      .update({ [isQty ? "quantidade" : "unidade"]: dbValue })
      .eq("id", id);

    if (error) setIngredients(backup);
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