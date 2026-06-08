import type { EditForm } from "./lista";

// Tipos de ingrediente
export interface Ingredient {
  id: string;
  name: string;
  qty: number;
  ideal_qty: number;
  unit: string;
  selected: boolean;
}

// Tipos relacionados ao formulário de edição
export interface DetalhesIgnorado {
  nome: string;
  motivo: 'incompativel' | 'nao_encontrado' | 'baixa_confianca' | 'livre';
  detalhes?: string;
}

// Tipos relacionados ao abatimento
export interface AbatimentoResultado {
  sucesso: boolean;
  abatidos: number;
  ignoradosIncompativeis: number;
  ignoradosNaoEncontrados: number;
  ignoradosBaixaConfianca: number;
  ignoradosLivres: number;
  ignoradosDetalhes: DetalhesIgnorado[];
  mensagem?: string;
}

// Contexto da despensa
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

// Tipos relacionados ao hook da tela
export interface DespensaScreenHookData {
  filteredIngredients: Ingredient[];
  searchText: string;
  setSearchText: (text: string) => void;
  handleAdd: () => Promise<void>;
  nomeNovo: string;
  setNomeNovo: (value: string) => void;
  qtdNova: string;
  setQtdNova: (value: string) => void;
  metaNova: string;
  setMetaNova: (value: string) => void;
  unidadeNova: string;
  setUnidadeNova: (value: string) => void;
  showUnitPickerNew: boolean;
  setShowUnitPickerNew: (value: boolean) => void;
  isAddingIngredient: boolean;
  activeInput: string | null;
  setActiveInput: (value: string | null) => void;
  editingId: string | null;
  setEditingId: (value: string | null) => void;
  editForm: EditForm;
  setEditForm: (form: EditForm) => void;
  showUnitPickerEdit: boolean;
  setShowUnitPickerEdit: (value: boolean) => void;
  startEditing: (item: Ingredient) => void;
  saveEdit: (form?: EditForm) => void;
  showMetaHelp: () => void;
  toggleIngredient: (id: string) => Promise<void>;
  removeIngredient: (id: string) => Promise<void>;
  selectedCount: number;
  selectedIngredientIds: string[];
  isLoading: boolean;
}

// Tipos relacionados ao formulário de edição
export interface DespensaUpdatePayload {
  id: string;
  quantidade: number;
  unidade: string;
  selected: boolean;
}