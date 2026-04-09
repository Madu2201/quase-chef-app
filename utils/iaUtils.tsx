import {
  Flame,
  Leaf,
  RotateCcw,
  Sparkles,
  Utensils,
  Zap,
} from "lucide-react-native";
import React from "react";
import { Colors } from "../constants/theme";

/**
 * Mapeia uma string para o componente de ícone correspondente
 * Útil para converter os dados das constantes em elementos visuais
 */
export const getCategoriaIcon = (iconName: string, size = 14) => {
  const props = { size, color: Colors.dark };

  switch (iconName) {
    case "Flame":
      return <Flame {...props} />;
    case "Leaf":
      return <Leaf {...props} />;
    case "Utensils":
      return <Utensils {...props} />;
    case "Sparkles":
      return <Sparkles {...props} />;
    case "RotateCcw":
      return <RotateCcw {...props} />;
    default:
      return <Zap {...props} />;
  }
};

/**
 * Lógica de correspondência inteligente (Sinônimos e Variações)
 * Verifica se o nome de um ingrediente da dispensa pertence a uma categoria
 */
export const verificarCorrespondencia = (
  ingName: string,
  catItem: string,
): boolean => {
  const ingLower = ingName.toLowerCase().trim();
  const itemLower = catItem.toLowerCase().trim();

  // 1. Verificação direta (ex: "Tomate" === "Tomate")
  if (
    ingLower === itemLower ||
    ingLower.includes(itemLower) ||
    itemLower.includes(ingLower)
  ) {
    return true;
  }

  // 2. Dicionário de variações para cobrir casos onde o nome é muito diferente
  const variacoes: Record<string, string[]> = {
    ovo: ["ovos", "egg"],
    frango: ["chicken", "galinha", "peito"],
    carne: ["moída", "vermelha", "beef", "ground meat", "bife"],
    peixe: ["fish", "salmão", "sardinha", "tilápia"],
    tofu: ["soja", "queijo de soja"],
    feijão: ["preto", "carioca", "beans", "fradinho"],
    lentilha: ["lentilhas", "lentil"],
    grão: ["grão de bico", "chickpea"],
    tomate: ["tomato", "cereja"],
    cebola: ["onion", "roxa"],
    pimentão: ["pepper", "pimento"],
    batata: ["potato", "doce", "inglesa"],
    arroz: ["rice", "branco", "integral"],
    macarrão: ["pasta", "espaguete", "penne", "massa"],
    pão: ["bread", "baguete", "integral"],
    pimenta: ["pimenta do reino", "pepper", "dedo de moça"],
    azeite: ["olive oil", "extra virgem"],
    óleo: ["oil", "girassol", "soja"],
    manjericão: ["basil"],
    páprica: ["paprika", "defumada", "doce"],
  };

  // Verifica se o ingrediente e o item da categoria compartilham a mesma "raiz" do dicionário
  for (const [chave, sinonimos] of Object.entries(variacoes)) {
    const ingPertenceAChave =
      ingLower.includes(chave) || sinonimos.some((s) => ingLower.includes(s));
    const itemPertenceAChave =
      itemLower.includes(chave) || sinonimos.some((s) => itemLower.includes(s));

    if (ingPertenceAChave && itemPertenceAChave) {
      return true;
    }
  }

  return false;
};

/**
 * Limpa a string retornada pela IA removendo blocos de código Markdown
 */
export const limparJSONIA = (rawString: string): string => {
  return rawString
    .replace(/```json/gi, "")
    .replace(/```/gi, "")
    .trim();
};
