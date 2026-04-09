// TIPOS PARA PREPARO
import type { PassoPreparo } from './detalhe_receita';

// TIPOS PARA PARAMS
export interface PreparoReceitaParams {
    id: string;
    titulo: string;
    imagem: string;
    time: string;
    difficulty: string;
    calories: string;
    description: string;
    rawIngredients: string;
    passosJson: string;
    tipo?: string;
}

// TIPOS PARA STATE
export interface PreparoReceitaState {
    passoAtual: number;
    isConcluido: boolean;
    tempo: number;
    timerAtivo: boolean;
    step: PassoPreparo | undefined;
    totalPassos: number;
}