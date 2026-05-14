import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { solicitarAtualizacaoCatalogoReceitas } from "../services/receitaEvents";
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
  const iaFavoritoSalvandoRef = useRef<Set<string>>(new Set());
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
        // Se a receita for IA e estiver sendo desfavoritada, 
        // excluímos ela fisicamente do banco de dados para evitar lixo.
        const idParaExcluir = !isNaN(idNum) ? idNum : mappedSavedIdNum;

        if (!isNaN(idParaExcluir)) {
          // 1. Remove da tabela de favoritos (removerFavorito já faz isso no banco)
          const successRemover = await removerFavorito(idParaExcluir, user.id);
          
          if (successRemover) {
            // 2. Exclui a receita física da tabela 'receitas'
            // Somente se for uma receita gerada por IA e pertencer ao usuário
            const { error: deleteError } = await supabase
              .from("receitas")
              .delete()
              .match({ id: idParaExcluir, eh_ia: true, user_id: user.id });

            if (deleteError) {
              console.error("Erro ao excluir receita física da IA:", deleteError.message);
            }

            setFavoritosIds((prev) => prev.filter((id) => id !== String(idParaExcluir)));
            
            // Forçamos a atualização do catálogo global para que a receita suma da lista useReceitas
            solicitarAtualizacaoCatalogoReceitas();
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
          if (iaFavoritoSalvandoRef.current.has(idStr)) return;
          iaFavoritoSalvandoRef.current.add(idStr);
          try {
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
              dica_rapida: receitaData.dica_rapida,
              pre_visualizacao_passos: receitaData.pre_visualizacao,
              preferencias: receitaData.preferences,
              alergias_presentes: receitaData.recipeAllergies,
            });

            if (!savedId) return;

            setFavoritosIds((prev) =>
              prev.includes(String(savedId)) ? prev : [...prev, String(savedId)],
            );
            setFavoritosIA((prev) =>
              prev.some((item) => item.id === idStr)
                ? prev
                : [
                    ...prev,
                    {
                      ...receitaData,
                      id: idStr,
                      tipo: "ia",
                    },
                  ],
            );
            setSavedIAReceitaMap((prev) => ({
              ...prev,
              [idStr]: String(savedId),
            }));
          } finally {
            iaFavoritoSalvandoRef.current.delete(idStr);
          }
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
      solicitarAtualizacaoCatalogoReceitas();
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
        savedIAReceitaMap,
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
  const { isFavorito, favoritosIA, savedIAReceitaMap } = useFavoritosGlobal();
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
    const idsJaNaLista = new Set(lista.map((r) => String(r.id)));
    const iaSemDuplicarPersistidos = favoritosIA.filter((ia) => {
      const idPersistido = savedIAReceitaMap[ia.id];
      if (idPersistido && idsJaNaLista.has(String(idPersistido))) {
        return false;
      }
      return true;
    });
    lista = [...lista, ...iaSemDuplicarPersistidos];

    // 2. Filtra por Categoria (Trata "IA" como categoria especial)
    if (filtro === "IA") {
      lista = lista.filter((r) => r.tipo === "ia");
    } else {
      lista = filtrarPorCategoria(lista, filtro);
    }

    // 3. Filtra por Busca Textual
    lista = filtrarPorBusca(lista, searchText);

    return lista;
  }, [receitasBanco, favoritosIA, savedIAReceitaMap, isFavorito, filtro, searchText, filtrarPorCategoria, filtrarPorBusca, filtrarPorPerfil, user?.food_preferences, user?.allergies, user?.temporaryMode]);

  return { receitasFiltradas };
}
