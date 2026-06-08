import { CATEGORIA_UNIDADE, UNIDADE_EQUIVALENCIAS, UNIDADES_CONTAVEIS } from "../constants/ingredients";

// Funções de normalização de texto e unidades para facilitar comparações e cálculos
export const normalizarTexto = (texto: string): string => {
  if (!texto) return '';
  let limpo = texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();

  // Remove 's' final apenas se a palavra tiver mais de 3 caracteres
  if (limpo.endsWith('s') && limpo.length > 3) {
    limpo = limpo.slice(0, -1);
  }
  return limpo;
};

// Normaliza nome para comparação case-insensitive, mantendo a primeira letra maiúscula
export interface BaseDePeso {
  valor: number;
  tipo: 'massa_volume' | 'unidade';
}

// Normaliza quantidade e unidade para comparação case-insensitive
export const normalizarBase = (qtd: number, unidade: string): BaseDePeso => {
  const uni = unidade.toLowerCase().trim();

  // Conversões para massa/volume
  if (CATEGORIA_UNIDADE.PESO.includes(uni)) {
    return { valor: qtd * (UNIDADE_EQUIVALENCIAS[uni] || 1), tipo: 'massa_volume' };
  }
  if (CATEGORIA_UNIDADE.VOLUME.includes(uni)) {
    return { valor: qtd * (UNIDADE_EQUIVALENCIAS[uni] || 1), tipo: 'massa_volume' };
  }

  // Fallback para unidades contáveis
  if (UNIDADES_CONTAVEIS.includes(uni)) {
    return { valor: qtd, tipo: 'unidade' };
  }

  // Se for unidade genérica ou não reconhecida, mantém
  return { valor: qtd * (UNIDADE_EQUIVALENCIAS[uni] || 1), tipo: 'unidade' };
};

// Converte uma quantidade de uma unidade para a unidade base (ex: 1kg para 1000g)
export function converterParaUnidadeBase(valor: number, unidade: string) {
    const unid = unidade.toLowerCase().trim();
    
    if (CATEGORIA_UNIDADE.PESO.includes(unid)) {
        return { valor: valor * (UNIDADE_EQUIVALENCIAS[unid] || 1), unidadeBase: 'g' };
    }
    if (CATEGORIA_UNIDADE.VOLUME.includes(unid)) {
        return { valor: valor * (UNIDADE_EQUIVALENCIAS[unid] || 1), unidadeBase: 'ml' };
    }

    if (UNIDADES_CONTAVEIS.includes(unid)) {
        return { valor, unidadeBase: 'un' };
    }
    
    // Se for unidade genérica ou não reconhecida, mantém
    return { valor: valor * (UNIDADE_EQUIVALENCIAS[unid] || 1), unidadeBase: unid };
}

// Converte uma quantidade de uma unidade base (ex: 1000g para 1kg)
export function converterDaBaseParaUnidade(valorBase: number, unidadeDestino: string): number {
    const unid = unidadeDestino.toLowerCase().trim();
    const fator = UNIDADE_EQUIVALENCIAS[unid] || 1;
    return valorBase / fator;
}

const STOPWORDS_INGREDIENTE = new Set(['de', 'da', 'do', 'das', 'dos', 'e']);

// Normaliza nome de ingrediente para comparação case-insensitive
export const normalizarNomeIngredienteParaMatch = (texto: string): string => {
    const normalizado = normalizarTexto(texto)
        .replace(/[^\w\s]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

    if (!normalizado) return '';

    return normalizado
        .split(' ')
        .filter((token) => token && !STOPWORDS_INGREDIENTE.has(token))
        .join(' ');
};

// Verifica se dois nomes de ingrediente são compativeis para comparação, considerando normalização e stopwords
export const nomesIngredientesCompativeis = (nomeA: string, nomeB: string): boolean => {
    const a = normalizarNomeIngredienteParaMatch(nomeA);
    const b = normalizarNomeIngredienteParaMatch(nomeB);

    if (!a || !b) return false;
    if (a === b) return true;

    return a.includes(b) || b.includes(a);
};

// Formata uma quantidade para exibição com duas casas decimais
export const formatarQuantidade = (valor: number): number => {
  return Math.round(valor * 100) / 100;
};

// Formata um percentual para exibição com duas casas decimais
export const formatarPercentual = (valor: number): number => {
  return Math.round(valor);
};