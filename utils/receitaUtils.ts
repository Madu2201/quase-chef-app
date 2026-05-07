import { INGREDIENTES_LIVRES } from "../constants/ingredients";
import type { Ingrediente, PassoPreparo } from "../types/detalhe_receita";
import type { Ingredient } from "../types/dispensa";
import {
    converterParaUnidadeBase,
    nomesIngredientesCompativeis,
    normalizarBase,
    normalizarTexto,
} from "./normalization";

// Formata tempo de minutos/horas para exibição
export const formatarTempo = (tempo: string): string =>
  tempo
    .toLowerCase()
    .replace("minutos", "min")
    .replace("minuto", "min")
    .replace("horas", "h")
    .replace("hora", "h");

// Processa ingredientes do formato raw para o formato da interface
export const calcularStatusIngrediente = (
  ingredienteReceita: any,
  dispensa: Ingredient[],
): "ok" | "faltando" => {
  if (!ingredienteReceita || !ingredienteReceita.nome_base) {
    return "faltando";
  }

  const nomeReceita = normalizarTexto(ingredienteReceita.nome_base);

  // Ingredientes livres sempre são considerados "ok"
  if (
    INGREDIENTES_LIVRES.some((livre) => normalizarTexto(livre) === nomeReceita)
  ) {
    return "ok";
  }

  const itemDispensa = encontrarItemDispensaPorNome(
    ingredienteReceita.nome_base,
    dispensa,
  );

  if (!itemDispensa) {
    return "faltando";
  }

  // Regra: se a quantidade na dispensa for 0 ou menor, está faltando
  if (itemDispensa.qty <= 0) {
    return "faltando";
  }

  if (
    ingredienteReceita.quantidade_gramas_ml &&
    Number(ingredienteReceita.quantidade_gramas_ml) > 0 &&
    !ingredienteReceita.baixa_confianca
  ) {
    const quantidadeNecessaria = Number(
      ingredienteReceita.quantidade_gramas_ml,
    );
    const { valor: estoqueNormalizado } = converterParaUnidadeBase(
      itemDispensa.qty,
      itemDispensa.unit,
    );

    return estoqueNormalizado >= quantidadeNecessaria ? "ok" : "faltando";
  }

  // Fallback: comparar quantidades diretamente para unidades contáveis
  const baseReceita = normalizarBase(
    Number(ingredienteReceita.quantidade) || 0,
    ingredienteReceita.unidade || "",
  );
  const baseDispensa = normalizarBase(itemDispensa.qty, itemDispensa.unit);

  // Se ambas são unidades contáveis, comparar diretamente
  if (baseReceita.tipo === "unidade" && baseDispensa.tipo === "unidade") {
    return baseDispensa.valor >= baseReceita.valor ? "ok" : "faltando";
  }

  // Se uma é massa/volume e outra não, não consegue comparar
  return "faltando";
};

export const encontrarItemDispensaPorNome = (
  nomeIngredienteReceita: string,
  dispensa: Ingredient[],
): Ingredient | undefined => {
  return dispensa.find((item) =>
    nomesIngredientesCompativeis(nomeIngredienteReceita, item.name),
  );
};

export const processarIngredientes = (
  rawIngredients: string | undefined,
  dispensa: Ingredient[] = [],
): Ingrediente[] => {
  if (!rawIngredients) return [];

  try {
    const rawIng = JSON.parse(rawIngredients);
    return rawIng.map((ing: any, idx: number) => {
      let nomeExibicao = "";

      if (ing.texto_original) {
        nomeExibicao = ing.texto_original;
      } else if (ing.nome_base && ing.quantidade) {
        // Para receitas de IA que não possuem texto_original
        nomeExibicao = `${ing.quantidade} de ${ing.nome_base}`;
      } else if (typeof ing === "string") {
        nomeExibicao = ing;
      } else {
        nomeExibicao = ing.nome_base || "Ingrediente";
      }

      return {
        id: String(idx),
        nome: nomeExibicao,
        status: calcularStatusIngrediente(ing, dispensa),
      };
    });
  } catch (e) {
    console.error("Erro ao processar ingredientes:", e);
    return [];
  }
};

//Processa passos de preparo do formato raw para o formato da interface
export const processarPassosPreparo = (
  rawSteps: string | undefined,
): PassoPreparo[] => {
  if (!rawSteps) return [];

  try {
    const rawStepsParsed = JSON.parse(rawSteps);
    return rawStepsParsed.map((passo: any) => ({
      titulo: passo.titulo || "Passo",
      descricao: passo.descricao,
      dica: passo.dica_do_chef || "",
      hasTimer: passo.tempo_timer_minutos > 0,
      tempoTimer: (passo.tempo_timer_minutos || 0) * 60,
    }));
  } catch (e) {
    console.error("Erro ao processar passos:", e);
    return [];
  }
};
