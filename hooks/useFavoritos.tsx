import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
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
  const [carregandoFavoritos, setCarregandoFavoritos] = useState(true);

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
    try {
      const { data, error } = await supabase
        .from("receitas")
        .select("*")
        .eq("user_id", userId)
        .eq("eh_ia", true);

      if (error) throw error;

      // Mapeamento para o formato Recipe esperado, garantindo que todos os campos necessários estejam presentes
      const iaFormatadas = (data || []).map((item: any) => ({
        id: String(item.id),
        titulo: item.nome_receita || "",
        tempo: item.tempo_preparo || "",
        dificuldade: item.dificuldade || "",
        calorias: item.calorias || "",
        imagem: item.imagem_url || "",
        tipo: "ia",
        descricao: item.descricao_simples_preparo || "",
        dicaIA: item.dica_rapida || "",
        ingredientes: item.ingredientes || [],
        preparo: item.passos_detalhados || [],
      })) as unknown as Recipe[];

      setFavoritosIA(iaFormatadas);

      setFavoritosIA(iaFormatadas);
    } catch (error) {
      console.error("Erro ao carregar IA do banco:", error);
    }
  }

  const isFavorito = (id: string | number) => {
    const idStr = String(id);
    return (
      favoritosIds.includes(idStr) ||
      favoritosIA.some((item) => item.id === idStr)
    );
  };

  // Alterado receitaData para 'any' para evitar erros de tipagem ao inserir no banco
  const toggleFavorito = async (
    receitaId: string | number,
    receitaData?: any,
  ) => {
    if (!user?.id) return null;

    const idStr = String(receitaId);
    const jaFavoritado = isFavorito(receitaId);
    const isIA =
      receitaData?.tipo === "ia" ||
      favoritosIA.some((item) => item.id === idStr);

    try {
      if (jaFavoritado) {
        if (isIA) {
          await supabase.from("receitas").delete().eq("id", Number(idStr));
          setFavoritosIA((prev) => prev.filter((item) => item.id !== idStr));
        } else {
          await supabase
            .from("receitas_favoritas")
            .delete()
            .match({ user_id: user.id, receita_id: Number(receitaId) });
        }
        setFavoritosIds((prev) => prev.filter((id) => id !== idStr));
        return null; // Quando remove, não retorna ID
      } else {
        if (isIA && receitaData) {
          const { data: novaReceita, error: erroReceita } = await supabase
            .from("receitas")
            .insert([
              {
                nome_receita: receitaData.titulo,
                tempo_preparo: receitaData.tempo,
                dificuldade: receitaData.dificuldade,
                calorias: receitaData.calorias,
                descricao_simples_preparo: receitaData.descricao,
                dica_rapida: receitaData.dicaIA,
                ingredientes: receitaData.ingredientes,
                passos_detalhados: receitaData.preparo,
                imagem_url: receitaData.imagem,
                user_id: user.id,
                eh_ia: true,
              },
            ])
            .select("id")
            .single();

          if (erroReceita) throw erroReceita;

          const novoIdDb = novaReceita.id;
          await supabase
            .from("receitas_favoritas")
            .insert({ user_id: user.id, receita_id: novoIdDb });

          setFavoritosIds((prev) => [...prev, String(novoIdDb)]);
          setFavoritosIA((prev) => [
            ...prev,
            { ...receitaData, id: String(novoIdDb), tipo: "ia" },
          ]);

          return novoIdDb; // <--- A MÁGICA ESTÁ AQUI: Retornamos o novo ID!
        } else {
          await supabase
            .from("receitas_favoritas")
            .insert({ user_id: user.id, receita_id: Number(receitaId) });
          setFavoritosIds((prev) => [...prev, idStr]);
          return receitaId;
        }
      }
    } catch (error) {
      console.error("Erro no toggleFavorito:", error);
      return null;
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

export const useFavoritosGlobal = () => useContext(FavoritosContext);

export function useFavoritosLogic(searchText: string, filtro: string) {
  const { receitasBanco, filtrarPorCategoria, filtrarPorBusca } = useReceitas();
  const { isFavorito, favoritosIA } = useFavoritosGlobal();

  const receitasFiltradas = useMemo(() => {
    let lista = receitasBanco.filter((r) => isFavorito(r.id));
    lista = [...lista, ...favoritosIA];

    if (filtro === "IA") {
      lista = lista.filter((r) => r.tipo === "ia");
    } else {
      lista = filtrarPorCategoria(lista, filtro);
    }

    lista = filtrarPorBusca(lista, searchText);

    return lista;
  }, [receitasBanco, favoritosIA, isFavorito, filtro, searchText]);

  return { receitasFiltradas };
}
