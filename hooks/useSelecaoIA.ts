import { router } from "expo-router";
import { useMemo, useState } from "react";
import { Alert } from "react-native";
import { CATEGORIAS_DISPENSA } from "../constants/ingredients";
import { perguntarAoGemini } from "../services/geminiService";
import { gerarImagemDaReceita } from "../services/huggingFaceService";
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
        Atue como um Chef de Cozinha profissional. Crie uma receita criativa focando nestes ingredientes da dispensa do usuário: ${selecionados.join(", ")}. 
        Considere que o usuário sempre tem: água, sal e óleo.

        REGRAS OBRIGATÓRIAS DE RESPOSTA (JSON APENAS):
        1. nome_receita: Título da receita (Máximo 4 palavras).
        2. tempo_preparo: Formato padrão colado (ex: "20min", "1h30min"). SEM ESPAÇOS.
        3. dificuldade: Escolha entre "Fácil", "Média" ou "Difícil".
        4. calorias: Estime o valor. RETORNE APENAS O NÚMERO E A SIGLA (ex: "500 kcal").
        5. dica_rapida: Dica técnica curta e útil (OBRIGATÓRIO).
        6. descricao_simples_preparo: Resumo TÉCNICO do preparo em 1 ou 2 frases. Evite tom de marketing.
        7. pre_visualizacao_passos: Lista de strings com 3 a 5 passos NUMERADOS resumidos (OBRIGATÓRIO).
        8. ingredientes: Lista de objetos { 
           "unidade": string (ex: "unidade", "g", "ml", "colher (sopa)"),
           "nome_base": string (nome limpo do ingrediente),
           "quantidade": number (VALOR NUMÉRICO APENAS),
           "texto_original": string (A frase completa: ex: "2 colheres de sopa de açúcar"),
           "quantidade_gramas_ml": number (Valor convertido para g ou ml)
        }.
        9. passos_detalhados: Lista de objetos { "titulo": string, "descricao": string, "dica_do_chef": string, "tempo_timer_minutos": number }.
           REGRAS PARA TIMER: tempo_timer_minutos DEVE SER 0 para ações manuais (picar, mexer, montar). Use > 0 apenas para fogo, forno ou espera.
        10. tags: Lista de strings. Escolha APENAS entre: ["Salgadas", "Doces", "Rápidas", "Saudáveis", "Econômicas", "Lanches", "Jantar", "Almoço"].
        11. preferencias: Lista de strings. Escolha APENAS entre: ["vegano", "vegetariano", "sem_gluten", "sem_lactose", "baixo_carboidrato", "sem_acucar"]. Retorne [] se não aplicar.
        12. alergias_presentes: Lista de strings. Escolha APENAS entre: ["amendoim", "nozes", "leite", "ovo", "soja", "trigo", "gergelim", "frutos_do_mar"]. Retorne [] se for livre de alérgenos.

        Retorne APENAS o JSON puro, sem markdown ou explicações.`;

      // Envia o prompt para a IA e processa a resposta
      const respostaIA = await perguntarAoGemini(prompt);
      const textoLimpo = limparJSONIA(respostaIA);
      const receitaGerada: ReceitaIAResponse = JSON.parse(textoLimpo);

      // Gera a imagem e já salva em Base64
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
          image: imagemBase64, // Enviando o Base64 da imagem
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
