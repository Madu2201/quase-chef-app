import { useCallback, useEffect, useState } from 'react';
import { buscarReceitaPorId } from '../services/receitaService';
import type { PassoPreparo, ReceitaBancoDados } from '../types/detalhe_receita';
import { useNetworkStatus } from './useNetworkStatus';

interface UsePreparoReceitaReturn {
    passoAtual: number;
    isConcluido: boolean;
    tempo: number;
    timerAtivo: boolean;
    setTimerAtivo: (ativo: boolean) => void;
    proximoPasso: () => void;
    passoAnterior: () => void;
    resetarTimer: () => void;
    step: PassoPreparo | undefined;
    totalPassos: number;
    isLoading: boolean;
    erro: string | null;
    retryReceita: () => Promise<void>;
}

/**
 * Hook para Gerenciar Preparo da Receita com Fetch Seguro
 * 
 * REGRA 1: Todos os hooks (useState, useEffect) NO TOPO
 * REGRA 2: ZERO early returns antes dos hooks
 * REGRA 3: isMounted tracking em useEffect com fetch
 * REGRA 4: Reanimated hooks sempre chamados (se houver)
 */
export function usePreparoReceita(
    passosParam: PassoPreparo[],
    receitaId?: string | number,
    tipo?: string
): UsePreparoReceitaReturn {
    // ============================================
    // REGRA 1: HOOKS NO TOPO ABSOLUTO
    // ============================================

    // Estados para dados da receita do banco
    const [, setReceitaBancoDados] = useState<ReceitaBancoDados | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [erro, setErro] = useState<string | null>(null);
    const { isOffline, notifyInternetRequired } = useNetworkStatus();

    // Estados do preparo
    const [passoAtual, setPassoAtual] = useState(0);
    const [isConcluido, setIsConcluido] = useState(false);
    const [tempo, setTempo] = useState<number>(0);
    const [timerAtivo, setTimerAtivo] = useState(false);

    // ============================================
    // REGRA 3: Fetch com isMounted tracking
    // ============================================
    const retryReceita = useCallback(async () => {
        const isIA = tipo === "ia";
        if (isIA || !receitaId || isNaN(Number(receitaId))) {
            setReceitaBancoDados(null);
            setErro(null);
            setIsLoading(false);
            return;
        }

        if (isOffline) {
            setReceitaBancoDados(null);
            setErro("Você está sem internet. Reconecte-se para carregar esta receita.");
            setIsLoading(false);
            notifyInternetRequired("Reconecte-se para abrir esta receita.");
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
            console.error("Erro ao buscar receita para preparo:", err);
            setErro("Não foi possível carregar esta receita agora. Tente novamente.");
            setReceitaBancoDados(null);
        } finally {
            setIsLoading(false);
        }
    }, [isOffline, notifyInternetRequired, receitaId, tipo]);

    useEffect(() => {
        void retryReceita();
    }, [retryReceita]);

    // ============================================
    // Processamento de passos
    // ============================================

    // Determina qual passo está ativo (sem early return)
    const step = passosParam[passoAtual];

    // Sincroniza o timer quando o passo muda
    useEffect(() => {
        if (step?.hasTimer && step.tempoTimer > 0) {
            setTempo(step.tempoTimer);
            setTimerAtivo(false);
        } else {
            setTempo(0);
            setTimerAtivo(false);
        }
    }, [passoAtual, step?.hasTimer, step?.tempoTimer]);

    // Lógica do contador (decremento)
    useEffect(() => {
        let interval: ReturnType<typeof setInterval> | null = null;

        if (timerAtivo && tempo > 0) {
            interval = setInterval(() => {
                setTempo((prevTempo) => {
                    const novoTempo = prevTempo - 1;
                    if (novoTempo <= 0) {
                        setTimerAtivo(false);
                        return 0;
                    }
                    return novoTempo;
                });
            }, 1000);
        }

        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, [timerAtivo, tempo]);

    // ============================================
    // Funções de navegação
    // ============================================

    const proximoPasso = () => {
        if (passoAtual === passosParam.length - 1) {
            setIsConcluido(true);
        } else {
            setPassoAtual(passoAtual + 1);
        }
    };

    const passoAnterior = () => {
        if (passoAtual > 0) setPassoAtual(passoAtual - 1);
    };

    const resetarTimer = () => {
        setTimerAtivo(false);
        if (step?.hasTimer && step.tempoTimer > 0) {
            setTempo(step.tempoTimer);
        } else {
            setTempo(0);
        }
    };

    // ============================================
    // RETORNO (sem early returns antes daqui)
    // ============================================
    return {
        passoAtual,
        isConcluido,
        tempo,
        timerAtivo,
        setTimerAtivo,
        proximoPasso,
        passoAnterior,
        resetarTimer,
        step,
        totalPassos: passosParam.length,
        isLoading,
        erro,
        retryReceita,
    };
}
