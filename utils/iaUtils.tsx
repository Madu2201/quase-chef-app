import { Flame, Leaf, RotateCcw, Sparkles, Utensils, Zap } from "lucide-react-native";
import React from "react";

// Meus imports
import { INGREDIENTES_LIVRES } from "../constants/ingredients";
import { ALLERGY_OPTIONS, FOOD_PREFERENCE_OPTIONS } from "../constants/OpcaoAlimentar";
import { Colors } from "../constants/theme";
import type { Ingredient } from "../types/despensa";
import type {
  CategoriaIngredienteIA, ContextoSegurancaPrompt, IngredienteIA,
  IngredienteSelecionadoParaPrompt, PassoIA, ReceitaIAJsonResponse,
  ReceitaIAParseResult, ReceitaIAResponse,
} from "../types/ia";

// Cria o icone da categoria
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
    nome_receita: normalizarString(payload.nome_receita, "Receita Surpresa"),
    tempo_preparo: normalizarString(payload.tempo_preparo, "30min"),
    dificuldade: normalizarString(payload.dificuldade, "Média"),
    calorias: normalizarString(payload.calorias, "N/A"),
    dica_rapida: normalizarString(payload.dica_rapida),
    descricao_simples_preparo: normalizarString(
      payload.descricao_simples_preparo,
      "Sem descrição",
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

  // Monta o prompt completo com regras de ingredientes, estoque e segurança
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

REGRAS OBRIGATÓRIAS DE RESPOSTA (JSON WRAPPER COM DUAS CHAVES):

ESTRUTURA ESPERADA:
{
  "texto_da_receita": { ... campos de receita abaixo ... },
  "image_prompt": "... prompt em inglês para geração de imagem ..."
}

CAMPOS DA RECEITA (dentro de "texto_da_receita"):
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
      "quantidade_gramas_ml": number (OBRIGATÓRIO. Este campo NUNCA deve ser nulo, vazio ou omitido. Ele é o motor de conversão do sistema. Siga estritamente estas regras:
        1. Se a receita indicar peso ou volume explícito (ex: "300g de arroz", "50ml de óleo"): preencha com o valor numérico puro em gramas ou ml (ex: 300.0, 50.0).
        2. Se a receita usar medidas caseiras ou volumes culinários (ex: "xícara", "colher", "copo"): Converta OBRIGATORIAMENTE para o peso/volume equivalente aproximado em gramas ou ml (ex: "1 xícara de arroz" vira 200.0; "2 xícaras de água" vira 480.0; "1 colher de sopa de açúcar" vira 15.0). JAMAIS use 0.0 para medidas caseiras.
        3. Se a receita pedir unidades físicas soltas ou itens a gosto (ex: "3 batatas", "1 dente de alho", "sal a gosto"): preencha ESTREITAMENTE com 0.0 para indicar que é um item contável. O valor 0.0 aqui NÃO exclui o ingrediente.
        * Formatação: JAMAIS retorne números com ponto final solto como '0.' ou '1.'. Use sempre o formato decimal completo como '0.0', '1.0' ou '250.0').
  }.
9. passos_detalhados: Lista de objetos { "titulo": string, "descricao": string, "dica_do_chef": string, "tempo_timer_minutos": number }. No campo "descricao" evite textos muitos longos para evitar desinteresse no usuário.
    REGRAS PARA TIMER: tempo_timer_minutos DEVE SER 0 para ações manuais (picar, mexer, montar). Use > 0 apenas para fogo, forno ou espera.
10. tags: Lista de strings. Escolha APENAS entre: ["Salgadas", "Doces", "Rápidas", "Saudáveis", "Econômicas", "Lanches", "Jantar", "Almoço"].
11. preferencias: Lista de strings. Escolha APENAS entre: ["vegano", "vegetariano", "sem_gluten", "sem_lactose", "baixo_carboidrato", "sem_acucar"]. Retorne [] se não aplicar.
12. alergias_presentes: Lista de strings. Escolha APENAS entre: ["amendoim", "nozes", "leite", "ovo", "soja", "trigo", "gergelim", "frutos_do_mar"]. Retorne [] se for livre de alérgenos.

CAMPO "image_prompt" (ESPECIALISTA EM FOOD PHOTOGRAPHY):
You are an expert AI prompt engineer specializing in Midjourney and Stable Diffusion for professional food photography. Your task is to take a traditional Brazilian dish or dessert and transform it into a highly detailed, professional, English image generation prompt. Make sure to remain faithful to the authentic Brazilian ingredients (e.g., if it's brigadeiro, it must use chocolate sprinkles, not nuts or powdered sugar). Strictly follow this structure for the output prompt: "Ultra-realistic, professional food photography of [detailed description of the food], [description of ingredients/textures]. Macro photography, extreme close-up, highly detailed, showcasing the intricate texture of [specific elements]. Flawless food styling, elegant and gourmet presentation on a minimalist [type of plate/surface]. Soft, warm studio lighting, shallow depth of field, captivating bokeh background. Mouth-watering, appetizing, high resolution, award-winning food photography."

Retorne APENAS o JSON com as duas chaves (texto_da_receita e image_prompt), sem markdown ou explicações.`;
}