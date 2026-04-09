import { useLocalSearchParams } from "expo-router";
import { useMemo } from "react";
import { RECEITA_STRINGS } from "../constants/ingredients";
import type { ReceitaDetalhada } from "../types/detalhe_receita";
import { criarReceitaIA } from "../utils/receitaIAUtils";
import { formatarTempo, processarIngredientes, processarPassosPreparo } from "../utils/receitaUtils";
import type { Recipe } from "./useReceitas";

export const useDetalheReceita = () => {
    const params = useLocalSearchParams();

    // Processa dados dos params
    const receitaDetalhada: ReceitaDetalhada = useMemo(() => {
        const ingredientes = processarIngredientes(params.ingredients as string);
        const preparo = processarPassosPreparo(params.steps as string);

        return {
            titulo: (params.title as string) || RECEITA_STRINGS.RECEITA_DESCONHECIDA,
            descricao: (params.description as string) || RECEITA_STRINGS.DESCRICAO_INDISPONIVEL,
            tempo: formatarTempo((params.time as string) || `${RECEITA_STRINGS.VALOR_PADRAO} min`),
            dificuldade: (params.difficulty as string) || RECEITA_STRINGS.VALOR_PADRAO,
            calorias: (params.calories as string) || `${RECEITA_STRINGS.VALOR_PADRAO} kcal`,
            imagem: (params.image as string) || RECEITA_STRINGS.IMAGEM_PADRAO,
            itensCount: ingredientes.length,
            dicaIA: (params.dicaIA as string) || RECEITA_STRINGS.DICA_IA_PADRAO,
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
    }, [params]);

    // Dados para receita de IA (se aplicável)
    const receitaFavoritoIA: Recipe | undefined = useMemo(() => {
        const isIA = params.tipo === "ia";
        if (!isIA) return undefined;

        const receitaId = (params.id as string) || `ia-${Date.now()}`;

        return criarReceitaIA({
            id: receitaId,
            titulo: receitaDetalhada.titulo,
            time: receitaDetalhada.tempo,
            difficulty: receitaDetalhada.dificuldade,
            description: receitaDetalhada.descricao,
            imagem: receitaDetalhada.imagem,
            calories: receitaDetalhada.calorias,
            rawIngredients: (params.ingredients as string) || "[]",
            rawSteps: (params.steps as string) || "[]",
        });
    }, [params, receitaDetalhada]);

    return {
        params,
        receitaDetalhada,
        receitaFavoritoIA,
        isIA: params.tipo === "ia",
        receitaId: (params.id as string) || `ia-${Date.now()}`,
    };
};