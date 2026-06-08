import { Candy, Drumstick, Egg, Fish, Leaf, Milk, Nut, Wheat } from "lucide-react-native";

// Meu import
import { OptionItem } from "../types/auth";

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

// Tratamento de alguns casos comuns e sinônimos
export const ALLERGY_ALIASES: Record<string, string> = {
    soy: "soja",
    tofu: "soja",
    edamame: "soja",
    peanut: "amendoim",
    groundnut: "amendoim",
    shrimp: "frutos_do_mar",
    camarão: "frutos_do_mar",
    camarao: "frutos_do_mar",
    gluten: "trigo",
    wheat: "trigo",
    dairy: "leite",
    milk: "leite",
    egg: "ovo",
    eggs: "ovo",
    sesame: "gergelim",
    shellfish: "frutos_do_mar",
};