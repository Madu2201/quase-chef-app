export interface Ingredient {
  id: string;
  name: string;
  qty: number;        // Agora como número para facilitar cálculos
  ideal_qty: number;  // A nossa META mensal
  unit: string;
  selected: boolean;
}

export type EditField = "quantidade" | "quantidade_ideal" | "unidade";

export interface DispensaContextData {
  ingredients: Ingredient[];
  filteredIngredients: Ingredient[];
  searchText: string;
  setSearchText: (text: string) => void;
  addIngredient: (nome: string, qtd: number, ideal_qtd: number, unidade: string) => Promise<void>;
  toggleIngredient: (id: string) => Promise<void>;
  removeIngredient: (id: string) => Promise<void>;
  editIngredient: (id: string, field: EditField, value: any) => Promise<void>;
  updateIngredientFull: (id: string, name: string, qty: number, ideal_qty: number, unit: string) => Promise<void>;
  selectedCount: number;
  isLoading: boolean;
  buscarDispensa: () => Promise<void>;
}