import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Alert } from "react-native";
import { supabase } from "../services/supabase";
import { useAuth } from "./useAuth";

const DispensaContext = createContext<any>({});

export function DispensaProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [ingredients, setIngredients] = useState<any[]>([]);
  const [searchText, setSearchText] = useState("");
  const [isLoading, setIsLoading] = useState(true);

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
          qty: item.quantidade, // mantemos como número para matemática
          ideal_qty: item.quantidade_ideal || item.quantidade, // fallback de segurança
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
        i.name.toLowerCase().includes(searchText.toLowerCase())
      ),
    [ingredients, searchText]
  );

  const addIngredient = async (name: string, qty: number, ideal_qty: number, unit: string) => {
    if (!user?.id) return;
    const novo = {
      user_id: user.id,
      nome_base: name,
      quantidade: qty,
      quantidade_ideal: ideal_qty,
      unidade: unit,
      selected: true,
    };

    const { data, error } = await supabase.from("dispensa").insert(novo).select().single();
    if (error) throw error;

    setIngredients((prev) => [
      { id: data.id, name: data.nome_base, qty: data.quantidade, ideal_qty: data.quantidade_ideal, unit: data.unidade, selected: data.selected },
      ...prev,
    ]);
  };

  const toggleIngredient = async (id: string) => {
    const item = ingredients.find((i) => i.id === id);
    if (!item) return;
    setIngredients((prev) => prev.map((i) => (i.id === id ? { ...i, selected: !i.selected } : i)));
    await supabase.from("dispensa").update({ selected: !item.selected }).eq("id", id);
  };

  const removeIngredient = async (id: string) => {
    const backup = [...ingredients];
    setIngredients((prev) => prev.filter((i) => i.id !== id));
    const { error } = await supabase.from("dispensa").delete().eq("id", id);
    if (error) setIngredients(backup);
  };

  // NOVA FUNÇÃO: Atualiza o card inteiro de uma vez
  const updateIngredientFull = async (id: string, name: string, qty: number, ideal_qty: number, unit: string) => {
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

  const selectedCount = useMemo(() => ingredients.filter((i) => i.selected).length, [ingredients]);

  return (
    <DispensaContext.Provider
      value={{
        ingredients, filteredIngredients, searchText, setSearchText,
        addIngredient, toggleIngredient, removeIngredient, updateIngredientFull,
        selectedCount, isLoading, buscarDispensa,
      }}
    >
      {children}
    </DispensaContext.Provider>
  );
}

export const useDispensa = () => {
  const context = useContext(DispensaContext);
  if (!context) {
    throw new Error("useDispensa must be used within a DispensaProvider");
  }
  return context;
};