import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { supabase } from '../services/supabase';

interface FavoritosContextData {
  favoritosIds: number[];
  isFavorito: (id: string | number) => boolean;
  toggleFavorito: (id: string | number) => Promise<void>;
  carregandoFavoritos: boolean;
  setUsuarioLogado: (id: string | null) => void; // ✅ Nova função para o seu Login customizado!
}

const FavoritosContext = createContext<FavoritosContextData>({} as FavoritosContextData);

export function FavoritosProvider({ children }: { children: ReactNode }) {
  const [favoritosIds, setFavoritosIds] = useState<number[]>([]);
  const [carregandoFavoritos, setCarregandoFavoritos] = useState(true);
  
  // 👇 Deixei o seu ID (Kaua) como padrão para o botão voltar a funcionar AGORA.
  // No futuro, quando você conectar sua tela de login, inicie isso como: useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>('d940bf2c-8870-47b1-abe6-31737f5bdcd2');

  // Toda vez que o usuário mudar, busca os favoritos dele
  useEffect(() => {
    if (userId) {
      buscarFavoritos(userId);
    }
  }, [userId]);

  async function buscarFavoritos(uid: string) {
    setCarregandoFavoritos(true);
    const { data, error } = await supabase
      .from('receitas_favoritas')
      .select('receita_id')
      .eq('user_id', uid);

    if (!error && data) {
      setFavoritosIds(data.map(item => item.receita_id));
    } else {
      console.log('Erro ao buscar favoritos:', error?.message);
    }
    setCarregandoFavoritos(false);
  }

  const isFavorito = (id: string | number) => {
    return favoritosIds.includes(Number(id));
  };

  const toggleFavorito = async (receitaId: string | number) => {
    if (!userId) {
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
        .match({ user_id: userId, receita_id: idNum });
    } else {
      await supabase
        .from('receitas_favoritas')
        .insert({ user_id: userId, receita_id: idNum });
    }
  };

  // ✅ Quando o seu sistema de login estiver pronto, você vai chamar essa função passando o ID
  const setUsuarioLogado = (id: string | null) => {
    setUserId(id);
    if (!id) setFavoritosIds([]); // Se o usuário deslogar, limpa a tela de favoritos
  };

  return (
    <FavoritosContext.Provider value={{ favoritosIds, isFavorito, toggleFavorito, carregandoFavoritos, setUsuarioLogado }}>
      {children}
    </FavoritosContext.Provider>
  );
}

export function useFavoritosGlobal() {
  return useContext(FavoritosContext);
}