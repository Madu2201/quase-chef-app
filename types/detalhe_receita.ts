// TIPOS PARA DETALHE DA RECEITA
export interface Ingrediente {
    id: string;
    nome: string;
    status: "ok" | "faltando";
}

// TIPOS PARA PASSOS
export interface PassoPreparo {
    titulo: string;
    descricao: string;
    dica: string;
    hasTimer: boolean;
    tempoTimer: number;
}

// TIPOS PARA INFO CARD
export interface InfoCardProps {
    icon: React.ComponentType<{ size: number; color: string }>;
    label: string;
    value: string;
}

// TIPOS PARA RECEITA DETALHADA
export interface ReceitaDetalhada {
    titulo: string;
    descricao: string;
    tempo: string;
    dificuldade: string;
    calorias: string;
    imagem: string;
    itensCount: number;
    dicaIA: string;
    ingredientes: Ingrediente[];
    preparo: PassoPreparo[];
}