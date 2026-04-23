import React, {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import { supabase, uploadImagemReceitaIA } from "../services/supabase";
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
        title: item.nome_receita || "",
        time: item.tempo_preparo || "",
        difficulty: item.dificuldade || "",
        calories: item.calorias || "",
        image: item.imagem_url || "",
        tipo: "ia",
        descStart: item.descricao_simples_preparo || "",
        dicaIA: item.dica_rapida || "",
        rawIngredients: JSON.stringify(item.ingredientes || []),
        rawSteps: JSON.stringify(item.passos_detalhados || []),
        ingredients: "", // Campo legado ou para exibição rápida
        descEnd: "",
        tags: item.tags || ["IA"],
      })) as unknown as Recipe[];

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
          // Se for IA, removemos da tabela 'receitas' (já que é exclusiva do usuário)
          // O cascade cuidará da 'receitas_favoritas' se houver relação, 
          // mas por segurança removemos ambos ou dependemos da estrutura.
          // De acordo com o schema, deletar a receita deleta o favorito (on delete CASCADE).
          await supabase.from("receitas").delete().eq("id", Number(idStr));
          setFavoritosIA((prev) => prev.filter((item) => item.id !== idStr));
        } else {
          await supabase
            .from("receitas_favoritas")
            .delete()
            .match({ user_id: user.id, receita_id: Number(receitaId) });
        }
        setFavoritosIds((prev) => prev.filter((id) => id !== idStr));
        return null;
      } else {
        if (isIA && receitaData) {
          // Para receitas de IA, primeiro salvamos na tabela 'receitas'
          
          let finalImageUrl = receitaData.image;

          // Se a imagem for base64 (gerada pela IA mas ainda não salva no bucket)
          if (receitaData.image && (receitaData.image.startsWith('data:image') || receitaData.image.startsWith('blob:'))) {
            const fileName = `receita-${user.id}-${Date.now()}`;
            const uploadedUrl = await uploadImagemReceitaIA(receitaData.image, fileName);
            if (uploadedUrl) {
              finalImageUrl = uploadedUrl;
            }
          }

          const { data: novaReceita, error: erroReceita } = await supabase
            .from("receitas")
            .insert([
              {
                nome_receita: receitaData.title,
                tempo_preparo: receitaData.time,
                dificuldade: receitaData.difficulty,
                calorias: receitaData.calories,
                descricao_simples_preparo: receitaData.descStart,
                dica_rapida: receitaData.dicaIA,
                ingredientes: typeof receitaData.rawIngredients === 'string' 
                  ? JSON.parse(receitaData.rawIngredients) 
                  : receitaData.rawIngredients,
                passos_detalhados: typeof receitaData.rawSteps === 'string'
                  ? JSON.parse(receitaData.rawSteps)
                  : receitaData.rawSteps,
                imagem_url: finalImageUrl,
                user_id: user.id,
                eh_ia: true,
                tags: receitaData.tags || ["IA"],
              },
            ])
            .select("id")
            .single();

          if (erroReceita) throw erroReceita;

          const novoIdDb = novaReceita.id;
          
          // Agora atrelamos ao usuário na tabela de favoritos
          await supabase
            .from("receitas_favoritas")
            .insert({ user_id: user.id, receita_id: novoIdDb });

          setFavoritosIds((prev) => [...prev, String(novoIdDb)]);
          setFavoritosIA((prev) => [
            ...prev,
            { ...receitaData, id: String(novoIdDb), tipo: "ia", image: finalImageUrl },
          ]);

          return novoIdDb;
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
    // 1. Pegamos as receitas do banco que estão favoritadas
    let lista = receitasBanco.filter((r) => isFavorito(r.id));
    
    // 2. Adicionamos as receitas de IA (evitando duplicatas se já estiverem no receitasBanco)
    favoritosIA.forEach(ia => {
      if (!lista.some(r => String(r.id) === String(ia.id))) {
        lista.push(ia);
      }
    });

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
