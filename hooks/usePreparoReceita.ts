import { useCallback, useEffect, useState } from 'react';

// Meus imports
import { MESSAGES } from '../constants/messages';
import { buscarReceitaPorId } from '../services/receitaService';
import type { PassoPreparo, ReceitaBancoDados } from '../types/detalhe_receita';
import type { UsePreparoReceitaReturn } from '../types/preparo_receita';
import { useNetworkStatus } from './useNetworkStatus';

export function usePreparoReceita(
    passosParam: PassoPreparo[],
    receitaId?: string | number,
    tipo?: string
): UsePreparoReceitaReturn {

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

    // Busca no banco quando temos um ID numérico e não é receita de IA (que pode não ter persistência)
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
            setErro(MESSAGES.OFFLINE_LOAD_RECIPE);
            setIsLoading(false);
            notifyInternetRequired(MESSAGES.OFFLINE_OPEN_RECIPE);
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
                setErro(MESSAGES.ERROR_LOAD_RECIPE);
                setReceitaBancoDados(null);
            }
        } catch (err) {
            console.error("Erro ao buscar receita para preparo:", err);
            setErro(MESSAGES.ERROR_LOAD_RECIPE);
            setReceitaBancoDados(null);
        } finally {
            setIsLoading(false);
        }
    }, [isOffline, notifyInternetRequired, receitaId, tipo]);

    useEffect(() => {
        void retryReceita();
    }, [retryReceita]);

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

    // Funções para navegação entre passos    
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

    const toggleTimer = () => {
        if (!timerAtivo && tempo <= 0) {
            return;
        }
        setTimerAtivo((prev) => !prev);
    };

    return {
        passoAtual,
        isConcluido,
        tempo,
        timerAtivo,
        toggleTimer,
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