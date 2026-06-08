import type { Ingredient } from "./despensa";

// Define a estrutura de um passo da receita
export interface PassoIA {
  titulo: string;
  descricao: string;
  dica_do_chef?: string;
  tempo_timer_minutos: number;
}

// Define a estrutura de um ingrediente retornado pela IA
export interface IngredienteIA {
  nome_base: string;
  quantidade: number;
  unidade: string;
  texto_original: string;
  quantidade_gramas_ml: number;
}

// Define o formato exato que esperamos do JSON da IA
export interface ReceitaIAResponse {
  nome_receita: string;
  tempo_preparo: string;
  dificuldade: string;
  calorias: string;
  dica_rapida: string;
  descricao_simples_preparo: string;
  pre_visualizacao_passos: string[];
  ingredientes: IngredienteIA[];
  passos_detalhados: PassoIA[];
  tags: string[];
  preferencias: string[];
  alergias_presentes: string[];
  imagem_base64?: string;
}

// Define o formato exato que esperamos do JSON da IA + image_prompt
export interface ReceitaIAJsonResponse {
  texto_da_receita: ReceitaIAResponse;
  image_prompt?: string;
}

// Define a estrutura das categorias para a listagem
export interface CategoriaIngredienteIA {
  titulo: string;
  itens: Ingredient[];
}

// Define a estrutura de um ingrediente selecionado para o prompt
export type IngredienteSelecionadoParaPrompt = {
  nome: string;
  quantidadeDisponivel: number;
  unidade: string;
};

// Define a estrutura de um contexto de segurança para o prompt
export type ContextoSegurancaPrompt = {
  chavesAlergiaUsuario: string[];
  chavesPreferenciaUsuario: string[];
};

// Define a estrutura da resposta da IA para a geração de receita, incluindo o prompt da imagem
export type ReceitaIAParseResult = {
  receita: ReceitaIAResponse;
  imagePrompt: string | null;
};

// Define a estrutura das categorias para a listagem de receitas IA
export interface CategoriaIA {
  titulo: string;
  icon: string;
  itens: string[];
}