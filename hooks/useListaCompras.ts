import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { supabase } from '../services/supabase';
import { CompraItem } from '../types/lista';
import { useAuth } from './useAuth';
import { useDispensa } from './useDispensa';
import { Ingredient } from '../types/dispensa';

export function useListaCompras() {
    const { user } = useAuth();
    const { ingredients } = useDispensa();
    const [items, setItems] = useState<CompraItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const buscarLista = async () => {
        if (!user?.id) return;
        try {
            setIsLoading(true);
            const { data, error } = await supabase
                .from("lista_compras")
                .select("*")
                .eq("user_id", user.id)
                .order("created_at", { ascending: false });

            if (error) throw error;
            setItems(data || []);
        } catch (e) {
            console.error("Erro ao buscar lista:", e);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { buscarLista(); }, [user]);

    const addItem = async (nome: string, qtd: string, unidade: string) => {
        if (!user?.id) return;
        const novoItem = {
            user_id: user.id, // Enviando o ID igual aos Favoritos
            nome: nome.trim(),
            quantidade_comprar: parseFloat(qtd.replace(',', '.')),
            unidade: unidade,
            comprado: false
        };

        const { data, error } = await supabase.from("lista_compras").insert([novoItem]).select();
        if (!error && data) {
            setItems(prev => [data[0], ...prev]);
        } else if (error) {
            Alert.alert("Erro ao adicionar", error.message);
        }
    };

    const gerarListaDaDispensa = async () => {
        if (!user?.id) return;

        const itensFaltantes = ingredients.filter((ing: Ingredient) => {
            const atual = parseFloat(String(ing.qty || 0).replace(',', '.'));
            const ideal = parseFloat(String(ing.ideal_qty || 0).replace(',', '.'));
            return atual < ideal;
        });
        
        if (itensFaltantes.length === 0) {
            return Alert.alert("Tudo em dia!", "Seu estoque está conforme as metas.");
        }

        const novosItens = itensFaltantes.map((ing: Ingredient) => ({
            user_id: user.id, // Enviando o ID igual aos Favoritos
            nome: ing.name,
            quantidade_comprar: Math.max(0, parseFloat(String(ing.ideal_qty)) - parseFloat(String(ing.qty))),
            unidade: ing.unit,
            comprado: false
        }));

        const { error } = await supabase.from("lista_compras").insert(novosItens);
        if (!error) {
            buscarLista();
        } else {
            Alert.alert("Erro ao gerar", error.message);
        }
    };

    const toggleItem = async (id: string) => {
        const item = items.find(i => i.id === id);
        if (!item) return;
        const novoStatus = !item.comprado;
        setItems(prev => prev.map(i => i.id === id ? { ...i, comprado: novoStatus } : i));
        await supabase.from("lista_compras").update({ comprado: novoStatus }).eq("id", id);
    };

    const removerItem = async (id: string) => {
        setItems(prev => prev.filter(i => i.id !== id));
        await supabase.from("lista_compras").delete().eq("id", id);
    };

    const limparComprados = async () => {
        setItems(prev => prev.filter(i => !i.comprado));
        await supabase.from("lista_compras").delete().eq("user_id", user?.id).eq("comprado", true);
    };

    return {
        pendentes: items.filter(i => !i.comprado),
        comprados: items.filter(i => i.comprado),
        isLoading,
        addItem,
        gerarListaDaDispensa,
        toggleItem,
        removerItem,
        limparComprados
    };
}