import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, ReactNode, useContext, useEffect, useState, useMemo } from "react";
import { supabase } from "../services/supabase";
import { useAuth } from "./useAuth";
import { useReceitas, Recipe } from "./useReceitas";
import { useDispensa } from "./useDispensa";
import { FavoritosContextData } from "../types/favoritos";

const FavoritosContext = createContext<FavoritosContextData>({} as FavoritosContextData);

export function FavoritosProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [favoritosIds, setFavoritosIds] = useState<string[]>([]);
  const [favoritosIA, setFavoritosIA] = useState<Recipe[]>([]);
  const [carregandoFavoritos, setCarregandoFavoritos] = useState(true);

  const iaStorageKey = (userId: string) => `@favoritos_ia_${userId}`;

  // Sincroniza dados sempre que o usuário logar/deslogar
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

  /** Busca IDs das receitas do Supabase */
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

  /** Carrega receitas de IA salvas no AsyncStorage */
  async function carregarFavoritosIA(userId: string) {
    const stored = await AsyncStorage.getItem(iaStorageKey(userId));
    setFavoritosIA(stored ? JSON.parse(stored) : []);
  }

  /** Verifica se o ID existe em qualquer uma das listas */
  const isFavorito = (id: string | number) => {
    const idStr = String(id);
    return favoritosIds.includes(idStr) || favoritosIA.some((item) => item.id === idStr);
  };

  /** Lógica de Toggle: Decide se salva no Supabase ou Local (IA) */
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

/** Lógica Unificada de Filtro para a Screen de Favoritos */
export function useFavoritosLogic(searchText: string, filtro: string, useEstoque: boolean) {
  const { receitasBanco, filtrarPorCategoria, filtrarPorBusca, filtrarPorEstoque } = useReceitas();
  const { isFavorito, favoritosIA } = useFavoritosGlobal();
  const { ingredients: dispensa } = useDispensa();

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

    // 4. Filtra por Disponibilidade no Estoque
    if (useEstoque) {
      lista = lista.filter((r) => {
        if (r.tipo === "ia") return true; // Receitas IA já são otimizadas
        return filtrarPorEstoque([r], dispensa).length > 0;
      });
    }

    return lista;
  }, [receitasBanco, favoritosIA, isFavorito, filtro, searchText, useEstoque, dispensa]);

  return { receitasFiltradas };
}