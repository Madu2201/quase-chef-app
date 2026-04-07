import { Leaf, Wheat, Milk, Drumstick, Candy, Nut, Egg, Fish } from "lucide-react-native";
import { OptionItem } from "../types/auth";

// Tipagem para os itens de opções

// Preferência alimentar
export const FOOD_PREFERENCE_OPTIONS: OptionItem[] = [
    { key: "vegano", label: "Vegana", icon: Leaf },
    { key: "vegetariano", label: "Vegetariana", icon: Leaf },
    { key: "sem_gluten", label: "Sem glúten", icon: Wheat },
    { key: "sem_lactose", label: "Sem lactose", icon: Milk },
    { key: "baixo_carboidrato", label: "Baixo carbo", icon: Drumstick },
    { key: "sem_acucar", label: "Sem açúcar", icon: Candy },
];

// Alergia alimentar
export const ALLERGY_OPTIONS: OptionItem[] = [
    { key: "amendoim", label: "Amendoim", icon: Nut },
    { key: "nozes", label: "Nozes", icon: Nut },
    { key: "leite", label: "Leite", icon: Milk },
    { key: "ovo", label: "Ovo", icon: Egg },
    { key: "soja", label: "Soja", icon: Leaf },
    { key: "trigo", label: "Trigo", icon: Wheat },
    { key: "gergelim", label: "Gergelim", icon: Wheat },
    { key: "frutos_do_mar", label: "Frutos do mar", icon: Fish },
];