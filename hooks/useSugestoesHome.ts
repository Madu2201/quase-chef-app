import { useMemo } from "react";
import { normalizarTexto } from "../utils/normalization";
import { useAuth } from "./useAuth";
import { useDespensa } from "./useDespensa";
import { useFiltroEstoque } from "./useFiltroEstoque";
import { Recipe, useReceitas } from "./useReceitas";

/** Evita vários cards iguais (ex.: mesma IA favoritada várias vezes no banco). */
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

export function useSugestoesHome(limiteDeSugestoes: number = 3) {
  const { receitasBanco, carregando, filtrarPorPerfil } = useReceitas();
  const { filtrarPorEstoque } = useFiltroEstoque();
  const { ingredients } = useDespensa();
  const { user } = useAuth();

  const fingerprintEstoque = useMemo(
    () =>
      ingredients.map((i) => `${i.id}:${i.qty}:${i.unit}:${i.name}`).join("|"),
    [ingredients],
  );

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
    fingerprintEstoque,
    user?.food_preferences,
    user?.allergies,
    user?.temporaryMode,
  ]);

  return {
    sugestoes,
    carregando,
  };
}
