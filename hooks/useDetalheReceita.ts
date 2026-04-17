import { useLocalSearchParams } from "expo-router";
import { useMemo } from "react";
import { RECEITA_STRINGS } from "../constants/ingredients";
import type { ReceitaDetalhada } from "../types/detalhe_receita";
import { criarReceitaIA } from "../utils/receitaIAUtils";
import { formatarTempo, processarIngredientes, processarPassosPreparo } from "../utils/receitaUtils";
import { useFavoritosGlobal } from "./useFavoritos";
import type { Recipe } from "./useReceitas";
import { useReceitas } from "./useReceitas";
import { useRecipeById } from "./useRecipeById";

const getStringParam = (value: any): string => {
    if (typeof value === "string") return value;
    if (Array.isArray(value)) return value[0] ?? "";
    return "";
};

export const useDetalheReceita = () => {
    const params = useLocalSearchParams();
    const { receitasBanco, carregando } = useReceitas();
    const { favoritosIA, carregandoFavoritos } = useFavoritosGlobal();

    const receitaId = getStringParam(params.id) || `ia-${Date.now()}`;
    const tipoParam = getStringParam(params.tipo);

    const preview = useMemo(() => ({
        title: getStringParam(params.title),
        image: getStringParam(params.image),
        time: getStringParam(params.time),
        difficulty: getStringParam(params.difficulty),
        description: getStringParam(params.description),
        calories: getStringParam(params.calories),
        dicaIA: getStringParam(params.dicaIA),
        ingredients: getStringParam(params.ingredients),
        steps: getStringParam(params.steps),
        tipo: tipoParam,
    }), [params, tipoParam]);

    const { recipe: receitaOrigem, isLoading: isRecipeLoading } = useRecipeById(getStringParam(params.id));

    const isIA = tipoParam === "ia" || receitaOrigem?.tipo === "ia";

    const receitaDetalhada: ReceitaDetalhada = useMemo(() => {
        const rawIngredients = receitaOrigem?.rawIngredients ?? preview.ingredients;
        const rawSteps = receitaOrigem?.rawSteps ?? preview.steps;

        const ingredientes = processarIngredientes(rawIngredients);
        const preparo = processarPassosPreparo(rawSteps);

        return {
            titulo: receitaOrigem?.title ?? preview.title ?? RECEITA_STRINGS.RECEITA_DESCONHECIDA,
            descricao: receitaOrigem?.descStart ?? preview.description ?? RECEITA_STRINGS.DESCRICAO_INDISPONIVEL,
            tempo: formatarTempo(receitaOrigem?.time ?? preview.time ?? `${RECEITA_STRINGS.VALOR_PADRAO} min`),
            dificuldade: receitaOrigem?.difficulty ?? preview.difficulty ?? RECEITA_STRINGS.VALOR_PADRAO,
            calorias: receitaOrigem?.calories ?? preview.calories ?? `${RECEITA_STRINGS.VALOR_PADRAO} kcal`,
            imagem: receitaOrigem?.image ?? preview.image ?? RECEITA_STRINGS.IMAGEM_PADRAO,
            itensCount: ingredientes.length,
            dicaIA: preview.dicaIA || RECEITA_STRINGS.DICA_IA_PADRAO,
            ingredientes: ingredientes.length > 0 ? ingredientes : [{
                id: "1",
                nome: RECEITA_STRINGS.SEM_INGREDIENTES,
                status: "faltando" as const,
            }],
            preparo: preparo.length > 0 ? preparo : [{
                titulo: "Siga sua intuição",
                descricao: RECEITA_STRINGS.SEM_PASSOS,
                dica: "",
                hasTimer: false,
                tempoTimer: 0,
            }],
        };
    }, [preview, receitaOrigem]);

    const isLoading = Boolean(
        getStringParam(params.id) &&
        !receitaOrigem &&
        isRecipeLoading &&
        !preview.ingredients &&
        !preview.steps
    );

    const receitaFavoritoIA: Recipe | undefined = useMemo(() => {
        if (!isIA) return undefined;

        const rawIngredients = receitaOrigem?.rawIngredients ?? preview.ingredients ?? "[]";
        const rawSteps = receitaOrigem?.rawSteps ?? preview.steps ?? "[]";

        return criarReceitaIA({
            id: receitaId,
            titulo: receitaDetalhada.titulo,
            time: receitaDetalhada.tempo,
            difficulty: receitaDetalhada.dificuldade,
            description: receitaDetalhada.descricao,
            imagem: receitaDetalhada.imagem,
            calories: receitaDetalhada.calorias,
            rawIngredients,
            rawSteps,
        });
    }, [isIA, receitaDetalhada, receitaId, preview, receitaOrigem]);

    return {
        params,
        receitaDetalhada,
        receitaFavoritoIA,
        isIA,
        receitaId,
        isLoading,
        preview,
    };
};
