import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { supabase } from '../services/supabase';
import { useAuth } from './useAuth'; // <-- Puxando o usuário REAL!

interface FavoritosContextData {
  favoritosIds: number[];
  isFavorito: (id: string | number) => boolean;
  toggleFavorito: (id: string | number) => Promise<void>;
  carregandoFavoritos: boolean;
}

const FavoritosContext = createContext<FavoritosContextData>({} as FavoritosContextData);

export function FavoritosProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth(); // Aqui está a mágica! Se logar, aparece aqui. Se sair, fica vazio.
  const [favoritosIds, setFavoritosIds] = useState<number[]>([]);
  const [carregandoFavoritos, setCarregandoFavoritos] = useState(true);

  // Reage sempre que o usuário logado mudar
  useEffect(() => {
    if (user && user.id) {
      buscarFavoritos(user.id);
    } else {
      setFavoritosIds([]); // Limpa a tela se deslogar
      setCarregandoFavoritos(false);
    }
  }, [user]);

  async function buscarFavoritos(userId: string) {
    try {
      setCarregandoFavoritos(true);
      const { data, error } = await supabase
        .from('receitas_favoritas')
        .select('receita_id')
        .eq('user_id', userId);

      if (error) throw error;

      if (data) {
        setFavoritosIds(data.map(item => item.receita_id));
      }
    } catch (error) {
      console.error("Erro ao buscar favoritos:", error);
    } finally {
      setCarregandoFavoritos(false);
    }
  }

  const isFavorito = (id: string | number) => {
    return favoritosIds.includes(Number(id));
  };

  const toggleFavorito = async (receitaId: string | number) => {
    // Se não tiver ninguém logado, barra a ação!
    if (!user || !user.id) {
      console.log("Nenhum usuário logado. Não é possível favoritar.");
      return;
    }

    const idNum = Number(receitaId);
    const jaEhFavorito = isFavorito(idNum);

    // 1. Atualização super rápida na tela
    if (jaEhFavorito) {
      setFavoritosIds(prev => prev.filter(id => id !== idNum));
    } else {
      setFavoritosIds(prev => [...prev, idNum]);
    }

    // 2. Salva no banco de dados na conta exata do usuário
    if (jaEhFavorito) {
      await supabase
        .from('receitas_favoritas')
        .delete()
        .match({ user_id: user.id, receita_id: idNum });
    } else {
      await supabase
        .from('receitas_favoritas')
        .insert({ user_id: user.id, receita_id: idNum });
    }
  };

  return (
    <FavoritosContext.Provider value={{
      favoritosIds,
      isFavorito,
      toggleFavorito,
      carregandoFavoritos,
    }}>
      {children}
    </FavoritosContext.Provider>
  );
}

export function useFavoritosGlobal() {
  return useContext(FavoritosContext);
}