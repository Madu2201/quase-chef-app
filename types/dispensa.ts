// Tipos relacionados à gestão da dispensa
export interface Ingredient {
  id: string;
  name: string;
  qty: string;
  unit: string;
  selected: boolean;
}

// Campos permitidos para edição rápida
export type EditField = "quantidade" | "unidade";

export interface DispensaContextData {
  ingredients: Ingredient[];
  filteredIngredients: Ingredient[];
  searchText: string;
  setSearchText: (text: string) => void;
  addIngredient: (nome: string, qtd: string, unidade: string) => Promise<void>;
  toggleIngredient: (id: string) => Promise<void>;
  removeIngredient: (id: string) => Promise<void>;
  editIngredient: (
    id: string,
    field: EditField,
    value: string,
  ) => Promise<void>;
  selectedCount: number;
  isLoading: boolean;
  buscarDispensa: () => Promise<void>;
}
