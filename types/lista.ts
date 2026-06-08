/// Tipos relacionados à lista de compras
export interface CompraItem {
  id: string;
  user_id: string;
  nome: string;
  quantidade_comprar: number;
  unidade: string;
  comprado: boolean;
  created_at?: string;
}

/// Tipos relacionados ao formulário de edição
export interface EditForm {
  name: string;
  qty: string;
  ideal_qty: string;
  unit: string;
}

// Tipos relacionados ao upsert inteligente
export type UpsertAction = "INSERT" | "UPDATE" | "UPDATE_COM_AVISO";

export interface UpsertDecision {
  acao: UpsertAction;
  novoValor: number;
  unidadeFinal: string;
}

// Contexto da lista de compras
export interface ListaContextData {
  // Estado
  pendentes: CompraItem[];
  comprados: CompraItem[];
  isLoading: boolean;
  isGeneratingList: boolean;
  // Operações básicas
  addItem: (nome: string, qtd: string, unidade: string) => Promise<void>;
  toggleItem: (id: string) => Promise<void>;
  removerItem: (id: string) => Promise<void>;
  limparComprados: () => Promise<void>;
  // Operações avançadas
  gerarListaDaDespensa: () => Promise<void>;
  guardarNoEstoque: (
    onUpsert: (nome: string, qtd: number, unit: string) => Promise<boolean>,
  ) => Promise<void>;
  atualizarQuantidade: (id: string, novaQuantidade: number) => Promise<void>;
  compartilharLista: () => Promise<void>;
}