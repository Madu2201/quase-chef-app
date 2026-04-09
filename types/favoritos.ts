import { LucideIcon } from "lucide-react-native";
import { Recipe } from "../hooks/useReceitas";

/** Estrutura para os filtros (Chips) da UI */
export interface ChipItem {
    label: string;
    icon: LucideIcon;
}

/** Contrato do Contexto de Favoritos */
export interface FavoritosContextData {
    favoritosIds: string[];         // IDs das receitas do banco (Supabase)
    favoritosIA: Recipe[];          // Objetos completos das receitas geradas por IA
    isFavorito: (id: string | number) => boolean;
    toggleFavorito: (id: string | number, receitaData?: Recipe) => Promise<void>;
    carregandoFavoritos: boolean;
}