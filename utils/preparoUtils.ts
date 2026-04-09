import type { Recipe } from "../hooks/useReceitas";
import type { PreparoReceitaParams } from "../types/preparo_receita";
import { criarReceitaIA } from "./receitaIAUtils";

//Cria objeto Recipe para receitas de IA no contexto de preparo
export const criarReceitaIAParaPreparo = (params: PreparoReceitaParams): Recipe => {
    return criarReceitaIA({
        id: params.id,
        titulo: params.titulo,
        time: params.time,
        difficulty: params.difficulty,
        description: params.description,
        imagem: params.imagem,
        calories: params.calories,
        rawIngredients: params.rawIngredients,
        rawSteps: params.passosJson,
    });
};

// Processa parâmetros da rota para o formato estruturado
export const processarParamsPreparo = (params: any): PreparoReceitaParams => {
    return {
        id: params.id as string,
        titulo: params.titulo as string,
        imagem: Array.isArray(params.imagem) ? params.imagem[0] : params.imagem as string,
        time: params.time as string,
        difficulty: params.difficulty as string,
        calories: params.calories as string,
        description: params.description as string,
        rawIngredients: params.rawIngredients as string,
        passosJson: params.passosJson as string,
        tipo: params.tipo as string,
    };
};