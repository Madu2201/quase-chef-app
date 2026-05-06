import { useMemo } from 'react';
import { useAuth } from './useAuth';
import { useFiltroEstoque } from './useFiltroEstoque';
import { useReceitas } from './useReceitas';

export function useSugestoesHome(limiteDeSugestoes: number = 3) {
  const { receitasBanco, carregando, filtrarPorPerfil } = useReceitas();
  const { filtrarPorEstoque } = useFiltroEstoque();
  const { user } = useAuth();

  const sugestoes = useMemo(() => {
    if (!receitasBanco || receitasBanco.length === 0) return [];

    // 1. Aplica o filtro de perfil do usuário (preferências e alergias)
    const receitasDisponiveis = filtrarPorEstoque(
      filtrarPorPerfil(
        receitasBanco,
        user?.food_preferences,
        user?.allergies,
        user?.temporaryMode,
      ),
    );

    // 2. Se não houver nenhuma, retorna vazio
    if (receitasDisponiveis.length === 0) return [];

    // 3. Embaralha a lista aleatoriamente
    const receitasEmbaralhadas = [...receitasDisponiveis].sort(() => 0.5 - Math.random());

    // 4. Retorna apenas a quantidade solicitada (ou menos, se não tiver limite suficiente)
    return receitasEmbaralhadas.slice(0, limiteDeSugestoes);
  }, [receitasBanco, filtrarPorEstoque, filtrarPorPerfil, limiteDeSugestoes, user?.food_preferences, user?.allergies, user?.temporaryMode]);

  return {
    sugestoes,
    carregando
  };
}