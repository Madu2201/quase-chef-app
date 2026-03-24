import { useState, useMemo } from 'react';

export interface CompraItem {
    id: string;
    name: string;
    info: string;
    comprado: boolean;
}

export function useListaCompras(initialData: CompraItem[]) {
    const [items, setItems] = useState<CompraItem[]>(initialData);

    // Itens que ainda precisam ser comprados
    const pendentes = useMemo(() => items.filter(i => !i.comprado), [items]);

    // Itens já marcados como comprados
    const comprados = useMemo(() => items.filter(i => i.comprado), [items]);

    const toggleItem = (id: string) => {
        setItems(prev => prev.map(item =>
            item.id === id ? { ...item, comprado: !item.comprado } : item
        ));
    };

    const removerItem = (id: string) => {
        setItems(prev => prev.filter(item => item.id !== id));
    };

    const removerComprados = () => {
        setItems(prev => prev.filter(item => !item.comprado));
    };

    const marcarTodos = () => {
        setItems(prev => prev.map(item => ({ ...item, comprado: true })));
    };

    return {
        pendentes,
        comprados,
        toggleItem,
        removerItem,
        removerComprados,
        marcarTodos
    };
}