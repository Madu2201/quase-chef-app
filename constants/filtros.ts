import {
    LayoutGrid, Utensils, IceCream, Zap,
    Activity, Banknote, Sparkles
} from "lucide-react-native";
import { ChipItem } from "../types/favoritos";

// A base que se repete em ambas as telas
export const BASE_CHIPS: ChipItem[] = [
    { label: "Todas", icon: LayoutGrid },
    { label: "Salgadas", icon: Utensils },
    { label: "Doces", icon: IceCream },
    { label: "Rápidas", icon: Zap },
    { label: "Saudáveis", icon: Activity },
    { label: "Econômicas", icon: Banknote },
];

// O chip específico de IA
export const IA_CHIP: ChipItem = { label: "IA", icon: Sparkles };