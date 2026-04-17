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

const getStringParam = (value: any): string => {
    if (typeof value === "string") return value;
    if (Array.isArray(value)) return value[0] ?? "";
    return "";
};

// Processa parâmetros da rota para o formato estruturado
export const processarParamsPreparo = (params: any): PreparoReceitaParams => {
    return {
        id: getStringParam(params.id),
        titulo: getStringParam(params.titulo),
        imagem: getStringParam(params.imagem),
        time: getStringParam(params.time),
        difficulty: getStringParam(params.difficulty),
        calories: getStringParam(params.calories),
        description: getStringParam(params.description),
        rawIngredients: getStringParam(params.rawIngredients) || "[]",
        passosJson: getStringParam(params.passosJson) || "[]",
        tipo: getStringParam(params.tipo),
    };
};