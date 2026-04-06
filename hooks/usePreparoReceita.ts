import { useState, useEffect } from 'react';

export function usePreparoReceita(passos: any[]) {
    const [passoAtual, setPassoAtual] = useState(0);
    const [isConcluido, setIsConcluido] = useState(false);
    const [tempo, setTempo] = useState<number>(0);
    const [timerAtivo, setTimerAtivo] = useState(false);

    const step = passos[passoAtual];

    // Sincroniza o timer quando o passo muda
    useEffect(() => {
        if (step?.hasTimer) {
            setTempo(step.tempoTimer || 300);
            setTimerAtivo(false);
        }
    }, [passoAtual]);

    // Lógica do contador (decremento)
    useEffect(() => {
        // 1. Defina o tipo de forma dinâmica
        let interval: ReturnType<typeof setInterval>;

        if (timerAtivo && tempo > 0) {
            // 2. Use o window.setInterval para garantir que o TS não se confunda
            interval = setInterval(() => setTempo((t) => t - 1), 1000);
        } else if (tempo === 0) {
            setTimerAtivo(false);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [timerAtivo, tempo]);

    const proximoPasso = () => {
        if (passoAtual === passos.length - 1) {
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
        setTempo(step?.tempoTimer || 300);
    };

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
        totalPassos: passos.length
    };
}