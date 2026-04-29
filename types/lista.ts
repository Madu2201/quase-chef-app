/**
 * Tipos para o módulo de Lista de Compras
 * Define interfaces para estrutura de dados e contexto de operações
 */

/**
 * Tipo principal representando um item da lista de compras
 */
export interface CompraItem {
    id: string;
    user_id: string;
    nome: string;
    quantidade_comprar: number;
    unidade: string;
    comprado: boolean;
    created_at?: string;
}

/**
 * Interface pública do contexto de lista
 * Expõe operações CRUD e funções avançadas para consumidores do hook
 */
export interface ListaContextData {
    // Estado
    pendentes: CompraItem[];
    comprados: CompraItem[];
    isLoading: boolean;
    isGeneratingList: boolean;
    // Operações básicas
    addItem: (nome: string, qtd: string, unidade: string) => Promise<void>;
    toggleItem: (id: string) => Promise<void>;
    removerItem: (id: string) => Promise<void>;
    limparComprados: () => Promise<void>;
    // Operações avançadas
    gerarListaDaDispensa: () => Promise<void>;
    guardarNoEstoque: (onUpsert: (nome: string, qtd: number, unit: string) => Promise<boolean>) => Promise<void>;
    atualizarQuantidade: (id: string, novaQuantidade: number) => Promise<void>;
    compartilharLista: () => Promise<void>;
}