import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { supabase } from "../services/supabase";
import { useAuth } from "./useAuth";
import type { Recipe } from "./useReceitas";

interface FavoritosContextData {
  favoritosIds: string[];
  favoritosIA: Recipe[];
  isFavorito: (id: string | number) => boolean;
  toggleFavorito: (id: string | number, receitaData?: Recipe) => Promise<void>;
  carregandoFavoritos: boolean;
}

const FavoritosContext = createContext<FavoritosContextData>(
  {} as FavoritosContextData,
);

export function FavoritosProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth(); // Aqui está a mágica! Se logar, aparece aqui. Se sair, fica vazio.
  const [favoritosIds, setFavoritosIds] = useState<string[]>([]);
  const [favoritosIA, setFavoritosIA] = useState<Recipe[]>([]);
  const [carregandoFavoritos, setCarregandoFavoritos] = useState(true);

  // Reage sempre que o usuário logado mudar
  useEffect(() => {
    if (user && user.id) {
      buscarFavoritos(user.id);
      carregarFavoritosIA(user.id);
    } else {
      setFavoritosIds([]);
      setFavoritosIA([]);
      setCarregandoFavoritos(false);
    }
  }, [user]);

  const iaStorageKey = (userId: string) => `@favoritos_ia_${userId}`;

  async function carregarFavoritosIA(userId: string) {
    try {
      const stored = await AsyncStorage.getItem(iaStorageKey(userId));
      if (stored) {
        setFavoritosIA(JSON.parse(stored));
      } else {
        setFavoritosIA([]);
      }
    } catch (error) {
      console.error("Erro ao carregar favoritos IA:", error);
      setFavoritosIA([]);
    }
  }

  async function salvarFavoritosIA(items: Recipe[]) {
    if (!user || !user.id) return;
    try {
      await AsyncStorage.setItem(iaStorageKey(user.id), JSON.stringify(items));
    } catch (error) {
      console.error("Erro ao salvar favoritos IA:", error);
    }
  }

  async function buscarFavoritos(userId: string) {
    try {
      setCarregandoFavoritos(true);
      const { data, error } = await supabase
        .from("receitas_favoritas")
        .select("receita_id")
        .eq("user_id", userId);

      if (error) throw error;

      if (data) {
        setFavoritosIds(data.map((item) => String(item.receita_id)));
      } else {
        setFavoritosIds([]);
      }
    } catch (error) {
      console.error("Erro ao buscar favoritos:", error);
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
    // Se não tiver ninguém logado, barra a ação!
    if (!user || !user.id) {
      console.log("Nenhum usuário logado. Não é possível favoritar.");
      return;
    }

    const idStr = String(receitaId);
    const jaEhFavoritoIA = favoritosIA.some((item) => item.id === idStr);
    const jaEhFavoritoDB = favoritosIds.includes(idStr);
    const idNum = Number(idStr);
    const isNumericId = idStr.trim() !== "" && !Number.isNaN(idNum);

    if (jaEhFavoritoIA) {
      const next = favoritosIA.filter((item) => item.id !== idStr);
      setFavoritosIA(next);
      await salvarFavoritosIA(next);
      return;
    }

    if (jaEhFavoritoDB && isNumericId) {
      setFavoritosIds((prev) => prev.filter((id) => id !== idStr));
      await supabase
        .from("receitas_favoritas")
        .delete()
        .match({ user_id: user.id, receita_id: idNum });
      return;
    }

    if (!jaEhFavoritoDB && isNumericId) {
      setFavoritosIds((prev) => [...prev, idStr]);
      await supabase
        .from("receitas_favoritas")
        .insert({ user_id: user.id, receita_id: idNum });
      return;
    }

    if (receitaData) {
      const novoFavoritoIA = {
        ...receitaData,
        id: idStr,
        tipo: "ia",
        tags: Array.from(new Set([...(receitaData.tags ?? []), "IA"])),
      };
      const next = [
        ...favoritosIA.filter((item) => item.id !== idStr),
        novoFavoritoIA,
      ];
      setFavoritosIA(next);
      await salvarFavoritosIA(next);
      return;
    }

    console.log("Não foi possível favoritar a receita IA sem dados completos.");
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

export function useFavoritosGlobal() {
  return useContext(FavoritosContext);
}
