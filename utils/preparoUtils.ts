import type { PreparoReceitaParams } from "../types/preparo_receita";
import type { Recipe } from "../types/receitas";
import { criarReceitaIA } from "./receitaIAUtils";

//Cria objeto Recipe para receitas de IA no contexto de preparo
export const criarReceitaIAParaPreparo = (
  params: PreparoReceitaParams,
): Recipe => {
  return criarReceitaIA({
    id: params.id,
    titulo: params.titulo,
    time: params.time,
    difficulty: params.difficulty,
    description: params.description,
    imagem: params.imagem,
    calories: params.calories,
    rawIngredients: params.rawIngredients,
    rawSteps: params.rawSteps || params.passosJson,
    preferences: params.preferencias,
    recipeAllergies: params.alergias,
  });
};

// Processa parâmetros da rota para o formato estruturado
export const processarParamsPreparo = (params: any): PreparoReceitaParams => {
  return {
    id: params.id as string,
    titulo: params.titulo as string,
    imagem: Array.isArray(params.imagem)
      ? params.imagem[0]
      : (params.imagem as string),
    time: params.time as string,
    difficulty: params.difficulty as string,
    calories: params.calories as string,
    description: params.description as string,
    rawIngredients: params.rawIngredients as string,
    rawSteps: (params.rawSteps as string) || (params.passosJson as string),
    passosJson: params.passosJson as string,
    preferencias: params.preferencias
      ? JSON.parse(params.preferencias as string)
      : [],
    alergias: params.alergias ? JSON.parse(params.alergias as string) : [],
    tipo: params.tipo as string,
  };
};
