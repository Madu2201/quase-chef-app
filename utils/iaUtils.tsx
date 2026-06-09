import { Flame, Leaf, RotateCcw, Sparkles, Utensils, Zap } from "lucide-react-native";
import React from "react";

// Meus imports
import { IA_ICON_SIZE, IA_RECEITA_DEFAULTS } from "../constants/ia";
import { PROMPT_GERAR_RECEITA_IA, PROMPT_TEMPLATES } from "../constants/ia-prompts";
import { INGREDIENTE_SINONIMOS, INGREDIENTES_LIVRES } from "../constants/ingredients";
import { ALLERGY_OPTIONS, FOOD_PREFERENCE_OPTIONS } from "../constants/OpcaoAlimentar";
import { Colors } from "../constants/theme";
import type { Ingredient } from "../types/despensa";
import type {
  CategoriaIngredienteIA, ContextoSegurancaPrompt, IngredienteIA,
  IngredienteSelecionadoParaPrompt, PassoIA, ReceitaIAJsonResponse,
  ReceitaIAParseResult, ReceitaIAResponse,
} from "../types/ia";

// Cria o icone da categoria
export const getCategoriaIcon = (iconName: string, size = IA_ICON_SIZE) => {
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

// Verificação de correspondência entre ingrediente da despensa e item da categoria (com dicionário de variações)
export const verificarCorrespondencia = (
  ingName: string,
  catItem: string,
): boolean => {
  const ingLower = ingName.toLowerCase().trim();
  const itemLower = catItem.toLowerCase().trim();

  // 1. Caso o ingrediente da despensa seja exatamente igual ao item da categoria
  if (
    ingLower === itemLower ||
    ingLower.includes(itemLower) ||
    itemLower.includes(ingLower)
  ) {
    return true;
  }

  // Verifica se o ingrediente e o item da categoria compartilham a mesma "raiz" do dicionário de sinônimos
  for (const [chave, sinonimos] of Object.entries(INGREDIENTE_SINONIMOS)) {
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

// Normalização de texto para comparação (remove acentos, caracteres especiais, etc.)
export const limparJSONIA = (rawString: string): string => {
  return rawString
    .replace(/```json/gi, "")
    .replace(/```/gi, "")
    .trim();
};

// Funções de normalização para garantir que a resposta da IA esteja no formato esperado.
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function normalizarString(valor: unknown, fallback = ""): string {
  return typeof valor === "string" ? valor.trim() : fallback;
}

function normalizarNumero(valor: unknown): number {
  if (typeof valor === "number" && Number.isFinite(valor)) {
    return valor;
  }

  if (typeof valor === "string") {
    const parsed = Number(valor.trim());
    return Number.isFinite(parsed) ? parsed : 0;
  }

  return 0;
}

function normalizarListaStrings(valor: unknown): string[] {
  if (!Array.isArray(valor)) return [];
  return valor
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter(Boolean);
}

function normalizarIngredientesIA(valor: unknown): IngredienteIA[] {
  if (!Array.isArray(valor)) return [];

  return valor
    .filter(isRecord)
    .map((item) => ({
      nome_base: normalizarString(item.nome_base),
      quantidade: normalizarNumero(item.quantidade),
      unidade: normalizarString(item.unidade),
      texto_original: normalizarString(item.texto_original),
      quantidade_gramas_ml: normalizarNumero(item.quantidade_gramas_ml),
    }))
    .filter((item) => item.nome_base.length > 0);
}

function normalizarPassosIA(valor: unknown): PassoIA[] {
  if (!Array.isArray(valor)) return [];

  return valor
    .filter(isRecord)
    .map((item) => ({
      titulo: normalizarString(item.titulo),
      descricao: normalizarString(item.descricao),
      dica_do_chef: normalizarString(item.dica_do_chef),
      tempo_timer_minutos: normalizarNumero(item.tempo_timer_minutos),
    }))
    .filter((item) => item.titulo.length > 0 || item.descricao.length > 0);
}

function normalizarReceitaIA(payload: unknown): ReceitaIAResponse {
  if (!isRecord(payload)) {
    throw new Error("Resposta da IA em formato inválido.");
  }

  return {
    nome_receita: normalizarString(payload.nome_receita, IA_RECEITA_DEFAULTS.NOME),
    tempo_preparo: normalizarString(payload.tempo_preparo, IA_RECEITA_DEFAULTS.TEMPO_PREPARO),
    dificuldade: normalizarString(payload.dificuldade, IA_RECEITA_DEFAULTS.DIFICULDADE),
    calorias: normalizarString(payload.calorias, IA_RECEITA_DEFAULTS.CALORIAS),
    dica_rapida: normalizarString(payload.dica_rapida),
    descricao_simples_preparo: normalizarString(
      payload.descricao_simples_preparo,
      IA_RECEITA_DEFAULTS.DESCRICAO,
    ),
    pre_visualizacao_passos: normalizarListaStrings(
      payload.pre_visualizacao_passos,
    ),
    ingredientes: normalizarIngredientesIA(payload.ingredientes),
    passos_detalhados: normalizarPassosIA(payload.passos_detalhados),
    tags: normalizarListaStrings(payload.tags),
    preferencias: normalizarListaStrings(payload.preferencias),
    alergias_presentes: normalizarListaStrings(payload.alergias_presentes),
    imagem_base64: normalizarString(payload.imagem_base64) || undefined,
  };
}

// Função principal para extrair e normalizar a receita da resposta bruta da IA
export function extrairReceitaIAParseada(
  rawString: string,
): ReceitaIAParseResult {
  const textoLimpo = limparJSONIA(rawString);
  const payload = JSON.parse(textoLimpo) as unknown;

  if (!isRecord(payload)) {
    throw new Error("Resposta da IA sem objeto JSON válido.");
  }

  const wrapper = payload as Partial<ReceitaIAJsonResponse> &
    Record<string, unknown>;

  const receitaPayload = isRecord(wrapper.texto_da_receita)
    ? wrapper.texto_da_receita
    : payload;

  const receita = normalizarReceitaIA(receitaPayload);
  const imagePrompt =
    typeof wrapper.image_prompt === "string" && wrapper.image_prompt.trim()
      ? wrapper.image_prompt.trim()
      : null;

  return { receita, imagePrompt };
}

// Monta a lista de ingredientes selecionados para o prompt
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

// Monta a lista de ingredientes livres para o prompt
export function obterListaIngredientesLivresParaPrompt(): string {
  const unicos = [
    ...new Set(INGREDIENTES_LIVRES.map((s) => s.trim().toLowerCase())),
  ].sort();
  return unicos.join(", ");
}

// Monta as categorias de ingredientes para o prompt
export function obterCategoriasIngredientesPorAlfabeto(
  ingredients: Ingredient[],
): CategoriaIngredienteIA[] {
  if (!ingredients?.length) return [];

  const grupos: Record<string, Ingredient[]> = {};

  const ingredientesDisponiveis = ingredients.filter((ing) => (ing.qty || 0) > 0);
  const ingredientesOrdenados = [...ingredientesDisponiveis].sort((a, b) =>
    a.name.localeCompare(b.name, "pt-BR", { sensitivity: "base" }),
  );

  ingredientesOrdenados.forEach((ing) => {
    const primeiraLetra = ing.name.charAt(0).toUpperCase();
    const categoria = /^[A-ZÀ-Ú]$/.test(primeiraLetra) ? primeiraLetra : "#";

    if (!grupos[categoria]) {
      grupos[categoria] = [];
    }
    grupos[categoria].push(ing);
  });

  return Object.keys(grupos)
    .sort((a, b) => {
      if (a === "#") return 1;
      if (b === "#") return -1;
      return a.localeCompare(b, "pt-BR");
    })
    .map((titulo) => ({
      titulo,
      itens: grupos[titulo],
    }));
}

// Filtra as categorias de ingredientes por busca
export function filtrarCategoriasPorBusca(
  categorias: CategoriaIngredienteIA[],
  busca: string,
): CategoriaIngredienteIA[] {
  const termo = busca.toLowerCase().trim();
  if (!termo) return categorias;

  return categorias
    .map((cat) => ({
      ...cat,
      itens: cat.itens.filter((ing) =>
        ing.name.toLowerCase().includes(termo),
      ),
    }))
    .filter((cat) => cat.itens.length > 0);
}

// Monta o contexto de segurança para o prompt, incluindo alergias e preferências do usuário
function montarBlocoSegurancaPerfil(ctx: ContextoSegurancaPrompt): string {
  const linhas: string[] = [];

  if (ctx.chavesAlergiaUsuario.length > 0) {
    const texto = ctx.chavesAlergiaUsuario
      .map(
        (k) =>
          ALLERGY_OPTIONS.find((o) => o.key === k)?.label?.toLowerCase() || k,
      )
      .join(", ");
    linhas.push(PROMPT_TEMPLATES.BLOCO_ALERGIAS(texto));
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
    linhas.push(PROMPT_TEMPLATES.BLOCO_PREFERENCIAS(texto));
  }

  if (linhas.length === 0) return "";
  return `\n${linhas.join("\n\n")}\n`;
}

// Monta o prompt de criação de receita com IA, incluindo regras de estoque e segurança
export function montarPromptGeracaoReceitaIA(
  ingredientesComEstoque: IngredienteSelecionadoParaPrompt[],
  contextoUsuario?: ContextoSegurancaPrompt | null,
): string {
  const listaLivres = obterListaIngredientesLivresParaPrompt();

  const blocoPerfil = contextoUsuario
    ? montarBlocoSegurancaPerfil(contextoUsuario)
    : "";

  // Monta o bloco de estoque detalhado para o prompt, incluindo regras claras de quantidade e unidade
  const blocoEstoque = ingredientesComEstoque
    .map((ing) => PROMPT_TEMPLATES.BLOCO_ESTOQUE(ing.nome, ing.quantidadeDisponivel, ing.unidade))
    .join("\n");

  // Retorna o prompt formatado com os parâmetros específicos
  return PROMPT_GERAR_RECEITA_IA(listaLivres, blocoPerfil, blocoEstoque);
}