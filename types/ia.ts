// Define a estrutura de um passo da receita
export interface PassoIA {
  titulo: string;
  descricao: string;
  dica_do_chef?: string;
  tempo_timer_minutos: number;
}

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

// Define a estrutura das categorias para a listagem
export interface CategoriaIA {
  titulo: string;
  icon: string;
  itens: string[];
}
