// Meu import
import type { ReceitaIACriarParams } from "../types/ia";
import type { Recipe } from "../types/receitas";

// Cria objeto Recipe para receitas geradas por IA
export const criarReceitaIA = (params: ReceitaIACriarParams): Recipe => {
  return {
    id: params.id,
    title: params.titulo,
    time: params.time,
    difficulty: params.difficulty,
    descStart: params.description,
    ingredients: params.rawIngredients,
    descEnd: "",
    image: params.imagem,
    calories: params.calories,
    rawIngredients: params.rawIngredients,
    rawSteps: params.rawSteps,
    tags: params.tags || ["IA"],
    tipo: "ia",
    dica_rapida: params.dica_rapida,
    pre_visualizacao: params.pre_visualizacao,
    preferences: params.preferences || [],
    recipeAllergies: params.recipeAllergies || [],
  };
};
