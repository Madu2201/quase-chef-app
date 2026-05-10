import { router } from "expo-router";
import { useMemo, useState } from "react";
import { Alert } from "react-native";
import { CATEGORIAS_DISPENSA } from "../constants/ingredients";
import { perguntarAoGemini } from "../services/geminiService";
import { gerarImagemDaReceita } from "../services/huggingFaceService";
import type { Ingredient } from "../types/dispensa";
import { ReceitaIAResponse } from "../types/ia";
import {
  ContextoSegurancaPrompt,
  limparJSONIA,
  montarListaIngredientesPorIds,
  montarPromptGeracaoReceitaIA,
  verificarCorrespondencia,
} from "../utils/iaUtils";
import { useAuth } from "./useAuth";
import { useDispensa } from "./useDispensa";

/** Categoria com objetos completos da Dispensa (qty/unit corretos no prompt). */
export type CategoriaIngredienteIA = {
  titulo: string;
  icon: string;
  itens: Ingredient[];
};

// Hook para a tela de seleção de ingredientes para geração de receita via IA
export function useSelecaoIA() {
  const [busca, setBusca] = useState("");
  /** IDs dos ingredientes da dispensa selecionados para a IA */
  const [selecionadosIds, setSelecionadosIds] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Lista completa da Context API da Dispensa (fonte única de qty/unidade)
  const { ingredients } = useDispensa();
  const { user } = useAuth();

  const toggleIngrediente = (id: string) => {
    setSelecionadosIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const limparSelecao = () => setSelecionadosIds([]);

  const categoriasComItens = useMemo((): CategoriaIngredienteIA[] => {
    if (!ingredients?.length) return [];

    const ingredientesAtribuidos = new Set<string>();

    const categorias = CATEGORIAS_DISPENSA.map((cat) => {
      const itensFiltrados = ingredients.filter((ing) => {
        if (ingredientesAtribuidos.has(ing.id)) return false;

        const temCorrespondencia = cat.itens.some((item) =>
          verificarCorrespondencia(ing.name, item),
        );

        if (temCorrespondencia) {
          ingredientesAtribuidos.add(ing.id);
        }

        return temCorrespondencia;
      });

      return {
        titulo: cat.titulo,
        icon: cat.icon,
        itens: itensFiltrados,
      };
    });

    const outrosItens = ingredients.filter(
      (ing) => !ingredientesAtribuidos.has(ing.id),
    );

    if (outrosItens.length > 0) {
      categorias.push({
        titulo: "OUTROS",
        icon: "RotateCcw",
        itens: outrosItens,
      });
    }

    return categorias.filter((cat) => cat.itens.length > 0);
  }, [ingredients]);

  const categoriasFiltradas = useMemo(() => {
    const termo = busca.toLowerCase().trim();
    return categoriasComItens
      .map((cat) => ({
        ...cat,
        itens: cat.itens.filter((ing) =>
          ing.name.toLowerCase().includes(termo),
        ),
      }))
      .filter((cat) => cat.itens.length > 0);
  }, [busca, categoriasComItens]);

  const gerarReceitaComIngredientes = async (
    idsIngredientes: string[],
  ): Promise<void> => {
    const lista = Array.isArray(idsIngredientes)
      ? idsIngredientes.filter(Boolean)
      : [];
    if (lista.length === 0) {
      Alert.alert(
        "Atenção",
        "Selecione pelo menos um ingrediente da sua dispensa!",
      );
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
      if (
        (alerg && alerg.length > 0) ||
        (prefs && prefs.length > 0)
      ) {
        contextoPerfil = {
          chavesAlergiaUsuario: alerg ?? [],
          chavesPreferenciaUsuario: prefs ?? [],
        };
      }

      const prompt = montarPromptGeracaoReceitaIA(
        comEstoque,
        contextoPerfil,
      );
      const respostaIA = await perguntarAoGemini(prompt);
      const textoLimpo = limparJSONIA(respostaIA);
      const receitaGerada: ReceitaIAResponse = JSON.parse(textoLimpo);

      let imagemBase64 = "";
      try {
        imagemBase64 = await gerarImagemDaReceita(receitaGerada.nome_receita);
      } catch (imgError) {
        console.error("Erro ao gerar imagem para receita IA:", imgError);
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
      console.error("Erro no processamento da IA:", error);
      Alert.alert("Erro", "Nossa panela queimou! Tente gerar novamente.");
    } finally {
      setIsGenerating(false);
    }
  };

  /**
   * Sem argumentos: usa chips da seleção IA.
   * Com argumento: IDs vindos da dispensa (`selectedIngredientIds`).
   */
  const handleGerarReceita = async (
    idsOverride?: string[],
  ): Promise<void> => {
    const ids =
      idsOverride !== undefined ? idsOverride : selecionadosIds;
    await gerarReceitaComIngredientes(ids);
  };

  return {
    busca,
    setBusca,
    selecionadosIds,
    selecionadosCount: selecionadosIds.length,
    isGenerating,
    categoriasFiltradas,
    toggleIngrediente,
    limparSelecao,
    handleGerarReceita,
    gerarReceitaComIngredientes,
  };
}
