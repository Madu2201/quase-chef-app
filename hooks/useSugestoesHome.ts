import { useMemo } from 'react';
import { useReceitas } from './useReceitas';
import { useFiltroEstoque } from './useFiltroEstoque';

export function useSugestoesHome(limiteDeSugestoes: number = 3) {
  const { receitasBanco, carregando } = useReceitas();
  const { filtrarPorEstoque } = useFiltroEstoque();

  const sugestoes = useMemo(() => {
    if (!receitasBanco || receitasBanco.length === 0) return [];

    // 1. Aplica o filtro de dispensa (Mostra apenas o que o usuário pode cozinhar)
    const receitasDisponiveis = filtrarPorEstoque(receitasBanco);

    // 2. Se não houver nenhuma, retorna vazio
    if (receitasDisponiveis.length === 0) return [];

    // 3. Embaralha a lista aleatoriamente
    const receitasEmbaralhadas = [...receitasDisponiveis].sort(() => 0.5 - Math.random());

    // 4. Retorna apenas a quantidade solicitada (ou menos, se não tiver limite suficiente)
    return receitasEmbaralhadas.slice(0, limiteDeSugestoes);
  }, [receitasBanco, filtrarPorEstoque, limiteDeSugestoes]);

  return {
    sugestoes,
    carregando
  };
}