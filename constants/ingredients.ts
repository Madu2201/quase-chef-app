/**
 * Ingredientes que se presume o usuário sempre tem em casa
 * Não precisa estar adicionado na dispensa
 */
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

/**
 * Unidades de medida aceitas para ingredientes
 */
export const UNIDADES_ACEITAS = [
  "un",
  "kg",
  "g",
  "L",
  "ml",
  "xícara",
  "colher",
];

/**
 * Categorias de ingredientes para a dispensa e seleção IA
 * IMPORTANTE: Cada categoria tem prioridade - ingredientes serão atribuídos à primeira categoria correspondente
 */
export const CATEGORIAS_DISPENSA = [
  {
    titulo: "PROTEÍNAS",
    icon: "Flame",
    itens: [
      "Ovos",
      "Frango",
      "Carne Moída",
      "Carne Vermelha",
      "Peixe",
      "Tofu",
      "Feijão",
      "Lentilha",
      "Grão de Bico",
    ],
  },
  {
    titulo: "VEGETAIS",
    icon: "Leaf",
    itens: [
      "Tomate",
      "Cebola",
      "Pimentão",
      "Brócolis",
      "Cenoura",
      "Espinafre",
      "Abobrinha",
      "Batata",
      "Batata Doce",
      "Abóbora",
      "Alface",
      "Rúcula",
    ],
  },
  {
    titulo: "GRÃOS E CEREAIS",
    icon: "Sparkles",
    itens: [
      "Arroz",
      "Arroz Branco",
      "Arroz Integral",
      "Macarrão",
      "Macarrão Espaguete",
      "Feijão Preto",
      "Feijão Carioca",
      "Pão",
      "Cuscuz",
      "Tapioca",
      "Aveia",
    ],
  },
  {
    titulo: "TEMPEROS E CONDIMENTOS",
    icon: "Zap",
    itens: [
      "Alho",
      "Sal",
      "Pimenta",
      "Pimenta do Reino",
      "Azeite",
      "Óleo",
      "Vinagre",
      "Orégano",
      "Manjericão",
      "Páprica",
      "Mostarda",
      "Molho de Soja",
    ],
  },
];
