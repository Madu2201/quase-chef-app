import { router } from "expo-router";
import { useMemo, useState } from "react";
import { Alert } from "react-native";
import { CATEGORIAS_DISPENSA } from "../constants/ingredients";
import { perguntarAoGemini } from "../services/geminiService";
import { ReceitaIAResponse } from "../types/ia";
import { limparJSONIA, verificarCorrespondencia } from "../utils/iaUtils";
import { useDispensa } from "./useDispensa";

// Hook para a tela de seleção de ingredientes para geração de receita via IA
export function useSelecaoIA() {
  const [busca, setBusca] = useState("");
  const [selecionados, setSelecionados] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Hook que você já possui para pegar os itens da dispensa do usuário
  const { filteredIngredients } = useDispensa();

  // Função para adicionar ou remover um ingrediente da seleção
  const toggleIngrediente = (item: string) => {
    setSelecionados((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item],
    );
  };

  // Função para limpar a seleção
  const limparSelecao = () => setSelecionados([]);

  // 1. Atribui ingredientes às categorias definidas, garantindo que cada ingrediente vá para apenas uma categoria
  const categoriasComItens = useMemo(() => {
    if (!filteredIngredients || !Array.isArray(filteredIngredients)) return [];

    const ingredientesAtribuidos = new Set<string>();

    const categorias = CATEGORIAS_DISPENSA.map((cat) => {
      const itensFiltrados = filteredIngredients.filter((ing) => {
        // Pula se já foi colocado em outra categoria
        if (ingredientesAtribuidos.has(ing.name.toLowerCase())) return false;

        const temCorrespondencia = cat.itens.some((item) =>
          verificarCorrespondencia(ing.name, item),
        );

        if (temCorrespondencia) {
          ingredientesAtribuidos.add(ing.name.toLowerCase());
        }

        return temCorrespondencia;
      });

      return {
        titulo: cat.titulo,
        icon: cat.icon, // Mantemos a string para o getCategoriaIcon
        itens: itensFiltrados.map((ing) => ing.name),
      };
    });

    // Adiciona os outros itens que não foram atribuídos a nenhuma categoria
    const outrosItens = filteredIngredients.filter(
      (ing) => !ingredientesAtribuidos.has(ing.name.toLowerCase()),
    );

    if (outrosItens.length > 0) {
      categorias.push({
        titulo: "OUTROS",
        icon: "RotateCcw",
        itens: outrosItens.map((ing) => ing.name),
      });
    }

    return categorias.filter((cat) => cat.itens.length > 0);
  }, [filteredIngredients]);

  // 2. Filtra as categorias com base na busca
  const categoriasFiltradas = useMemo(() => {
    return categoriasComItens
      .map((cat) => ({
        ...cat,
        itens: cat.itens.filter((item) =>
          item.toLowerCase().includes(busca.toLowerCase()),
        ),
      }))
      .filter((cat) => cat.itens.length > 0);
  }, [busca, categoriasComItens]);

  // Função para navegar enviando a flag de IA e dados mockados
  const handleGerarReceita = async () => {
    if (selecionados.length === 0) {
      Alert.alert(
        "Atenção",
        "Selecione pelo menos um ingrediente da sua dispensa!",
      );
      return;
    }

    setIsGenerating(true);

    // Cria um prompt com os ingredientes selecionados
    try {
      const prompt = `
        Atue como um Chef de Cozinha, sem precisar dar um nome enorme para a receita, mande dicas bem explicatívas. 
        Crie uma receita focando nestes ingredientes: ${selecionados.join(", ")}. 
        Considere que o usuário tem: água, sal e óleo.

        REGRAS OBRIGATÓRIAS DE FORMATO:
        1. TITULO: Máximo 4 palavras. Seja breve (Ex: "Arroz com Carne Moída").
        2. TIMERS: O campo 'tempo_timer_minutos' deve ser > 0 APENAS para processos de cozimento, fogo ou espera. Para picar, misturar ou montar, use 0.
        3. DICAS: Se a 'dicaIA' não for realmente útil ou essencial, retorne uma string vazia "".
        4. JSON: Retorne APENAS o JSON, sem textos antes ou depois.

        Estrutura:
        {
          "titulo": "Nome Curto",
          "descricao": "Frase breve",
          "tempo": "XX min",
          "dificuldade": "Fácil/Média",
          "calorias": "xx kcal",
          "dicaIA": "",
          "ingredientes": ["quantidade e nome"],
          "passos": [
            {
              "titulo": "Preparar",
              "descricao": "Instrução",
              "dica_do_chef": "",
              "tempo_timer_minutos": 0
            }
          ]
        }`
        ;

      // Envia o prompt para a IA e processa a resposta
      const respostaIA = await perguntarAoGemini(prompt);
      const textoLimpo = limparJSONIA(respostaIA);
      const receitaGerada: ReceitaIAResponse = JSON.parse(textoLimpo);

      router.push({
        pathname: "/detalhe_receita",
        params: {
          id: `ia-${Date.now()}`,
          tipo: "ia",
          title: receitaGerada.titulo || "Receita Surpresa",
          description: receitaGerada.descricao || "Sem descrição",
          time: receitaGerada.tempo || "30 min",
          difficulty: receitaGerada.dificuldade || "Média",
          calories: receitaGerada.calorias || "N/A",
          dicaIA: receitaGerada.dicaIA || "",
          ingredients: JSON.stringify(receitaGerada.ingredientes || []),
          steps: JSON.stringify(receitaGerada.passos || []),
        },
      });
    } catch (error) {
      console.error("Erro no processamento da IA:", error);
      Alert.alert("Erro", "Nossa panela queimou! Tente gerar novamente.");
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    busca,
    setBusca,
    selecionados,
    isGenerating,
    categoriasFiltradas,
    toggleIngrediente,
    limparSelecao,
    handleGerarReceita,
  };
}
