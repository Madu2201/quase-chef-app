import { LucideIcon } from "lucide-react-native";
import type { Recipe } from "../types/receitas";

// Tipo para os chips de categorias
export interface ChipItem {
    label: string;
    icon: LucideIcon;
}

/// Estrutura para o contexto de favoritos
export interface FavoritosContextData {
    favoritosIds: string[];
    favoritosIA: Recipe[];
    savedIAReceitaMap: Record<string, string>;
    isFavorito: (id: string | number) => boolean;
    toggleFavorito: (id: string | number, receitaData?: Recipe) => Promise<void>;
    carregandoFavoritos: boolean;
}