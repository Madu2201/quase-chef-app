import type { TemporaryMode } from "./perfil";

// Tipos relacionados a receitas
export interface Recipe {
    id: string;
    title: string;
    time: string;
    difficulty: string;
    descStart: string;
    ingredients: string;
    descEnd: string;
    image: string;
    calories: string;
    rawIngredients: string;
    rawSteps: string;
    tags: string[];
    preferences?: string[];
    recipeAllergies?: string[];
    tipo?: string;
    dica_rapida?: string;
    pre_visualizacao?: string[];
}

// Tipos relacionados ao contexto de receitas
export type ReceitasContextValue = {
    receitasBanco: Recipe[];
    carregando: boolean;
    refreshReceitas: () => void;
    filtrarPorCategoria: (receitas: Recipe[], categoria: string) => Recipe[];
    filtrarPorBusca: (receitas: Recipe[], busca: string) => Recipe[];
    filtrarPorPerfil: (
        receitas: Recipe[],
        foodPreferences?: string[] | null,
        allergies?: string[] | null,
        temporaryMode?: TemporaryMode | null,
    ) => Recipe[];
};
