// Lista de ingredientes que são considerados "livres" para a geração de receitas
export const INGREDIENTES_LIVRES = [
  "agua",
  "água",
  "sal",
  "pimenta",
  "pimenta do reino",
  "pimenta-do-reino",
  "oleo",
  "óleo",
  "azeite",
  "acucar",
  "açúcar",
];

// Strings e constantes relacionadas a receitas e ingredientes
export const RECEITA_STRINGS = {
  IMAGEM_PADRAO:
    "https://images.unsplash.com/photo-1510629954389-c1e0da47d415?q=80&w=1000",
  DICA_IA_PADRAO: "Que tal adicionar seu toque especial a essa receita?",
  SEM_INGREDIENTES: "Sem ingredientes cadastrados.",
  SEM_PASSOS: "Sem passos cadastrados",
  RECEITA_DESCONHECIDA: "Receita Desconhecida",
  DESCRICAO_INDISPONIVEL: "Descrição indisponível.",
  VALOR_PADRAO: "--",
} as const;

// Unidades aceitas
export const UNIDADES_ACEITAS = [
  "un",
  "kg",
  "g",
  "L",
  "ml",
  "xícara",
  "colher",
];

// Unidades contáveis que não devem ser convertidas para massa/volume
export const UNIDADES_CONTAVEIS = [
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

// Categorias de unidades para normalização
export const CATEGORIA_UNIDADE = {
  PESO: ['g', 'kg', 'quilo', 'quilos', 'grama', 'gramas'],
  VOLUME: ['ml', 'l', 'litro', 'litros', 'mililitro', 'mililitros'],
  UNIDADE: ['un', 'pct', 'dz'],
};

// Equivalências para conversão de unidades para uma base comum (gramas para peso, ml para volume)
export const UNIDADE_EQUIVALENCIAS: Record<string, number> = {
  'kg': 1000,
  'quilo': 1000,
  'quilos': 1000,
  'g': 1,
  'grama': 1,
  'gramas': 1,
  'l': 1000,
  'litro': 1000,
  'litros': 1000,
  'ml': 1,
  'mililitro': 1,
  'mililitros': 1,
  'un': 1,
  'pct': 1,
  'dz': 12,
};