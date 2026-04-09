// Tipos organizados para a funcionalidade de Lista de Compras
export interface CompraItem {
    id: string;
    name: string;
    info: string;    // Combinação de quantidade + unidade (ex: "2 kg")
    comprado: boolean;
}

// Contexto de Lista
export interface ListaContextData {
    pendentes: CompraItem[];
    comprados: CompraItem[];
    addItem: (nome: string, qtd: string, unidade: string) => void;
    toggleItem: (id: string) => void;
    removerItem: (id: string) => void;
    removerComprados: () => void;
    marcarTodos: () => void;
}