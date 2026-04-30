import { useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";

//Meus imports
import { RECEITA_STRINGS } from "../constants/ingredients";
import { buscarReceitaPorId } from "../services/receitaService";
import type {
    ReceitaBancoDados,
    ReceitaDetalhada,
} from "../types/detalhe_receita";
import { criarReceitaIA } from "../utils/receitaIAUtils";
import {
    formatarTempo,
    processarIngredientes,
    processarPassosPreparo,
} from "../utils/receitaUtils";
import type { Recipe } from "./useReceitas";

interface UseDetalheReceitaReturn {
  receitaDetalhada: ReceitaDetalhada;
  receitaFavoritoIA: Recipe | undefined;
  isIA: boolean;
  receitaId: string;
  isLoading: boolean;
  erro: string | null;
}

/**
 * Hook Central para Buscar Dados de Receita
 *
 * REGRA 1: Todos os hooks (useState, useEffect, useMemo) NO TOPO
 * REGRA 2: ZERO early returns antes da declaração de hooks
 * REGRA 3: isMounted tracking em useEffect com fetch
 */
export const useDetalheReceita = (): UseDetalheReceitaReturn => {
  // ============================================
  // REGRA 1: HOOKS NO TOPO ABSOLUTO
  // ============================================

  const params = useLocalSearchParams();

  // Estados
  const [receitaBancoDados, setReceitaBancoDados] =
    useState<ReceitaBancoDados | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  // ============================================
  // REGRA 3: Fetch com isMounted tracking
  // ============================================
  useEffect(() => {
    let isMounted = true;

    async function buscarDados() {
      const receitaId = params.id as string | undefined;
      const tipo = params.tipo as string | undefined;
      const isNumericId = receitaId ? !isNaN(Number(receitaId)) : false;

      // Busca no banco quando temos um ID numérico (inclusive receitas IA persistidas)
      if (!receitaId || !isNumericId) {
        if (isMounted) {
          setReceitaBancoDados(null);
          setIsLoading(false);
        }
        return;
      }

      if (isMounted) {
        setIsLoading(true);
        setErro(null);
      }

      try {
        const dados = await buscarReceitaPorId(receitaId);

        if (isMounted) {
          if (dados) {
            setReceitaBancoDados(dados);
            setErro(null);
          } else {
            setErro("Receita não encontrada no banco de dados");
            setReceitaBancoDados(null);
          }
        }
      } catch (err) {
        if (isMounted) {
          console.error("Erro ao buscar receita:", err);
          setErro("Erro ao carregar receita");
          setReceitaBancoDados(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    buscarDados();

    return () => {
      isMounted = false;
    };
  }, [params.id, params.tipo]);

  // ============================================
  // Processamento de dados (sem early returns)
  // ============================================

  // Determina qual é o ID da receita
  const receitaId = useMemo(() => {
    const id = params.id as string | undefined;
    return id || `ia-${Date.now()}`;
  }, [params.id]);

  // Determina se é receita IA
  const isIA = useMemo(() => {
    return params.tipo === "ia" || receitaBancoDados?.eh_ia === true;
  }, [params.tipo, receitaBancoDados?.eh_ia]);

  // Processa dados da receita
  // Prioridade: 1) Dados do banco 2) Params diretos 3) Fallback vazio
  const receitaDetalhada: ReceitaDetalhada = useMemo(() => {
    if (receitaBancoDados) {
      // Dados do banco de dados
      const ingredientes = processarIngredientes(
        JSON.stringify(receitaBancoDados.ingredientes || []),
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
        itensCount: ingredientes.length,
        dicaIA: receitaBancoDados.dicaIA || RECEITA_STRINGS.DICA_IA_PADRAO,
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
      const ingredientes = processarIngredientes(params.ingredients as string);
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
        itensCount: ingredientes.length,
        dicaIA: (params.dicaIA as string) || RECEITA_STRINGS.DICA_IA_PADRAO,
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
  }, [receitaBancoDados, params]);

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
    });
  }, [
    isIA,
    receitaId,
    receitaDetalhada,
    receitaBancoDados?.ingredientes,
    receitaBancoDados?.passos_detalhados,
    params.ingredients,
    params.steps,
  ]);

  // ============================================
  // RETORNO (sem early returns antes daqui)
  // ============================================
  return {
    receitaDetalhada,
    receitaFavoritoIA,
    isIA,
    receitaId,
    isLoading,
    erro,
  };
};
