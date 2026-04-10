import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "../services/supabase";
import { FavoritosContextData } from "../types/favoritos";
import { useAuth } from "./useAuth";
import { Recipe, useReceitas } from "./useReceitas";

const FavoritosContext = createContext<FavoritosContextData>({} as FavoritosContextData);

export function FavoritosProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [favoritosIds, setFavoritosIds] = useState<string[]>([]);
  const [favoritosIA, setFavoritosIA] = useState<Recipe[]>([]);
  const [carregandoFavoritos, setCarregandoFavoritos] = useState(true);

  const iaStorageKey = (userId: string) => `@favoritos_ia_${userId}`;

  useEffect(() => {
    if (user?.id) {
      buscarFavoritosBanco(user.id);
      carregarFavoritosIA(user.id);
    } else {
      setFavoritosIds([]);
      setFavoritosIA([]);
      setCarregandoFavoritos(false);
    }
  }, [user]);

  async function buscarFavoritosBanco(userId: string) {
    try {
      setCarregandoFavoritos(true);
      const { data, error } = await supabase
        .from("receitas_favoritas")
        .select("receita_id")
        .eq("user_id", userId);

      if (error) throw error;
      setFavoritosIds(data?.map((item) => String(item.receita_id)) || []);
    } catch (error) {
      console.error("Erro Favoritos Banco:", error);
    } finally {
      setCarregandoFavoritos(false);
    }
  }

  async function carregarFavoritosIA(userId: string) {
    const stored = await AsyncStorage.getItem(iaStorageKey(userId));
    setFavoritosIA(stored ? JSON.parse(stored) : []);
  }

  const isFavorito = (id: string | number) => {
    const idStr = String(id);
    return favoritosIds.includes(idStr) || favoritosIA.some((item) => item.id === idStr);
  };

  const toggleFavorito = async (receitaId: string | number, receitaData?: Recipe) => {
    if (!user?.id) return;

    const idStr = String(receitaId);
    const idNum = Number(idStr);
    const isIA = receitaData?.tipo === "ia" || isNaN(idNum);

    if (isIA) {
      const existe = favoritosIA.some((item) => item.id === idStr);
      let novaLista;
      if (existe) {
        novaLista = favoritosIA.filter((item) => item.id !== idStr);
      } else if (receitaData) {
        novaLista = [...favoritosIA, { ...receitaData, id: idStr, tipo: "ia" }];
      } else return;

      setFavoritosIA(novaLista);
      await AsyncStorage.setItem(iaStorageKey(user.id), JSON.stringify(novaLista));
    } else {
      const existeNoBanco = favoritosIds.includes(idStr);
      if (existeNoBanco) {
        setFavoritosIds((prev) => prev.filter((id) => id !== idStr));
        await supabase.from("receitas_favoritas").delete().match({ user_id: user.id, receita_id: idNum });
      } else {
        setFavoritosIds((prev) => [...prev, idStr]);
        await supabase.from("receitas_favoritas").insert({ user_id: user.id, receita_id: idNum });
      }
    }
  };

  return (
    <FavoritosContext.Provider value={{ favoritosIds, favoritosIA, isFavorito, toggleFavorito, carregandoFavoritos }}>
      {children}
    </FavoritosContext.Provider>
  );
}

// --- Hooks ---

/** Acesso básico ao Contexto */
export const useFavoritosGlobal = () => useContext(FavoritosContext);

/** Lógica Unificada de Filtro para a Screen de Favoritos (SEM ESTOQUE AQUI) */
export function useFavoritosLogic(searchText: string, filtro: string) {
  const { receitasBanco, filtrarPorCategoria, filtrarPorBusca } = useReceitas();
  const { isFavorito, favoritosIA } = useFavoritosGlobal();

  const receitasFiltradas = useMemo(() => {
    // 1. Unifica Receitas Fixas Favoritadas + IA Salvas
    let lista = receitasBanco.filter((r) => isFavorito(r.id));
    lista = [...lista, ...favoritosIA];

    // 2. Filtra por Categoria (Trata "IA" como categoria especial)
    if (filtro === "IA") {
      lista = lista.filter((r) => r.tipo === "ia");
    } else {
      lista = filtrarPorCategoria(lista, filtro);
    }

    // 3. Filtra por Busca Textual
    lista = filtrarPorBusca(lista, searchText);

    return lista;
  }, [receitasBanco, favoritosIA, isFavorito, filtro, searchText]);

  return { receitasFiltradas };
}