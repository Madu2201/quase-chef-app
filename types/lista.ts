export interface CompraItem {
    id: string;
    nome: string;
    quantidade_comprar: number;
    unidade: string;
    comprado: boolean;
}

export interface ListaContextData {
    pendentes: CompraItem[];
    comprados: CompraItem[];
    gerarListaDaDispensa: () => Promise<void>; // O BOTÃO MÁGICO
    guardarNoEstoque: () => Promise<void>;     // O CICLO FINAL
    toggleItem: (id: string) => Promise<void>;
    removerItem: (id: string) => Promise<void>;
    isLoading: boolean;
}