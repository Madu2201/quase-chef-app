import {
  Flame,
  Leaf,
  RotateCcw,
  Sparkles,
  Utensils,
  Zap,
} from "lucide-react-native";
import React from "react";
import { INGREDIENTES_LIVRES } from "../constants/ingredients";
import {
  ALLERGY_OPTIONS,
  FOOD_PREFERENCE_OPTIONS,
} from "../constants/OpcaoAlimentar";
import { Colors } from "../constants/theme";
import type { Ingredient } from "../types/despensa";

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
 * Verifica se o nome de um ingrediente da despensa pertence a uma categoria
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

/** Ingredientes selecionados com quantidade/unidade reais da despensa (para regras de limite no prompt). */
export type IngredienteSelecionadoParaPrompt = {
  nome: string;
  quantidadeDisponivel: number;
  unidade: string;
};

/**
 * Monta o estoque para o prompt a partir dos IDs da despensa (evita ambiguidade com nomes duplicados).
 */
export function montarListaIngredientesPorIds(
  idsSelecionados: string[],
  estoqueDespensa: Ingredient[],
): IngredienteSelecionadoParaPrompt[] {
  const map = new Map(estoqueDespensa.map((i) => [i.id, i]));
  return idsSelecionados
    .filter(Boolean)
    .map((id) => map.get(id))
    .filter((i): i is Ingredient => i != null)
    .map((i) => ({
      nome: i.name,
      quantidadeDisponivel: i.qty,
      unidade: i.unit,
    }));
}

/** Texto único da lista INGREDIENTES_LIVRES para o prompt (referência explícita). */
export function obterListaIngredientesLivresParaPrompt(): string {
  const unicos = [
    ...new Set(INGREDIENTES_LIVRES.map((s) => s.trim().toLowerCase())),
  ].sort();
  return unicos.join(", ");
}

/** Perfil do usuário para reforço de segurança no prompt (alergias / preferências). */
export type ContextoSegurancaPrompt = {
  chavesAlergiaUsuario: string[];
  chavesPreferenciaUsuario: string[];
};

function montarBlocoSegurancaPerfil(ctx: ContextoSegurancaPrompt): string {
  const linhas: string[] = [];

  if (ctx.chavesAlergiaUsuario.length > 0) {
    const texto = ctx.chavesAlergiaUsuario
      .map(
        (k) =>
          ALLERGY_OPTIONS.find((o) => o.key === k)?.label?.toLowerCase() || k,
      )
      .join(", ");
    linhas.push(
      `SEGURANÇA — ALERGIAS DO USUÁRIO (BLACKLIST ABSOLUTA): ${texto}. ` +
        `É PROIBIDO usar qualquer ingrediente ou derivado associado a estes alérgenos (incluindo óleo de amendoim, leite em pó, tofu/soja se alérgico a soja, etc.). ` +
        `O campo "alergias_presentes" no JSON deve listar apenas alérgenos que AINDA estejam presentes no prato final; se a receita for segura para o usuário, use [].`,
    );
  }

  if (ctx.chavesPreferenciaUsuario.length > 0) {
    const texto = ctx.chavesPreferenciaUsuario
      .map(
        (k) =>
          FOOD_PREFERENCE_OPTIONS.find(
            (o) => o.key === k,
          )?.label?.toLowerCase() || k,
      )
      .join(", ");
    linhas.push(
      `PREFERÊNCIAS DO USUÁRIO (pelo menos UMA deve ser refletida no campo "preferencias" quando fizer sentido): ${texto}. ` +
        `Ex.: vegano OU sem_gluten — não é necessário atender todas simultaneamente; escolha o melhor encaixe para os ingredientes disponíveis.`,
    );
  }

  if (linhas.length === 0) return "";
  return `\n${linhas.join("\n\n")}\n`;
}

/**
 * Monta o prompt completo para geração de receita por IA.
 * Regras: só ingredientes selecionados + INGREDIENTES_LIVRES; limites de quantidade; fidelidade de unidade.
 */
export function montarPromptGeracaoReceitaIA(
  ingredientesComEstoque: IngredienteSelecionadoParaPrompt[],
  contextoUsuario?: ContextoSegurancaPrompt | null,
): string {
  const listaLivres = obterListaIngredientesLivresParaPrompt();

  const blocoPerfil = contextoUsuario
    ? montarBlocoSegurancaPerfil(contextoUsuario)
    : "";

  const blocoEstoque = ingredientesComEstoque
    .map((ing) => {
      const limite = ing.quantidadeDisponivel;
      const u = ing.unidade;
      return (
        `- "${ing.nome}": DISPONÍVEL no máximo ${limite} ${u}. ` +
        `Na lista "ingredientes" do JSON, a "quantidade" deste item deve ser estritamente ≤ ${limite}. ` +
        `O campo "unidade" para este ingrediente deve ser exatamente "${u}" (mesma unidade da despensa; se o estoque está em unidades, não use gramas/ml para este item).`
      );
    })
    .join("\n");

  return `Atue como um Chef de Cozinha profissional.

FONTES DE INGREDIENTES — É PROIBIDO inventar ou citar qualquer ingrediente que não esteja em uma destas duas fontes:
(1) Ingredientes selecionados pelo usuário (detalhados abaixo com estoque).
(2) Apenas nomes que existam na lista INGREDIENTES_LIVRES do sistema: ${listaLivres}.

Sobre INGREDIENTES_LIVRES:
- Trate sal, água, óleo e azeite como bases normalmente disponíveis.
- Os demais itens dessa lista (ex.: pimenta, açúcar) são OPCIONAIS: use só se combinar com a receita; não force o uso.
${blocoPerfil}
ESTOQUE DO USUÁRIO (teto máximo por item — a quantidade na receita NUNCA pode ultrapassar o disponível; pode ser menor):
${blocoEstoque}

REGRAS DE QUANTIDADE E UNIDADE:
- Para cada ingrediente da despensa, a quantidade sugerida na receita deve ser no máximo igual ao disponível e tipicamente uma parte dele (ex.: 500g de 4kg), nunca o total obrigatório nem um valor acima do estoque.
- Respeite fidelidade à unidade da despensa: se o item está em "un", use unidades na receita; não converta batatas em gramas se o estoque foi em unidades.
- Garanta que nenhuma linha de ingrediente implique falta no estoque do usuário (nada de quantidades > disponível).

REGRAS OBRIGATÓRIAS DE RESPOSTA (JSON APENAS):
1. nome_receita: Título da receita (Máximo 4 palavras).
2. tempo_preparo: Formato padrão colado (ex: "20min", "1h30min"). SEM ESPAÇOS.
3. dificuldade: Escolha entre "Fácil", "Média" ou "Difícil".
4. calorias: Estime o valor. RETORNE APENAS O NÚMERO E A SIGLA (ex: "500 kcal").
5. dica_rapida: Dica técnica curta e útil (OBRIGATÓRIO).
6. descricao_simples_preparo: Resumo TÉCNICO do preparo em 1 ou 2 frases. Evite tom de marketing.
7. pre_visualizacao_passos: Lista de strings com 3 a 5 passos NUMERADOS resumidos (OBRIGATÓRIO). Deve ser compatível com o passo a passo detalhado (visão geral).
8. ingredientes: Lista de objetos {
     "unidade": string,
     "nome_base": string (deve ser exatamente um dos ingredientes permitidos: selecionados ou da lista livre),
     "quantidade": number,
     "texto_original": string,
     "quantidade_gramas_ml": number (use coerente com a unidade; se a receita usa unidades, pode ser 0 ou proporcional conforme sua convenção, sem violar o teto do estoque. JAMAIS RETORNE 0 em casos que envolvam peso (kg, g), volume (l, ml) ou medidas caseiras (xícara, colher, copo, pitada). O valor 0.0 é exclusivo para contagem de unidades inteiras (ex: 2 limões, 4 fatias de pão)
   }.
9. passos_detalhados: Lista de objetos { "titulo": string, "descricao": string, "dica_do_chef": string, "tempo_timer_minutos": number }.
   REGRAS PARA TIMER: tempo_timer_minutos DEVE SER 0 para ações manuais (picar, mexer, montar). Use > 0 apenas para fogo, forno ou espera.
10. tags: Lista de strings. Escolha APENAS entre: ["Salgadas", "Doces", "Rápidas", "Saudáveis", "Econômicas", "Lanches", "Jantar", "Almoço"].
11. preferencias: Lista de strings. Escolha APENAS entre: ["vegano", "vegetariano", "sem_gluten", "sem_lactose", "baixo_carboidrato", "sem_acucar"]. Retorne [] se não aplicar.
12. alergias_presentes: Lista de strings. Escolha APENAS entre: ["amendoim", "nozes", "leite", "ovo", "soja", "trigo", "gergelim", "frutos_do_mar"]. Retorne [] se for livre de alérgenos.

Retorne APENAS o JSON puro, sem markdown ou explicações.`;
}
