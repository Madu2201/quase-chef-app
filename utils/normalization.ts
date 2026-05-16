/**
 * Normaliza texto removendo acentos, convertendo para minúsculo
 * e removendo o 's' final para permitir match entre singular/plural
 */
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

/**
 * Converte quantidade e unidade para uma base normalizada (grama/ml)
 * Retorna { valor: number, tipo: 'massa_volume' | 'unidade' }
 */
export interface BaseDePeso {
  valor: number;
  tipo: 'massa_volume' | 'unidade';
}

const UNIDADES_CONTAVEIS = [
  'un',
  'und',
  'unidade',
  'unidades',
  'unit',
  'media',
  'medio',
  'média',
  'médio',
  'picado',
  'picada',
  'picados',
  'picadas',
  'dente',
  'dentes',
  'folha',
  'folhas',
];

export const normalizarBase = (qtd: number, unidade: string): BaseDePeso => {
  const uni = unidade.toLowerCase().trim();

  // Conversões para massa/volume
  if (['kg', 'quilo', 'quilos'].includes(uni)) {
    return { valor: qtd * 1000, tipo: 'massa_volume' };
  }
  if (['g', 'grama', 'gramas'].includes(uni)) {
    return { valor: qtd, tipo: 'massa_volume' };
  }
  if (['l', 'litro', 'litros'].includes(uni)) {
    return { valor: qtd * 1000, tipo: 'massa_volume' };
  }
  if (['ml', 'mililitro', 'mililitros'].includes(uni)) {
    return { valor: qtd, tipo: 'massa_volume' };
  }

  // Fallback para unidades contáveis
  return { valor: qtd, tipo: 'unidade' };
};

// ============================================================================
// --- NOVAS CONSTANTES E FUNÇÕES (FASE 1: GUARDA ESTOQUE / UPSERT) ---
// ============================================================================

export const CATEGORIA_UNIDADE = {
    PESO: ['g', 'kg', 'quilo', 'quilos', 'grama', 'gramas'],
    VOLUME: ['ml', 'l', 'litro', 'litros', 'mililitro', 'mililitros'],
    UNIDADE: ['un', 'pct', 'dz']
};

export const UNIDADE_EQUIVALENCIAS: Record<string, number> = {
    'kg': 1000, 'quilo': 1000, 'quilos': 1000,
    'g': 1, 'grama': 1, 'gramas': 1,
    'l': 1000, 'litro': 1000, 'litros': 1000,
    'ml': 1, 'mililitro': 1, 'mililitros': 1,
    'un': 1,
    'pct': 1,
    'dz': 12
};

/**
 * Converte um valor e sua unidade para a unidade base da sua categoria para permitir somas exatas.
 * Ex: (2, 'kg') -> { valor: 2000, unidadeBase: 'g' }
 */
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

/**
 * Converte um valor em unidade base de volta para a unidade desejada.
 * Ex: (460, 'kg') -> 0.46
 */
export function converterDaBaseParaUnidade(valorBase: number, unidadeDestino: string): number {
    const unid = unidadeDestino.toLowerCase().trim();
    const fator = UNIDADE_EQUIVALENCIAS[unid] || 1;
    return valorBase / fator;
}

const STOPWORDS_INGREDIENTE = new Set(['de', 'da', 'do', 'das', 'dos', 'e']);

/**
 * Reduz o texto para facilitar o match semântico entre ingredientes.
 * Ex: "Farinha de Trigo" -> "farinha trigo"
 */
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

/**
 * Match tolerante entre nomes de ingredientes:
 * - igualdade exata normalizada
 * - substring bilateral após limpeza de texto
 */
export const nomesIngredientesCompativeis = (nomeA: string, nomeB: string): boolean => {
    const a = normalizarNomeIngredienteParaMatch(nomeA);
    const b = normalizarNomeIngredienteParaMatch(nomeB);

    if (!a || !b) return false;
    if (a === b) return true;

    return a.includes(b) || b.includes(a);
};

/**
 * Formata uma quantidade numérica para no máximo 2 casas decimais.
 * Resolve problemas de precisão de ponto flutuante (ex: 0.30000000000000007 -> 0.30).
 */
export const formatarQuantidade = (valor: number): number => {
  return Math.round(valor * 100) / 100;
};

/**
 * Formata um percentual para exibição inteira sem casas decimais.
 */
export const formatarPercentual = (valor: number): number => {
  return Math.round(valor);
};
