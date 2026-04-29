import type { Ingrediente, PassoPreparo } from "../types/detalhe_receita";

// Formata tempo de minutos/horas para exibição
export const formatarTempo = (tempo: string): string =>
    tempo
        .toLowerCase()
        .replace("minutos", "min")
        .replace("minuto", "min")
        .replace("horas", "h")
        .replace("hora", "h");

// Processa ingredientes do formato raw para o formato da interface
export const processarIngredientes = (rawIngredients: string | undefined): Ingrediente[] => {
    if (!rawIngredients) return [];

    try {
        const rawIng = JSON.parse(rawIngredients);
        return rawIng.map((ing: any, idx: number) => ({
            id: String(idx),
            nome: ing.texto_original || ing,
            status: "ok" as const,
        }));
    } catch (e) {
        console.error("Erro ao processar ingredientes:", e);
        return [];
    }
};

//Processa passos de preparo do formato raw para o formato da interface
export const processarPassosPreparo = (rawSteps: string | undefined): PassoPreparo[] => {
    if (!rawSteps) return [];

    try {
        const rawStepsParsed = JSON.parse(rawSteps);
        return rawStepsParsed.map((passo: any) => ({
            titulo: passo.titulo || "Passo",
            descricao: passo.descricao,
            dica: passo.dica_do_chef || "",
            hasTimer: passo.tempo_timer_minutos > 0,
            tempoTimer: (passo.tempo_timer_minutos || 0) * 60,
        }));
    } catch (e) {
        console.error("Erro ao processar passos:", e);
        return [];
    }
};