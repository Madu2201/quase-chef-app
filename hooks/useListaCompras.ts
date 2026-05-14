import { useEffect, useState } from "react";
import { Alert, Share } from "react-native";
import { supabase } from "../services/supabase";
import { Ingredient } from "../types/despensa";
import { CompraItem } from "../types/lista";
import { normalizarNome, parseNumero } from "../utils/validation";
import { useAuth } from "./useAuth";
import { useDespensa } from "./useDespensa";

/**
 * Hook gerenciador de Lista de Compras
 * Responsabilidades:
 * - Gerenciar CRUD de itens da lista
 * - Sincronizar com Supabase em tempo real
 * - Gerar lista automática baseada na despensa
 * - Compartilhamento de listas
 * - Edição rápida de quantidades
 */
export function useListaCompras() {
  const { user } = useAuth();
  const { ingredients } = useDespensa();
  const [items, setItems] = useState<CompraItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGeneratingList, setIsGeneratingList] = useState(false);

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

  // Atualiza a lista sempre que o usuário muda ou o hook é montado
  useEffect(() => {
    buscarLista();
  }, [user]);

  /**
   * Adiciona um novo item à lista de compras
   * Se o item já existe, soma a quantidade
   * @param nome - Nome do produto (ex: Arroz)
   * @param qtd - Quantidade em string (ex: "2,5")
   * @param unidade - Unidade de medida (ex: "kg")
   */
  const addItem = async (nome: string, qtd: string, unidade: string) => {
    if (!user?.id) return;

    const qtdNumero = parseNumero(qtd);
    if (qtdNumero <= 0) {
      Alert.alert("Atenção", "Quantidade inválida.");
      return;
    }

    // Normaliza o nome para comparação (case-insensitive)
    const nomeNormalizado = normalizarNome(nome).toLowerCase();

    // Verifica se já existe item com esse nome e unidade
    const itemExistente = items.find(
      (item) =>
        normalizarNome(item.nome).toLowerCase() === nomeNormalizado &&
        item.unidade === unidade &&
        !item.comprado,
    );

    if (itemExistente) {
      // Item existe: soma as quantidades
      const novaQuantidade = itemExistente.quantidade_comprar + qtdNumero;
      await atualizarQuantidade(itemExistente.id, novaQuantidade);
      Alert.alert(
        "Sucesso",
        `Quantidade de ${nome} atualizada para ${novaQuantidade} ${unidade}`,
      );
      return;
    }

    // Item não existe: adiciona novo
    const novoItem = {
      user_id: user.id,
      nome: normalizarNome(nome),
      quantidade_comprar: qtdNumero,
      unidade: unidade,
      comprado: false,
    };

    const { data, error } = await supabase
      .from("lista_compras")
      .insert([novoItem])
      .select();

    if (!error && data) {
      setItems((prev) => [data[0], ...prev]);
    } else if (error) {
      Alert.alert("Erro ao adicionar", error.message);
    }
  };

  /**
   * Atualiza diretamente a quantidade de um item existente
   */
  const atualizarQuantidade = async (id: string, novaQuantidade: number) => {
    // Agora o hook confia que a validação foi feita antes da chamada
    setItems((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, quantidade_comprar: novaQuantidade } : i,
      ),
    );

    await supabase
      .from("lista_compras")
      .update({ quantidade_comprar: novaQuantidade })
      .eq("id", id);
  };

  /**
   * Inteligência: Compara Estoque Atual x Meta Ideal
   * Adiciona automaticamente à lista tudo que estiver faltando
   * Se item já existe: atualiza a quantidade (não duplica)
   */
  const gerarListaDaDespensa = async () => {
    if (isGeneratingList) return; // Previne cliques duplos
    if (!user?.id) return;

    setIsGeneratingList(true);

    // Filtra apenas itens onde o estoque atual é menor que a meta
    const itensFaltantes = ingredients.filter((ing: Ingredient) => {
      const atual = ing.qty || 0;
      const ideal = ing.ideal_qty || 0;
      return atual < ideal;
    });

    if (itensFaltantes.length === 0) {
      setIsGeneratingList(false);
      return Alert.alert("Tudo em dia!", "Seu estoque está conforme as metas.");
    }

    try {
      // Processa cada item faltante
      for (const ing of itensFaltantes) {
        const nomeNormalizado = normalizarNome(ing.name).toLowerCase();
        const qtdFaltante = Math.max(0, (ing.ideal_qty || 0) - (ing.qty || 0));

        // Verifica se já existe na lista (não comprado)
        const itemExistente = items.find(
          (item) =>
            normalizarNome(item.nome).toLowerCase() === nomeNormalizado &&
            item.unidade === ing.unit &&
            !item.comprado,
        );

        if (itemExistente) {
          // Atualiza quantidade ao invés de criar novo
          await supabase
            .from("lista_compras")
            .update({ quantidade_comprar: qtdFaltante })
            .eq("id", itemExistente.id);
        } else {
          // Cria novo item
          await supabase.from("lista_compras").insert([
            {
              user_id: user.id,
              nome: ing.name,
              quantidade_comprar: qtdFaltante,
              unidade: ing.unit,
              comprado: false,
            },
          ]);
        }
      }

      // Recarrega a lista do banco
      await buscarLista();
      Alert.alert(
        "Pronto!",
        "Sua lista foi atualizada com os itens faltantes.",
      );
    } catch (error) {
      Alert.alert("Erro ao gerar", "Falha ao atualizar a lista.");
    } finally {
      setIsGeneratingList(false);
    }
  };

  /**
   * Alterna o status do checkbox (comprado / pendente)
   */
  const toggleItem = async (id: string) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;

    const novoStatus = !item.comprado;
    // Optimistic UI Update (atualiza tela antes do banco)
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, comprado: novoStatus } : i)),
    );

    await supabase
      .from("lista_compras")
      .update({ comprado: novoStatus })
      .eq("id", id);
  };

  /**
   * Deleta um item específico
   */
  const removerItem = async (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    await supabase.from("lista_compras").delete().eq("id", id);
  };

  /**
   * Limpa o histórico excluindo todos os itens marcados como comprados
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
   * NOVA FUNÇÃO (FASE 2): Guarda os itens comprados na despensa e limpa a lista
   */
  const guardarNoEstoque = async (
    onUpsert: (nome: string, qtd: number, unit: string) => Promise<boolean>,
  ) => {
    if (!user?.id) return;

    const itensParaGuardar = items.filter((i) => i.comprado);

    if (itensParaGuardar.length === 0) {
      Alert.alert("Atenção", "Nenhum item marcado como comprado para guardar.");
      return;
    }

    let sucessoCount = 0;

    for (const item of itensParaGuardar) {
      const sucesso = await onUpsert(
        item.nome,
        Number(item.quantidade_comprar),
        item.unidade,
      );
      if (sucesso) {
        sucessoCount++;
      }
    }

    if (sucessoCount > 0) {
      await limparComprados();
      Alert.alert(
        "Sucesso!",
        `${sucessoCount} itens guardados na sua despensa.`,
      );
    } else {
      Alert.alert(
        "Ops",
        "Não foi possível guardar os itens. Verifique se as unidades são compatíveis.",
      );
    }
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
        .map(
          (item) =>
            `• ${item.nome}: ${item.quantidade_comprar} ${item.unidade}`,
        )
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
    isGeneratingList,
    // Operações CRUD
    addItem,
    toggleItem,
    removerItem,
    limparComprados,
    // Operações avançadas
    gerarListaDaDespensa,
    guardarNoEstoque,
    atualizarQuantidade,
    compartilharLista,
  };
}
