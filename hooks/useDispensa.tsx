import React, { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { supabase } from '../services/supabase';
import { useAuth } from './useAuth';

export interface Ingredient {
    id: string;
    name: string;
    qty: string;
    unit: string;
    selected: boolean;
}

interface DispensaContextData {
    ingredients: Ingredient[];
    filteredIngredients: Ingredient[];
    searchText: string;
    setSearchText: (text: string) => void;
    addIngredient: (nome: string, qtd: string, unidade: string) => Promise<void>;
    toggleIngredient: (id: string) => Promise<void>;
    removeIngredient: (id: string) => Promise<void>;
    editIngredient: (id: string, field: 'quantidade' | 'unidade', value: string | number) => Promise<void>;
    selectedCount: number;
    isLoading: boolean;
    buscarDispensa: () => Promise<void>;
}

const DispensaContext = createContext<DispensaContextData>({} as DispensaContextData);

export function DispensaProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth(); 
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [searchText, setSearchText] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    const buscarDispensa = async () => {
        if (!user?.id) return;
        try {
            setIsLoading(true);
            const { data, error } = await supabase
                .from('dispensa')
                .select('*')
                .eq('user_id', user.id) 
                .order('created_at', { ascending: false });

            if (error) {
                console.error("❌ Erro ao carregar ingredientes:", error.message);
                return;
            }

            if (data) {
                const formatado = data.map((item: any) => ({
                    id: item.id,
                    name: item.nome_base,
                    qty: String(item.quantidade),
                    unit: item.unidade,
                    selected: item.selected
                }));
                setIngredients(formatado);
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (user?.id) {
            buscarDispensa();
        } else {
            setIngredients([]);
            setIsLoading(false);
        }
    }, [user?.id]);

    // O Cérebro da Busca: Filtra instantaneamente baseado no SearchText
    const filteredIngredients = useMemo(() => {
        if (!searchText.trim()) return ingredients;
        const lowerSearch = searchText.toLowerCase().trim();
        return ingredients.filter(item => item.name.toLowerCase().includes(lowerSearch));
    }, [ingredients, searchText]);

    const addIngredient = async (nome: string, qtd: string, unidade: string) => {
        if (!user?.id) return;
        try {
            const { data, error } = await supabase.from('dispensa').insert([{
                user_id: user.id,
                nome_base: nome.trim(),
                quantidade: Number(qtd.replace(',', '.')),
                unidade: unidade,
                selected: true
            }]).select().single();

            if (error) {
                console.error("❌ Erro ao inserir:", error.message);
                throw error;
            }

            if (data) {
                const novo = {
                    id: data.id,
                    name: data.nome_base,
                    qty: String(data.quantidade),
                    unit: data.unidade,
                    selected: data.selected
                };
                setIngredients(prev => [novo, ...prev]);
            }
        } catch (err) {
            console.error("❌ Falha ao adicionar ingrediente:", err);
            throw err;
        }
    };

    const toggleIngredient = async (id: string) => {
        const itemAtual = ingredients.find(i => i.id === id);
        if (!itemAtual) return;

        // Salva estado anterior para rollback
        const estadoAnterior = ingredients;
        const novoEstado = !itemAtual.selected;

        // Atualiza otimista
        setIngredients(prev => 
            prev.map(item => item.id === id ? { ...item, selected: novoEstado } : item)
        );

        try {
            const { error } = await supabase
                .from('dispensa')
                .update({ selected: novoEstado })
                .eq('id', id);

            if (error) {
                console.error("❌ Erro ao toggle:", error.message);
                // Faz rollback
                setIngredients(estadoAnterior);
                throw error;
            }
        } catch (err) {
            console.error("❌ Falha ao atualizar seleção:", err);
        }
    };

    const removeIngredient = async (id: string) => {
        // Salva estado anterior para rollback
        const estadoAnterior = ingredients;
        
        // Remove otimista
        setIngredients(prev => prev.filter(item => item.id !== id));

        try {
            const { error } = await supabase.from('dispensa').delete().eq('id', id);
            
            if (error) {
                console.error("❌ Erro ao remover:", error.message);
                // Faz rollback
                setIngredients(estadoAnterior);
                throw error;
            }
        } catch (err) {
            console.error("❌ Falha ao remover ingrediente:", err);
        }
    };

    // Edita quantidade e unidade com rollback em caso de erro
    const editIngredient = async (id: string, field: 'quantidade' | 'unidade', value: string | number) => {
        const numValue = field === 'quantidade' ? Number(String(value).replace(',', '.')) : value;
        
        // Salva estado anterior para rollback
        const estadoAnterior = ingredients;
        
        // Atualiza otimista
        setIngredients(prev => prev.map(item => {
            if (item.id === id) {
                return { 
                    ...item, 
                    qty: field === 'quantidade' ? String(value) : item.qty,
                    unit: field === 'unidade' ? String(value) : item.unit
                };
            }
            return item;
        }));

        try {
            const { error } = await supabase
                .from('dispensa')
                .update({ [field]: numValue })
                .eq('id', id);
            
            if (error) {
                console.error(`❌ Erro ao atualizar ${field}:`, error.message);
                // Faz rollback
                setIngredients(estadoAnterior);
                throw error;
            }
        } catch (err) {
            console.error(`❌ Falha ao editar ${field}:`, err);
        }
    };

    const selectedCount = ingredients.filter(i => i.selected).length;

    return (
        <DispensaContext.Provider value={{
            ingredients,
            filteredIngredients,
            searchText,
            setSearchText,
            addIngredient,
            toggleIngredient,
            removeIngredient,
            editIngredient,
            selectedCount,
            isLoading,
            buscarDispensa
        }}>
            {children}
        </DispensaContext.Provider>
    );
}

export function useDispensa() {
    return useContext(DispensaContext);
}