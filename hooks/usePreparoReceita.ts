import { useEffect, useState } from 'react';
import type { PassoPreparo } from '../types/detalhe_receita';

export function usePreparoReceita(passos: PassoPreparo[]) {
    const [passoAtual, setPassoAtual] = useState(0);
    const [isConcluido, setIsConcluido] = useState(false);
    const [tempo, setTempo] = useState<number>(0);
    const [timerAtivo, setTimerAtivo] = useState(false);

    const step = passos[passoAtual];

    // Sincroniza o timer quando o passo muda
    useEffect(() => {
        if (step?.hasTimer && step.tempoTimer > 0) {
            setTempo(step.tempoTimer);
            setTimerAtivo(false);
        } else {
            setTempo(0);
            setTimerAtivo(false);
        }
    }, [passoAtual]);

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
        if (step?.hasTimer && step.tempoTimer > 0) {
            setTempo(step.tempoTimer);
        } else {
            setTempo(0);
        }
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