import { useEffect, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { supabase } from '../services/supabase';
import { useAuth } from './useAuth';

export interface Ingredient {
    id: string;
    name: string;
    qty: string;
    unit: string;
    selected: boolean;
}

export function useDispensa() {
    const { user } = useAuth(); 
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [searchText, setSearchText] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (user?.id) {
            buscarDispensa();
        } else {
            setIngredients([]);
            setIsLoading(false);
        }
    }, [user?.id]);

    const buscarDispensa = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('dispensa')
            .select('*')
            .eq('user_id', user.id) 
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Erro ao carregar ingredientes:", error.message);
        }

        if (data && !error) {
            const formatado = data.map((item: any) => ({
                id: item.id,
                name: item.nome_base,
                qty: String(item.quantidade),
                unit: item.unidade,
                selected: item.selected
            }));
            setIngredients(formatado);
        }
        setIsLoading(false);
    };

    // 🔥 O BLOCO DA PESQUISA QUE EU TINHA ESQUECIDO!
    const filteredIngredients = useMemo(() => {
        return ingredients.filter((item: Ingredient) =>
            item.name.toLowerCase().includes(searchText.toLowerCase())
        );
    }, [searchText, ingredients]);

    // --- A FUNÇÃO DE ADICIONAR COM ALERTAS BLINDADOS ---
    const addIngredient = async (name: string, qty: string, unit: string) => {
        // 1. Verifica se o usuário sumiu
        if (!user?.id) {
            Alert.alert("Atenção", "Usuário não identificado. Tente fazer login novamente.");
            throw new Error("Usuário não logado");
        }

        console.log("Enviando para o Supabase...", { user_id: user.id, nome_base: name, quantidade: qty, unidade: unit });

        const { data, error } = await supabase
            .from('dispensa')
            .insert({
                user_id: user.id,
                nome_base: name,
                quantidade: Number(qty) || 1,
                unidade: unit,
                selected: true
            })
            .select()
            .single();

        // 2. Se o Supabase der erro, ele vai berrar na sua tela agora!
        if (error) {
            console.error("ERRO DO SUPABASE:", error);
            Alert.alert("Erro no Banco de Dados", error.message);
            throw error; // Faz a tela não limpar os campos e parar o processo
        }

        // 3. Deu tudo certo? Adiciona na lista!
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
    };

    const toggleIngredient = async (id: string) => {
        const itemAtual = ingredients.find(i => i.id === id);
        if (!itemAtual) return;

        setIngredients(prev => prev.map(item => item.id === id ? { ...item, selected: !item.selected } : item));

        await supabase
            .from('dispensa')
            .update({ selected: !itemAtual.selected })
            .eq('id', id);
    };

    const removeIngredient = async (id: string) => {
        setIngredients(prev => prev.filter(item => item.id !== id));

        await supabase
            .from('dispensa')
            .delete()
            .eq('id', id);
    };

    const selectedCount = ingredients.filter((i: Ingredient) => i.selected).length;

    return {
        ingredients,
        searchText,
        setSearchText,
        filteredIngredients, // <-- Agora o TypeScript encontra ele de novo!
        addIngredient,
        toggleIngredient,
        removeIngredient,
        selectedCount,
        isLoading
    };
}