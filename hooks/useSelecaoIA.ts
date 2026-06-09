import { router } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { Alert } from "react-native";
import { generateAndUploadRecipeImage } from "../services/aiImageService";
import { perguntarAoGemini } from "../services/geminiService";
import type { Ingredient } from "../types/despensa";
import {
  ContextoSegurancaPrompt,
  extrairReceitaIAParseada,
  montarListaIngredientesPorIds,
  montarPromptGeracaoReceitaIA,
} from "../utils/iaUtils";
import { useAuth } from "./useAuth";
import { useDespensa } from "./useDespensa";
import { useNetworkStatus } from "./useNetworkStatus";

/** Estrutura de categoria para a listagem alfabética */
export type CategoriaIngredienteIA = {
  titulo: string;
  itens: Ingredient[];
};

/**
 * Hook para gerenciar a lógica da tela de Seleção IA.
 * Responsável pela filtragem, agrupamento alfabético e integração com serviços de IA.
 */
export function useSelecaoIA() {
  const [busca, setBusca] = useState("");
  const [selecionadosIds, setSelecionadosIds] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [categoriasColapsadas, setCategoriasColapsadas] = useState<string[]>(
    [],
  );

  const { ingredients } = useDespensa();
  const { user } = useAuth();
  const { notifyInternetRequired } = useNetworkStatus();

  // --- AÇÕES DO USUÁRIO ---

  const toggleIngrediente = useCallback((id: string) => {
    setSelecionadosIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }, []);

  const limparSelecao = useCallback(() => setSelecionadosIds([]), []);

  const toggleCategoria = useCallback((titulo: string) => {
    setCategoriasColapsadas((prev) =>
      prev.includes(titulo)
        ? prev.filter((t) => t !== titulo)
        : [...prev, titulo],
    );
  }, []);

  // --- DADOS DERIVADOS (MEMOIZADOS) ---

  const ingredientesSelecionados = useMemo(() => {
    if (!ingredients) return [];
    return ingredients.filter((ing) => selecionadosIds.includes(ing.id));
  }, [ingredients, selecionadosIds]);

  const categoriasComItens = useMemo((): CategoriaIngredienteIA[] => {
    if (!ingredients?.length) return [];

    const grupos: Record<string, Ingredient[]> = {};

    // Filtra ingredientes com quantidade > 0 (não mostrar itens acabados)
    const ingredientesDisponiveis = ingredients.filter((ing) => (ing.qty || 0) > 0);

    // Ordenação alfabética global dos ingredientes
    const ingredientesOrdenados = [...ingredientesDisponiveis].sort((a, b) =>
      a.name.localeCompare(b.name, "pt-BR", { sensitivity: "base" }),
    );

    ingredientesOrdenados.forEach((ing) => {
      const primeiraLetra = ing.name.charAt(0).toUpperCase();
      const categoria = /^[A-ZÀ-Ú]$/.test(primeiraLetra) ? primeiraLetra : "#";

      if (!grupos[categoria]) {
        grupos[categoria] = [];
      }
      grupos[categoria].push(ing);
    });

    return Object.keys(grupos)
      .sort((a, b) => {
        if (a === "#") return 1;
        if (b === "#") return -1;
        return a.localeCompare(b, "pt-BR");
      })
      .map((letra) => ({
        titulo: letra,
        itens: grupos[letra],
      }));
  }, [ingredients]);

  const categoriasFiltradas = useMemo(() => {
    const termo = busca.toLowerCase().trim();
    if (!termo) return categoriasComItens;

    return categoriasComItens
      .map((cat) => ({
        ...cat,
        itens: cat.itens.filter((ing) =>
          ing.name.toLowerCase().includes(termo),
        ),
      }))
      .filter((cat) => cat.itens.length > 0);
  }, [busca, categoriasComItens]);

  // --- GERAÇÃO DE RECEITA ---

  const gerarReceitaComIngredientes = useCallback(
    async (idsIngredientes: string[]): Promise<void> => {
      const lista = idsIngredientes.filter(Boolean);
      if (lista.length === 0) {
        Alert.alert("Atenção", "Selecione pelo menos um ingrediente!");
        return;
      }

      if (
        !notifyInternetRequired("Reconecte-se para gerar uma receita com IA.")
      ) {
        return;
      }

      setIsGenerating(true);
      try {
        const comEstoque = montarListaIngredientesPorIds(lista, ingredients);

        let contextoPerfil: ContextoSegurancaPrompt | null = null;
        const alerg = user?.allergies?.filter(Boolean) as string[] | undefined;
        const prefs = user?.food_preferences?.filter(Boolean) as
          | string[]
          | undefined;

        if ((alerg && alerg.length > 0) || (prefs && prefs.length > 0)) {
          contextoPerfil = {
            chavesAlergiaUsuario: alerg ?? [],
            chavesPreferenciaUsuario: prefs ?? [],
          };
        }

        const prompt = montarPromptGeracaoReceitaIA(comEstoque, contextoPerfil);
        const respostaIA = await perguntarAoGemini(prompt);
        const { receita: receitaGerada, imagePrompt } =
          extrairReceitaIAParseada(respostaIA);

        // Gera ID único para a receita
        const idReceitaGerada = "ia-" + Date.now();

        // Falha de mídia não pode derrubar a geração da receita.
        let imageUrl: string | null = null;
        if (imagePrompt) {
          imageUrl = await generateAndUploadRecipeImage(
            imagePrompt,
            idReceitaGerada,
          );
          if (!imageUrl) {
            console.warn(
              "Falha ao gerar/fazer upload da imagem; seguindo sem imagem externa.",
            );
          }
        }

        router.push({
          pathname: "/detalhe_receita",
          params: {
            id: idReceitaGerada,
            tipo: "ia",
            title: receitaGerada.nome_receita || "Receita Surpresa",
            description:
              receitaGerada.descricao_simples_preparo || "Sem descrição",
            time: receitaGerada.tempo_preparo || "30min",
            difficulty: receitaGerada.dificuldade || "Média",
            calories: receitaGerada.calorias || "N/A",
            dica_rapida: receitaGerada.dica_rapida || "",
            ingredients: JSON.stringify(receitaGerada.ingredientes || []),
            steps: JSON.stringify(receitaGerada.passos_detalhados || []),
            pre_visualizacao: JSON.stringify(
              receitaGerada.pre_visualizacao_passos || [],
            ),
            image: imageUrl || "",
            tags: JSON.stringify(receitaGerada.tags || []),
            preferencias: JSON.stringify(receitaGerada.preferencias || []),
            alergias: JSON.stringify(receitaGerada.alergias_presentes || []),
          },
        });
        } catch (error: any) {
        console.error("Erro IA:", error);
        
        // Transforma tudo em string e minúsculo para facilitar a busca
        const errorMessage = (error?.message || String(error)).toLowerCase();

        // Botões padronizados (adicionado o "OK" no cancelar para fazer mais sentido)
        const alertButtons = [
          { 
            text: "Ver Catálogo", 
            onPress: () => router.push("/(tabs)/receitas")
          },
          { 
            text: "OK", 
            style: "cancel" as const 
          }
        ];

        // 1. Limite de Requisições (Rate Limit)
        if (errorMessage.includes("429") || errorMessage.includes("too many requests")) {
          Alert.alert(
            "Muita gente na cozinha! 👨‍🍳", 
            "A nossa IA está preparando muitos pratos ao mesmo tempo. Que tal dar uma olhada no nosso catálogo de receitas enquanto ela termina?", 
            alertButtons
          );
        } 
        // 2. Erro de Autenticação / Chave de API
        else if (errorMessage.includes("401") || errorMessage.includes("403") || errorMessage.includes("api_key")) {
          Alert.alert(
            "Eita, faltou um ingrediente técnico! 🔧", 
            "Tivemos um probleminha de conexão com o nosso assistente. Enquanto resolvemos isso, você pode conferir as opções do catálogo.", 
            alertButtons
          );
        } 
        // 3. Erro no Servidor (Deles ou Seu)
        else if (errorMessage.includes("500") || errorMessage.includes("503") || errorMessage.includes("server")) {
          Alert.alert(
            "Servidores lotados! 🥵", 
            "Nosso assistente de cozinha recebeu mais pedidos do que consegue aguentar agora. Bora dar uma olhada nas receitas prontas do catálogo?", 
            alertButtons
          );
        } 
        // 4. Erro de Internet / Conexão
        else if (errorMessage.includes("network") || errorMessage.includes("fetch") || errorMessage.includes("internet") || errorMessage.includes("baleia")) {
          Alert.alert(
            "Sem sinal na cozinha? 🌐", 
            "Sua internet parece ter dado uma oscilada. Verifique sua conexão ou aproveite para olhar nosso catálogo de receitas.", 
            alertButtons
          );
        } 
        // 5. Erro Genérico
        else {
          Alert.alert(
            "A receita desandou! 🍳", 
            "Não conseguimos criar sua receita personalizada dessa vez. Enquanto limpamos a bancada, que tal escolher uma opção do nosso catálogo?", 
            alertButtons
          );
        }
      } finally {
        setIsGenerating(false);
      }
    },
    [ingredients, notifyInternetRequired, user],
  );

  // --- RETORNO DO HOOK ---
  const handleGerarReceita = useCallback(
    async (idsOpcionais?: any) => {
      const idsParaGerar = Array.isArray(idsOpcionais)
        ? idsOpcionais
        : selecionadosIds;

      await gerarReceitaComIngredientes(idsParaGerar);
    },
    [selecionadosIds, gerarReceitaComIngredientes],
  );

  return {
    busca,
    setBusca,
    selecionadosIds,
    selecionadosCount: selecionadosIds.length,
    ingredientesSelecionados,
    categoriasColapsadas,
    toggleCategoria,
    isGenerating,
    categoriasFiltradas,
    toggleIngrediente,
    limparSelecao,
    handleGerarReceita,
  };
}
