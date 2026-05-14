import { router } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { Alert } from "react-native";
import { perguntarAoGemini } from "../services/geminiService";
import { gerarImagemDaReceita } from "../services/huggingFaceService";
import type { Ingredient } from "../types/despensa";
import { ReceitaIAResponse } from "../types/ia";
import {
  ContextoSegurancaPrompt,
  limparJSONIA,
  montarListaIngredientesPorIds,
  montarPromptGeracaoReceitaIA,
} from "../utils/iaUtils";
import { useAuth } from "./useAuth";
import { useDespensa } from "./useDespensa";

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

    // Ordenação alfabética global dos ingredientes
    const ingredientesOrdenados = [...ingredients].sort((a, b) =>
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
        const textoLimpo = limparJSONIA(respostaIA);
        const receitaGerada: ReceitaIAResponse = JSON.parse(textoLimpo);

        let imagemBase64 = "";
        try {
          imagemBase64 = await gerarImagemDaReceita(receitaGerada.nome_receita);
        } catch (imgError) {
          console.error("Erro ao gerar imagem:", imgError);
        }

        router.push({
          pathname: "/detalhe_receita",
          params: {
            id: `ia-${Date.now()}`,
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
            image: imagemBase64,
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
    [ingredients, user],
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
