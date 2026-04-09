// Define a estrutura de um passo da receita
export interface PassoIA {
  titulo: string;
  descricao: string;
  dica_do_chef?: string;
  tempo_timer_minutos: number;
}

// Define o formato exato que esperamos do JSON da IA
export interface ReceitaIAResponse {
  titulo: string;
  descricao: string;
  tempo: string;
  dificuldade: string;
  calorias: string;
  dicaIA: string;
  ingredientes: string[];
  passos: PassoIA[];
}

// Define a estrutura das categorias para a listagem
export interface CategoriaIA {
  titulo: string;
  icon: string;
  itens: string[];
}
