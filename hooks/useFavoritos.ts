import { useState, useMemo } from 'react';

/**
 * Interface para as receitas favoritadas.
 * 'img' é 'any' pois o require() do React Native retorna uma referência numérica.
 */
export interface Recipe {
    id: string;
    name: string;
    info: string;
    img: any;
}

export function useFavoritos(allRecipes: Recipe[]) {
    // Estado para o texto da barra de busca de favoritos
    const [searchText, setSearchText] = useState("");

    /**
     * Filtra as receitas favoritadas em tempo real.
     * Transforma tudo em minúsculo (toLowerCase) para ignorar diferenças 
     * entre "Bolo" e "bolo".
     */
    const filteredRecipes = useMemo(() => {
        return allRecipes.filter((recipe: Recipe) =>
            recipe.name.toLowerCase().includes(searchText.toLowerCase())
        );
    }, [searchText, allRecipes]);

    return {
        searchText,
        setSearchText,
        filteredRecipes,
    };
}