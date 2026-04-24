import { useEffect, useState } from 'react';
import { buscarReceitaPorId } from '../services/receitaService';
import type { PassoPreparo, ReceitaBancoDados } from '../types/detalhe_receita';

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
    const [receitaBancoDados, setReceitaBancoDados] = useState<ReceitaBancoDados | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [erro, setErro] = useState<string | null>(null);

    // Estados do preparo
    const [passoAtual, setPassoAtual] = useState(0);
    const [isConcluido, setIsConcluido] = useState(false);
    const [tempo, setTempo] = useState<number>(0);
    const [timerAtivo, setTimerAtivo] = useState(false);

    // ============================================
    // REGRA 3: Fetch com isMounted tracking
    // ============================================
    useEffect(() => {
        let isMounted = true;

        async function buscarDados() {
            // Só busca no banco se for receita regular (não IA) e tiver ID numérico
            const isIA = tipo === "ia";
            if (isIA || !receitaId || isNaN(Number(receitaId))) {
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
                        setErro("Receita não encontrada");
                        setReceitaBancoDados(null);
                    }
                }
            } catch (err) {
                if (isMounted) {
                    console.error("Erro ao buscar receita para preparo:", err);
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
    }, [receitaId, tipo]);

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
    }, [timerAtivo]);

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
    };
}