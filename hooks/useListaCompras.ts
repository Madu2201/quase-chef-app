import { useEffect, useState } from 'react';
import { Alert, Share } from 'react-native';
import { supabase } from '../services/supabase';
import { Ingredient } from '../types/dispensa';
import { CompraItem } from '../types/lista';
import { normalizarNome, parseNumero } from '../utils/validation';
import { useAuth } from './useAuth';
import { useDispensa } from './useDispensa';

/**
 * Hook gerenciador de Lista de Compras
 * Responsabilidades:
 * - Gerenciar CRUD de itens da lista
 * - Sincronizar com Supabase em tempo real
 * - Gerar lista automática baseada na dispensa
 * - Compartilhamento de listas
 * - Edição rápida de quantidades
 */
export function useListaCompras() {
    const { user } = useAuth();
    const { ingredients } = useDispensa();
    const [items, setItems] = useState<CompraItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    /**
     * Busca a lista completa do usuário do banco de dados
     * Ordena por data de criação (mais recentes primeiro)
     */
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

    /**
     * Adiciona novo item à lista ou incrementa quantidade se já existe
     * @param nome - Nome do item
     * @param qtd - Quantidade a ser adicionada
     * @param unidade - Unidade de medida (un, kg, l, etc)
     */
    const addItem = async (nome: string, qtd: string, unidade: string) => {
        if (!user?.id) return;
        
        const novaQuantidade = parseNumero(qtd);
        const nomeNormalizado = normalizarNome(nome);
        
        const itemExistente = items.find(
            (item) => normalizarNome(item.nome) === nomeNormalizado
        );

        try {
            if (itemExistente) {
                // Operação UPSERT: Item existe → Incrementar quantidade
                const quantidadeAtualizada = itemExistente.quantidade_comprar + novaQuantidade;
                
                const { error } = await supabase
                    .from("lista_compras")
                    .update({ quantidade_comprar: quantidadeAtualizada })
                    .eq("id", itemExistente.id);

                if (error) {
                    Alert.alert("Erro ao atualizar", error.message);
                } else {
                    setItems((prev) =>
                        prev.map((item) =>
                            item.id === itemExistente.id
                                ? { ...item, quantidade_comprar: quantidadeAtualizada }
                                : item
                        )
                    );
                    Alert.alert("Sucesso!", `Adicionado ${novaQuantidade} ${unidade} ao ${nome} existente (total: ${quantidadeAtualizada} ${unidade})`);
                }
            } else {
                // Operação INSERT: Item novo
                const novoItem = {
                    user_id: user.id,
                    nome: nome.trim(),
                    quantidade_comprar: novaQuantidade,
                    unidade: unidade,
                    comprado: false
                };

                const { data, error } = await supabase
                    .from("lista_compras")
                    .insert([novoItem])
                    .select();
                    
                if (!error && data) {
                    setItems((prev) => [data[0], ...prev]);
                    Alert.alert("Sucesso!", `${nome} adicionado à lista`);
                } else if (error) {
                    Alert.alert("Erro ao adicionar", error.message);
                }
            }
        } catch (error) {
            Alert.alert("Erro", String(error));
        }
    };

    /**
     * Atualiza a quantidade de um item já existente na lista
     * Operação rápida e direta para edição inline
     * @param id - ID do item
     * @param novaQuantidade - Nova quantidade (substitui a anterior)
     */
    const atualizarQuantidade = async (id: string, novaQuantidade: number) => {
        if (!user?.id || novaQuantidade < 0) return;

        try {
            // Atualização otimista local
            setItems((prev) =>
                prev.map((item) =>
                    item.id === id
                        ? { ...item, quantidade_comprar: novaQuantidade }
                        : item
                )
            );

            // Sincronização com banco
            const { error } = await supabase
                .from("lista_compras")
                .update({ quantidade_comprar: novaQuantidade })
                .eq("id", id);

            if (error) {
                Alert.alert("Erro ao atualizar", error.message);
                // Revert se falhar
                await buscarLista();
            }
        } catch (error) {
            Alert.alert("Erro", String(error));
            await buscarLista();
        }
    };

    /**
     * Gera lista automática baseada nos itens faltantes da dispensa
     * Sincroniza quantidades ideais com itens existentes na lista
     */
    const gerarListaDaDispensa = async () => {
        if (!user?.id) return;

        const itensFaltantes = ingredients.filter((ing: Ingredient) => {
            const atual = parseNumero(ing.qty || 0);
            const ideal = parseNumero(ing.ideal_qty || 0);
            return atual < ideal;
        });

        if (itensFaltantes.length === 0) {
            return Alert.alert("Tudo em dia!", "Seu estoque está conforme as metas.");
        }

        const itensParaInserir: Omit<CompraItem, 'id' | 'created_at'>[] = [];
        const itensParaAtualizar: Array<{ id: string; quantidade_comprar: number }> = [];

        for (const ing of itensFaltantes) {
            const novaQuantidade = Math.max(0, parseNumero(ing.ideal_qty) - parseNumero(ing.qty));
            const itemExistente = items.find(
                (item) => normalizarNome(item.nome) === normalizarNome(ing.name)
            );

            if (itemExistente) {
                itensParaAtualizar.push({
                    id: itemExistente.id,
                    quantidade_comprar: novaQuantidade
                });
            } else {
                itensParaInserir.push({
                    user_id: user.id,
                    nome: ing.name,
                    quantidade_comprar: novaQuantidade,
                    unidade: ing.unit,
                    comprado: false
                });
            }
        }

        try {
            if (itensParaAtualizar.length > 0) {
                for (const item of itensParaAtualizar) {
                    await supabase
                        .from("lista_compras")
                        .update({ quantidade_comprar: item.quantidade_comprar })
                        .eq("id", item.id);
                }
            }

            if (itensParaInserir.length > 0) {
                await supabase.from("lista_compras").insert(itensParaInserir);
            }

            if (itensParaAtualizar.length > 0 || itensParaInserir.length > 0) {
                await buscarLista();
                
                let mensagem = "";
                if (itensParaInserir.length > 0 && itensParaAtualizar.length > 0) {
                    mensagem = `Adicionados ${itensParaInserir.length} itens e atualizados ${itensParaAtualizar.length}`;
                } else if (itensParaInserir.length > 0) {
                    mensagem = `Adicionados ${itensParaInserir.length} itens`;
                } else {
                    mensagem = `Atualizadas quantidades de ${itensParaAtualizar.length} itens`;
                }
                
                Alert.alert("Sucesso!", mensagem);
            }
        } catch (error) {
            Alert.alert("Erro ao sincronizar", String(error));
        }
    };

    /**
     * Marca/desmarca um item como comprado
     * @param id - ID do item
     */
    const toggleItem = async (id: string) => {
        const item = items.find((i) => i.id === id);
        if (!item) return;
        
        const novoStatus = !item.comprado;
        setItems((prev) => 
            prev.map((i) => i.id === id ? { ...i, comprado: novoStatus } : i)
        );
        
        await supabase
            .from("lista_compras")
            .update({ comprado: novoStatus })
            .eq("id", id);
    };

    /**
     * Remove um item específico da lista
     * @param id - ID do item a remover
     */
    const removerItem = async (id: string) => {
        setItems((prev) => prev.filter((i) => i.id !== id));
        await supabase.from("lista_compras").delete().eq("id", id);
    };

    /**
     * Limpa todos os itens marcados como comprados
     */
    const limparComprados = async () => {
        setItems((prev) => prev.filter((i) => !i.comprado));
        await supabase
            .from("lista_compras")
            .delete()
            .eq("user_id", user?.id)
            .eq("comprado", true);
    };

    /**
     * Gera código único para compartilhamento de lista
     * Utiliza Share API nativa para compatibilidade cross-platform
     * @returns Promise com status da operação
     */
    const compartilharLista = async () => {
        if (items.length === 0) {
            Alert.alert("Lista vazia", "Adicione itens antes de compartilhar.");
            return;
        }

        try {
            const listaFormatada = items
                .filter((i) => !i.comprado)
                .map((item) => `• ${item.nome}: ${item.quantidade_comprar} ${item.unidade}`)
                .join("\n");

            const mensagem = `Confira minha lista de compras:\n\n${listaFormatada}`;

            await Share.share({
                message: mensagem,
                title: "Lista de Compras",
                url: undefined,
            });
        } catch (error) {
            Alert.alert("Erro ao compartilhar", String(error));
        }
    };

    // Retorna interface pública do hook com todas as operações
    return {
        pendentes: items.filter((i) => !i.comprado),
        comprados: items.filter((i) => i.comprado),
        isLoading,
        // Operações CRUD
        addItem,
        toggleItem,
        removerItem,
        limparComprados,
        // Operações avançadas
        gerarListaDaDispensa,
        atualizarQuantidade,
        compartilharLista,
    };
}