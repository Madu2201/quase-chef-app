import { useState, useMemo } from 'react';

/** * Interface que define o "molde" de um ingrediente no sistema.
 * Isso evita erros de propriedades inexistentes.
 */
export interface Ingredient {
    id: string;
    name: string;
    qty: string;
    unit: string;
    selected: boolean;
}

export function useDispensa(initialData: Ingredient[]) {
    // Estado que armazena a lista principal de ingredientes da dispensa
    const [ingredients, setIngredients] = useState<Ingredient[]>(initialData);

    // Estado que controla o texto digitado na barra de busca
    const [searchText, setSearchText] = useState("");

    /**
     * filteredIngredients: Memoriza a lista filtrada.
     * O useMemo garante que o filtro só seja reprocessado se o texto 
     * de busca ou a lista de ingredientes mudar, economizando performance.
     */
    const filteredIngredients = useMemo(() => {
        return ingredients.filter((item: Ingredient) =>
            item.name.toLowerCase().includes(searchText.toLowerCase())
        );
    }, [searchText, ingredients]);

    /**
     * Alterna o estado de seleção (checkbox) de um ingrediente.
     * @param id Identificador único do ingrediente
     */
    const toggleIngredient = (id: string) => {
        setIngredients((prev: Ingredient[]) =>
            prev.map((item: Ingredient) =>
                item.id === id ? { ...item, selected: !item.selected } : item
            )
        );
    };

    /**
     * Remove um ingrediente da lista permanentemente.
     * @param id Identificador único do ingrediente
     */
    const removeIngredient = (id: string) => {
        setIngredients((prev: Ingredient[]) =>
            prev.filter((item: Ingredient) => item.id !== id)
        );
    };

    /**
     * Conta quantos ingredientes estão com 'selected: true'.
     * Usado para mostrar o badge no botão flutuante "Gerar Receitas".
     */
    const selectedCount = ingredients.filter((i: Ingredient) => i.selected).length;

    return {
        searchText,
        setSearchText,
        filteredIngredients,
        toggleIngredient,
        removeIngredient,
        selectedCount,
        setIngredients // Exposto caso precise resetar a lista futuramente
    };
}