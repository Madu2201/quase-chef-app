// UTILITÁRIOS GERAIS PARA RECEITAS IA
import type { Recipe } from "../hooks/useReceitas";

// Cria objeto Recipe para receitas geradas por IA
export const criarReceitaIA = (params: {
    id: string;
    titulo: string;
    time: string;
    difficulty: string;
    description: string;
    imagem: string;
    calories: string;
    rawIngredients: string;
    rawSteps: string;
    dicaIA?: string;
}): Recipe => {
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
        tags: ["IA"],
        tipo: "ia",
        dicaIA: params.dicaIA,
    };
};