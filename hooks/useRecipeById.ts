import { useMemo } from "react";
import { useFavoritosGlobal } from "./useFavoritos";
import type { Recipe } from "./useReceitas";
import { useReceitas } from "./useReceitas";

export const useRecipeById = (id?: string) => {
  const { receitasBanco, carregando } = useReceitas();
  const { favoritosIA, carregandoFavoritos } = useFavoritosGlobal();

  const recipe = useMemo<Recipe | undefined>(() => {
    if (!id) return undefined;
    const idStr = String(id);

    return (
      favoritosIA.find((item) => String(item.id) === idStr) ||
      receitasBanco.find((item) => String(item.id) === idStr)
    );
  }, [id, favoritosIA, receitasBanco]);

  const isLoading = Boolean(id && !recipe && (carregando || carregandoFavoritos));

  return { recipe, isLoading };
};
