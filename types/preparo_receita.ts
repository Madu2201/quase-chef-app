// TIPOS PARA PREPARO
import type { PassoPreparo } from './detalhe_receita';

// Tipo para os parâmetros de navegação da tela de preparo da receita
export interface PreparoReceitaParams {
  id: string;
  titulo: string;
  imagem: string;
  time: string;
  difficulty: string;
  calories: string;
  description: string;
  rawIngredients: string;
  rawSteps: string;
  passosJson: string;
  preferencias?: string[];
  alergias?: string[];
  tipo?: string;
}

// Tipo para o retorno do hook de preparo da receita
export interface UsePreparoReceitaReturn {
  passoAtual: number;
  isConcluido: boolean;
  tempo: number;
  timerAtivo: boolean;
  toggleTimer: () => void;
  proximoPasso: () => void;
  passoAnterior: () => void;
  resetarTimer: () => void;
  step: PassoPreparo | undefined;
  totalPassos: number;
  isLoading: boolean;
  erro: string | null;
  retryReceita: () => Promise<void>;
}

// Tipo para o estado do preparo da receita
export interface PreparoReceitaState {
    passoAtual: number;
    isConcluido: boolean;
    tempo: number;
    timerAtivo: boolean;
    step: PassoPreparo | undefined;
    totalPassos: number;
}
