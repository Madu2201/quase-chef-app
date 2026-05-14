export interface Ingredient {
  id: string;
  name: string;
  qty: number; // Agora como número para facilitar cálculos
  ideal_qty: number; // A nossa META mensal
  unit: string;
  selected: boolean;
}

export interface AbatimentoResultado {
  sucesso: boolean;
  abatidos: number;
  ignoradosIncompativeis: number;
  ignoradosNaoEncontrados: number;
  ignoradosBaixaConfianca: number;
  ignoradosLivres: number;
  mensagem?: string;
}

export interface DespensaContextData {
  ingredients: Ingredient[];
  filteredIngredients: Ingredient[];
  searchText: string;
  setSearchText: (text: string) => void;
  addIngredient: (
    nome: string,
    qtd: number,
    ideal_qtd: number,
    unidade: string,
  ) => Promise<void>;
  toggleIngredient: (id: string) => Promise<void>;
  removeIngredient: (id: string) => Promise<void>;
  updateIngredientFull: (
    id: string,
    name: string,
    qty: number,
    ideal_qty: number,
    unit: string,
  ) => Promise<void>;
  upsertIngredientFromCompra: (
    nome: string,
    qtd: number,
    unidade: string,
  ) => Promise<boolean>;
  abaterIngredientesDaReceita: (
    rawIngredients: string,
  ) => Promise<AbatimentoResultado>;
  selectedCount: number;
  /** Nomes dos ingredientes marcados no checkbox (para IA / prompts). */
  selectedIngredients: string[];
  /** IDs dos itens marcados — preferir para geração IA (estoque inequívoco). */
  selectedIngredientIds: string[];
  isLoading: boolean;
  buscarDespensa: () => Promise<void>;
}
