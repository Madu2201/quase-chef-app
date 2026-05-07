// TIPOS PARA DETALHE DA RECEITA
export interface Ingrediente {
  id: string;
  nome: string;
  status: "ok" | "faltando";
}

// TIPOS PARA PASSOS
export interface PassoPreparo {
  titulo: string;
  descricao: string;
  dica: string;
  hasTimer: boolean;
  tempoTimer: number;
}

// TIPOS PARA INFO CARD
export interface InfoCardProps {
  icon: React.ComponentType<{ size: number; color: string }>;
  label: string;
  value: string;
}

/**
 * Representa os dados brutos recebidos do Supabase
 * Estrutura exata da tabela de receitas
 */
export interface ReceitaBancoDados {
  id: number;
  nome_receita: string;
  descricao_simples_preparo: string;
  tempo_preparo: string;
  dificuldade: string;
  calorias: string;
  imagem_url: string;
  ingredientes: any[];
  passos_detalhados: any[];
  pre_visualizacao_passos?: string[];
  tags?: string[];
  dica_rapida?: string;
  eh_ia?: boolean;
  preferencias?: string[];
  alergias_presentes?: string[];
}

// TIPOS PARA RECEITA DETALHADA
export interface ReceitaDetalhada {
  titulo: string;
  descricao: string;
  tempo: string;
  dificuldade: string;
  calorias: string;
  imagem: string;
  itensCount: number;
  dica_rapida: string;
  pre_visualizacao?: string[];
  ingredientes: Ingrediente[];
  preparo: PassoPreparo[];
}
