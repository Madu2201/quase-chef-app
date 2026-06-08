import { router } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { Alert } from "react-native";

// Meus imports
import { generateAndUploadRecipeImage } from "../services/aiImageService";
import { perguntarAoGemini } from "../services/geminiService";
import type { ContextoSegurancaPrompt } from "../types/ia";
import {
  extrairReceitaIAParseada, filtrarCategoriasPorBusca, montarListaIngredientesPorIds,
  montarPromptGeracaoReceitaIA, obterCategoriasIngredientesPorAlfabeto,
} from "../utils/iaUtils";
import { useAuth } from "./useAuth";
import { useDespensa } from "./useDespensa";
import { useNetworkStatus } from "./useNetworkStatus";

/// Hook para gerar receitas com IA a partir dos ingredientes selecionados pelo usuário
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

  // Ingredientes selecionados para a geração da receita
  const ingredientesSelecionados = useMemo(() => {
    if (!ingredients) return [];
    return ingredients.filter((ing) => selecionadosIds.includes(ing.id));
  }, [ingredients, selecionadosIds]);

  const categoriasComItens = useMemo(
    () => obterCategoriasIngredientesPorAlfabeto(ingredients),
    [ingredients],
  );

  // Busca na lista de categorias e ingredientes para filtrar conforme o termo digitado
  const categoriasFiltradas = useMemo(
    () => filtrarCategoriasPorBusca(categoriasComItens, busca),
    [busca, categoriasComItens],
  );

  // Funções de geração da receita com IA
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
      } catch (error) {
        console.error("Erro IA:", error);
        Alert.alert(
          "Erro",
          "Não foi possível gerar a receita. Tente novamente.",
        );
      } finally {
        setIsGenerating(false);
      }
    },
    [ingredients, notifyInternetRequired, user],
  );

  // Funções de geração da receita com IA, expostas para a tela de seleção
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