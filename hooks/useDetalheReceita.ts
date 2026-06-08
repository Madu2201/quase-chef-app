import { useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";

//Meus imports
import { IA_PATTERNS } from "../constants/ia";
import { RECEITA_STRINGS } from "../constants/ingredients";
import { buscarReceitaPorId } from "../services/receitaService";
import type { ReceitaBancoDados, ReceitaDetalhada, UseDetalheReceitaReturn } from "../types/detalhe_receita";
import type { Recipe } from "../types/receitas";
import { criarReceitaIA } from "../utils/receitaIAUtils";
import { formatarTempo, processarIngredientes, processarPassosPreparo } from "../utils/receitaUtils";
import { useDespensa } from "./useDespensa";
import { useNetworkStatus } from "./useNetworkStatus";

function parseListaStringsParam(valor: unknown): string[] {
  if (Array.isArray(valor)) {
    return valor.filter(Boolean).map((item) => String(item));
  }

  if (typeof valor !== "string" || !valor.trim()) {
    return [];
  }

  try {
    const parsed = JSON.parse(valor);
    return Array.isArray(parsed)
      ? parsed.filter(Boolean).map((item) => String(item))
      : [];
  } catch {
    return [];
  }
}

// Hook para gerenciar o estado e lógica de detalhes da receita, incluindo dados do banco, processamento de ingredientes/preparo, e integração com receitas de IA
export const useDetalheReceita = (): UseDetalheReceitaReturn => {
  const params = useLocalSearchParams();
  const [receitaBancoDados, setReceitaBancoDados] =
    useState<ReceitaBancoDados | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const { ingredients: despensa } = useDespensa();
  const { isOffline } = useNetworkStatus();
  const retryReceita = useCallback(async () => {
    const receitaId = params.id as string | undefined;
    const isNumericId = receitaId ? !isNaN(Number(receitaId)) : false;

    // Busca no banco quando temos um ID numérico (inclusive receitas IA persistidas)
    if (!receitaId || !isNumericId) {
      setReceitaBancoDados(null);
      setErro(null);
      setIsLoading(false);
      return;
    }

    if (isOffline) {
      setReceitaBancoDados(null);
      setErro("Você está sem internet. Reconecte-se para carregar esta receita.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setErro(null);

    try {
      const dados = await buscarReceitaPorId(receitaId);

      if (dados) {
        setReceitaBancoDados(dados);
        setErro(null);
      } else {
        setErro("Não foi possível carregar esta receita agora. Tente novamente.");
        setReceitaBancoDados(null);
      }
    } catch (err) {
      console.error("Erro ao buscar receita:", err);
      setErro("Não foi possível carregar esta receita agora. Tente novamente.");
      setReceitaBancoDados(null);
    } finally {
      setIsLoading(false);
    }
  }, [isOffline, params.id]);

  useEffect(() => {
    void retryReceita();
  }, [retryReceita, params.tipo]);

  // Determina qual é o ID da receita
  const receitaId = useMemo(() => {
    const id = params.id as string | undefined;
    return id || `${IA_PATTERNS.id_prefix}${Date.now()}`;
  }, [params.id]);

  // Determina se é receita IA
  const isIA = useMemo(() => {
    return params.tipo === "ia" || receitaBancoDados?.eh_ia === true;
  }, [params.tipo, receitaBancoDados?.eh_ia]);

  const preferenciasReceita = useMemo(() => {
    if (receitaBancoDados) {
      return receitaBancoDados.preferencias || [];
    }
    return parseListaStringsParam(params.preferencias);
  }, [receitaBancoDados, params.preferencias]);

  const alergiasReceita = useMemo(() => {
    if (receitaBancoDados) {
      return receitaBancoDados.alergias_presentes || [];
    }
    return parseListaStringsParam(params.alergias);
  }, [receitaBancoDados, params.alergias]);

  const tagsReceita = useMemo(() => {
    if (receitaBancoDados?.tags?.length) {
      return receitaBancoDados.tags;
    }
    return parseListaStringsParam(params.tags);
  }, [receitaBancoDados?.tags, params.tags]);

  // Dados processados para exibição, combinando informações do banco e dos params (para casos de navegação direta ou receitas IA sem persistência)
  const receitaDetalhada: ReceitaDetalhada = useMemo(() => {
    if (receitaBancoDados) {
      // Dados do banco de dados
      const ingredientes = processarIngredientes(
        JSON.stringify(receitaBancoDados.ingredientes || []),
        despensa,
      );
      const preparo = processarPassosPreparo(
        JSON.stringify(receitaBancoDados.passos_detalhados || []),
      );

      return {
        titulo:
          receitaBancoDados.nome_receita ||
          RECEITA_STRINGS.RECEITA_DESCONHECIDA,
        descricao:
          receitaBancoDados.descricao_simples_preparo ||
          RECEITA_STRINGS.DESCRICAO_INDISPONIVEL,
        tempo: formatarTempo(
          receitaBancoDados.tempo_preparo ||
          `${RECEITA_STRINGS.VALOR_PADRAO} min`,
        ),
        dificuldade:
          receitaBancoDados.dificuldade || RECEITA_STRINGS.VALOR_PADRAO,
        calorias:
          receitaBancoDados.calorias || `${RECEITA_STRINGS.VALOR_PADRAO} kcal`,
        imagem: receitaBancoDados.imagem_url || RECEITA_STRINGS.IMAGEM_PADRAO,
        itensCount: ingredientes.filter((item) => item.status === "faltando")
          .length,
        dica_rapida: receitaBancoDados.dica_rapida || "",
        pre_visualizacao: receitaBancoDados.pre_visualizacao_passos || [],
        ingredientes:
          ingredientes.length > 0
            ? ingredientes
            : [
              {
                id: "1",
                nome: RECEITA_STRINGS.SEM_INGREDIENTES,
                status: "faltando" as const,
              },
            ],
        preparo:
          preparo.length > 0
            ? preparo
            : [
              {
                titulo: "Siga sua intuição",
                descricao: RECEITA_STRINGS.SEM_PASSOS,
                dica: "",
                hasTimer: false,
                tempoTimer: 0,
              },
            ],
      };
    } else {
      // Fallback: dados dos params (para recepção diretas ou navegação com dados)
      const ingredientes = processarIngredientes(
        params.ingredients as string,
        despensa,
      );
      const preparo = processarPassosPreparo(params.steps as string);

      return {
        titulo:
          (params.title as string) || RECEITA_STRINGS.RECEITA_DESCONHECIDA,
        descricao:
          (params.description as string) ||
          RECEITA_STRINGS.DESCRICAO_INDISPONIVEL,
        tempo: formatarTempo(
          (params.time as string) || `${RECEITA_STRINGS.VALOR_PADRAO} min`,
        ),
        dificuldade:
          (params.difficulty as string) || RECEITA_STRINGS.VALOR_PADRAO,
        calorias:
          (params.calories as string) || `${RECEITA_STRINGS.VALOR_PADRAO} kcal`,
        imagem: (params.image as string) || RECEITA_STRINGS.IMAGEM_PADRAO,
        itensCount: ingredientes.filter((item) => item.status === "faltando")
          .length,
        dica_rapida: (params.dica_rapida as string) || "",
        pre_visualizacao: parseListaStringsParam(params.pre_visualizacao),
        ingredientes:
          ingredientes.length > 0
            ? ingredientes
            : [
              {
                id: "1",
                nome: RECEITA_STRINGS.SEM_INGREDIENTES,
                status: "faltando" as const,
              },
            ],
        preparo:
          preparo.length > 0
            ? preparo
            : [
              {
                titulo: "Siga sua intuição",
                descricao: RECEITA_STRINGS.SEM_PASSOS,
                dica: "",
                hasTimer: false,
                tempoTimer: 0,
              },
            ],
      };
    }
  }, [receitaBancoDados, params, despensa]);

  // Dados para receita de IA (se aplicável)
  const receitaFavoritoIA: Recipe | undefined = useMemo(() => {
    if (!isIA) return undefined;

    const rawIngredients = receitaBancoDados?.ingredientes
      ? JSON.stringify(receitaBancoDados.ingredientes)
      : (params.ingredients as string) || "[]";
    const rawSteps = receitaBancoDados?.passos_detalhados
      ? JSON.stringify(receitaBancoDados.passos_detalhados)
      : (params.steps as string) || "[]";

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
      tags: tagsReceita.length > 0 ? tagsReceita : ["IA"],
      dica_rapida: receitaDetalhada.dica_rapida,
      pre_visualizacao: receitaDetalhada.pre_visualizacao,
      preferences: preferenciasReceita,
      recipeAllergies: alergiasReceita,
    });
  }, [
    isIA,
    receitaId,
    receitaDetalhada,
    receitaBancoDados?.ingredientes,
    receitaBancoDados?.passos_detalhados,
    params.ingredients,
    params.steps,
    tagsReceita,
    preferenciasReceita,
    alergiasReceita,
  ]);

  const rawIngredientsPreparo = useMemo(() => {
    if (receitaBancoDados?.ingredientes) {
      return JSON.stringify(receitaBancoDados.ingredientes);
    }

    return (params.ingredients as string) || "[]";
  }, [receitaBancoDados?.ingredientes, params.ingredients]);

  const rawStepsPreparo = useMemo(() => {
    if (receitaBancoDados?.passos_detalhados) {
      return JSON.stringify(receitaBancoDados.passos_detalhados);
    }

    return (params.steps as string) || "[]";
  }, [receitaBancoDados?.passos_detalhados, params.steps]);

  return {
    receitaDetalhada,
    receitaFavoritoIA,
    rawIngredientsPreparo,
    rawStepsPreparo,
    isIA,
    receitaId,
    isLoading,
    erro,
    retryReceita,
    preferenciasReceita,
    alergiasReceita,
  };
};