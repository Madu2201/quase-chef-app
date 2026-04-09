import { useState, useMemo } from 'react';
import { CompraItem } from '../types/lista';

export function useListaCompras(initialData: CompraItem[]) {
    const [items, setItems] = useState<CompraItem[]>(initialData);

    // Derivação de listas via useMemo para evitar re-cálculos inúteis
    const pendentes = useMemo(() => items.filter(i => !i.comprado), [items]);
    const comprados = useMemo(() => items.filter(i => i.comprado), [items]);

    // Adiciona novo item formatando a string de 'info'
    const addItem = (nome: string, qtd: string, unidade: string) => {
        const novo: CompraItem = {
            id: Date.now().toString(), // ID temporário único
            name: nome.trim(),
            info: `${qtd} ${unidade}`,
            comprado: false
        };
        setItems(prev => [novo, ...prev]);
    };

    // Alterna o status de compra (Update In-place)
    const toggleItem = (id: string) => {
        setItems(prev => prev.map(item =>
            item.id === id ? { ...item, comprado: !item.comprado } : item
        ));
    };

    // Remove um item específico
    const removerItem = (id: string) => {
        setItems(prev => prev.filter(item => item.id !== id));
    };

    // Remove todos os itens marcados como comprados
    const removerComprados = () => {
        setItems(prev => prev.filter(item => !item.comprado));
    };

    // Marca todos os itens pendentes como comprados de uma vez
    const marcarTodos = () => {
        setItems(prev => prev.map(item => ({ ...item, comprado: true })));
    };

    return {
        pendentes,
        comprados,
        addItem,
        toggleItem,
        removerItem,
        removerComprados,
        marcarTodos
    };
}