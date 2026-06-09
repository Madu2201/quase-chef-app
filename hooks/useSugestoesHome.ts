import { useMemo } from "react";

// Meus imports
import type { Recipe } from "../types/receitas";
import { normalizarTexto } from "../utils/normalization";
import { useAuth } from "./useAuth";
import { useFiltroEstoque } from "./useFiltroEstoque";
import { useReceitas } from "./useReceitas";

// Função para remover receitas duplicadas
function dedupeSugestoesHome(receitas: Recipe[]): Recipe[] {
  const visto = new Set<string>();
  const saida: Recipe[] = [];
  for (const r of receitas) {
    const chave =
      r.tipo === "ia" ? `ia:${normalizarTexto(r.title)}` : `id:${r.id}`;
    if (visto.has(chave)) continue;
    visto.add(chave);
    saida.push(r);
  }
  return saida;
}

// Hook personalizado para obter sugestões de receitas para a tela inicial
export function useSugestoesHome(limiteDeSugestoes: number = 3) {
  const { receitasBanco, carregando, filtrarPorPerfil } = useReceitas();
  const { filtrarPorEstoque } = useFiltroEstoque();
  const { user } = useAuth();

  const sugestoes = useMemo(() => {
    if (!receitasBanco || receitasBanco.length === 0) return [];

    // 1. Aplica o filtro de perfil do usuário (preferências e alergias)
    let receitasDisponiveis = filtrarPorEstoque(
      filtrarPorPerfil(
        receitasBanco,
        user?.food_preferences,
        user?.allergies,
        user?.temporaryMode,
      ),
    );

    receitasDisponiveis = dedupeSugestoesHome(receitasDisponiveis);

    // 2. Se não houver nenhuma, retorna vazio
    if (receitasDisponiveis.length === 0) return [];

    // 3. Embaralha a lista aleatoriamente
    const receitasEmbaralhadas = [...receitasDisponiveis].sort(
      () => 0.5 - Math.random(),
    );

    // 4. Retorna apenas a quantidade solicitada (ou menos, se não tiver limite suficiente)
    return receitasEmbaralhadas.slice(0, limiteDeSugestoes);
  }, [
    receitasBanco,
    filtrarPorEstoque,
    filtrarPorPerfil,
    limiteDeSugestoes,
    user?.food_preferences,
    user?.allergies,
    user?.temporaryMode,
  ]);

  return {
    sugestoes,
    carregando,
  };
}