import React, {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import {
    adicionarFavorito,
    removerFavorito,
    salvarReceitaIAParaFavorito,
} from "../services/receitaService";
import { supabase } from "../services/supabase";
import { FavoritosContextData } from "../types/favoritos";
import { useAuth } from "./useAuth";
import { Recipe, useReceitas } from "./useReceitas";

const FavoritosContext = createContext<FavoritosContextData>(
  {} as FavoritosContextData,
);

export function FavoritosProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [favoritosIds, setFavoritosIds] = useState<string[]>([]);
  const [favoritosIA, setFavoritosIA] = useState<Recipe[]>([]);
  const [savedIAReceitaMap, setSavedIAReceitaMap] = useState<
    Record<string, string>
  >({});
  const [carregandoFavoritos, setCarregandoFavoritos] = useState(true);

  useEffect(() => {
    if (user?.id) {
      buscarFavoritosBanco(user.id);
    } else {
      setFavoritosIds([]);
      setFavoritosIA([]);
      setSavedIAReceitaMap({});
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

  const isFavorito = (id: string | number) => {
    const idStr = String(id);
    return (
      favoritosIds.includes(idStr) ||
      favoritosIA.some((item) => item.id === idStr)
    );
  };

  const toggleFavorito = async (
    receitaId: string | number,
    receitaData?: Recipe,
  ) => {
    if (!user?.id) return;

    const idStr = String(receitaId);
    const idNum = Number(idStr);
    const isIA = receitaData?.tipo === "ia" || isNaN(idNum);
    const mappedSavedId = savedIAReceitaMap[idStr];
    const mappedSavedIdNum = mappedSavedId ? Number(mappedSavedId) : NaN;

    const existeLocalIA = favoritosIA.some((item) => item.id === idStr);
    const existePersistido = !isNaN(idNum) && favoritosIds.includes(idStr);
    const existePersistidoPeloMap =
      !isNaN(mappedSavedIdNum) &&
      favoritosIds.includes(String(mappedSavedIdNum));

    if (isIA) {
      if (existeLocalIA || existePersistido || existePersistidoPeloMap) {
        if (!isNaN(idNum)) {
          const success = await removerFavorito(idNum, user.id);
          if (success) {
            setFavoritosIds((prev) => prev.filter((id) => id !== idStr));
          }
        } else if (!isNaN(mappedSavedIdNum)) {
          const success = await removerFavorito(mappedSavedIdNum, user.id);
          if (success) {
            setFavoritosIds((prev) =>
              prev.filter((id) => id !== String(mappedSavedIdNum)),
            );
          }
        }

        setFavoritosIA((prev) => prev.filter((item) => item.id !== idStr));
        setSavedIAReceitaMap((prev) => {
          const next = { ...prev };
          delete next[idStr];
          return next;
        });
      } else if (receitaData) {
        if (isNaN(idNum)) {
          const savedId = await salvarReceitaIAParaFavorito(user.id, {
            title: receitaData.title,
            time: receitaData.time,
            difficulty: receitaData.difficulty,
            description: receitaData.descStart,
            image: receitaData.image,
            calories: receitaData.calories,
            rawIngredients: receitaData.rawIngredients,
            rawSteps: receitaData.rawSteps,
            tags: receitaData.tags,
          });

          if (!savedId) return;

          setFavoritosIds((prev) => [...prev, String(savedId)]);
          setFavoritosIA((prev) => [
            ...prev,
            {
              ...receitaData,
              id: idStr,
              tipo: "ia",
            },
          ]);
          setSavedIAReceitaMap((prev) => ({
            ...prev,
            [idStr]: String(savedId),
          }));
        } else {
          const success = await adicionarFavorito(idNum, user.id);
          if (success) {
            setFavoritosIds((prev) => [...prev, idStr]);
          }
        }
      }

      return;
    }

    const existeNoBanco = favoritosIds.includes(idStr);

    if (existeNoBanco) {
      setFavoritosIds((prev) => prev.filter((id) => id !== idStr));
      await removerFavorito(idNum, user.id);
    } else {
      setFavoritosIds((prev) => [...prev, idStr]);
      await adicionarFavorito(idNum, user.id);
    }
  };

  return (
    <FavoritosContext.Provider
      value={{
        favoritosIds,
        favoritosIA,
        isFavorito,
        toggleFavorito,
        carregandoFavoritos,
      }}
    >
      {children}
    </FavoritosContext.Provider>
  );
}

// --- Hooks ---

/** Acesso básico ao Contexto */
export const useFavoritosGlobal = () => useContext(FavoritosContext);

/** Lógica Unificada de Filtro para a Screen de Favoritos (SEM ESTOQUE AQUI) */
export function useFavoritosLogic(searchText: string, filtro: string) {
  const { receitasBanco, filtrarPorCategoria, filtrarPorBusca, filtrarPorPerfil } = useReceitas();
  const { isFavorito, favoritosIA } = useFavoritosGlobal();
  const { user } = useAuth();

  const receitasFiltradas = useMemo(() => {
    // 1. Unifica Receitas Fixas Favoritadas + IA Salvas
    let lista = receitasBanco.filter((r) => isFavorito(r.id));
    lista = filtrarPorPerfil(
      lista,
      user?.food_preferences,
      user?.allergies,
      user?.temporaryMode,
    );
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
  }, [receitasBanco, favoritosIA, isFavorito, filtro, searchText, filtrarPorCategoria, filtrarPorBusca, filtrarPorPerfil, user?.food_preferences, user?.allergies, user?.temporaryMode]);

  return { receitasFiltradas };
}
