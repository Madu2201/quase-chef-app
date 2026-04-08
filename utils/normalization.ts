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

  // Conversões aproximadas para medidas culinárias
  if (['xícara', 'xicara'].includes(uni)) {
    return { valor: qtd * 240, tipo: 'massa_volume' };
  }
  if (['colher', 'colheres'].includes(uni)) {
    return { valor: qtd * 15, tipo: 'massa_volume' };
  }

  // Unidades contáveis (ex: 2 cebolas, 3 tomates)
  return { valor: qtd, tipo: 'unidade' };
};
