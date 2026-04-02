import { router } from "expo-router";
import { Flame, Leaf, RotateCcw, Sparkles, Utensils, Zap } from "lucide-react-native";
import React, { useMemo, useState } from "react";
import { Image, Pressable, ScrollView, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown, Layout } from "react-native-reanimated";

// Meus importes
import { GenerateButton } from "../components/generate_button";
import { Header } from "../components/header";
import { Colors } from "../constants/theme";
import { styles } from "../styles/selecao_ia_styles";

// Importa a função de perguntar ao Gemini
import { perguntarAoGemini } from "../services/geminiService";


// Dados mockados para categorias e itens
const CATEGORIAS = [
  {
    titulo: "PROTEÍNAS",
    icon: <Flame size={14} color={Colors.dark} />,
    itens: ["Ovos", "Frango", "Carne Moída", "Peixe", "Tofu", "Feijão"]
  },
  {
    titulo: "VEGETAIS",
    icon: <Leaf size={14} color={Colors.dark} />,
    itens: ["Tomate", "Cebola", "Pimentão", "Brócolis", "Cenoura", "Espinafre", "Abobrinha"]
  },
  {
    titulo: "CARBOIDRATOS",
    icon: <Utensils size={14} color={Colors.dark} />,
    itens: ["Arroz", "Macarrão", "Batata", "Pão", "Cuscuz", "Tapioca"]
  },
  {
    titulo: "GRÃOS E CEREAIS",
    icon: <Sparkles size={14} color={Colors.dark} />,
    itens: ["Arroz Branco", "Arroz Integral", "Feijão Preto", "Feijão Carioca", "Lentilha", "Grão de Bico", "Macarrão Espaguete"]
  },
  {
    titulo: "TEMPEROS BASICOS",
    icon: <Zap size={14} color={Colors.dark} />,
    itens: ["Alho", "Sal", "Pimenta do Reino", "Azeite", "Orégano", "Manjericão", "Páprica"]
  }
];

// Tela de Seleção de Ingredientes para IA
export default function SelecaoIAScreen() {
  const [busca, setBusca] = useState("");
  const [selecionados, setSelecionados] = useState<string[]>([]);

  // 2. Adicione este novo estado para controlar o carregamento da IA
  const [isGenerating, setIsGenerating] = useState(false);
  const toggleIngrediente = (item: string) => {
    if (selecionados.includes(item)) {
      setSelecionados(selecionados.filter(i => i !== item));
    } else {
      setSelecionados([...selecionados, item]);
    }
  };

  const limparSelecao = () => setSelecionados([]);

  const categoriasFiltradas = useMemo(() => {
    return CATEGORIAS.map(cat => ({
      ...cat,
      itens: cat.itens.filter(item =>
        item.toLowerCase().includes(busca.toLowerCase())
      )
    })).filter(cat => cat.itens.length > 0);
  }, [busca]);

  // Função para navegar enviando a flag de IA e dados mockados
  const handleGerarReceita = async () => {
    if (selecionados.length === 0) {
      alert("Selecione pelo menos um ingrediente da dispensa!");
      return;
    }

    setIsGenerating(true);

    try {
      // 1. O SUPER PROMPT: Usando chaves em Português para a IA não tentar traduzir!
      const prompt = `Atue como um chef criativo. Crie uma receita deliciosa focando nestes ingredientes: ${selecionados.join(", ")}. Pode assumir que tenho água, sal e óleo.
      
      CRÍTICO: Sua resposta deve ser ÚNICA E EXCLUSIVAMENTE um objeto JSON válido. Use exatamente esta estrutura:
      {
        "titulo": "Nome criativo da receita",
        "descricao": "Uma breve frase de dar água na boca",
        "tempo": "30 min",
        "dificuldade": "Fácil",
        "calorias": "350 kcal",
        "dicaIA": "Uma dica de ouro para essa receita ficar perfeita",
        "ingredientes": [
          "Quantidade e nome do ingrediente 1",
          "Quantidade e nome do ingrediente 2"
        ],
        "passos": [
          {
            "titulo": "Nome do passo",
            "descricao": "Instruções detalhadas",
            "dica_do_chef": "Dica extra opcional",
            "tempo_timer_minutos": 0
          }
        ]
      }`;

      const respostaIA = await perguntarAoGemini(prompt);
      const textoLimpo = respostaIA.replace(/```json/gi, '').replace(/```/gi, '').trim();
      const receitaGerada = JSON.parse(textoLimpo);

      // 4. Mandando os dados com proteção extra (aceita a chave em PT ou EN)
      router.push({
        pathname: "/detalhe_receita",
        params: {
          tipo: 'ia',
          title: receitaGerada.titulo || receitaGerada.title || "Receita Surpresa",
          description: receitaGerada.descricao || receitaGerada.description || "Sem descrição",
          time: receitaGerada.tempo || receitaGerada.time || "30 min",
          difficulty: receitaGerada.dificuldade || receitaGerada.difficulty || "Média",
          calories: receitaGerada.calorias || receitaGerada.calories || "N/A",
          dicaIA: receitaGerada.dicaIA || "",
          ingredients: JSON.stringify(receitaGerada.ingredientes || receitaGerada.ingredients || []),
          steps: JSON.stringify(receitaGerada.passos || receitaGerada.steps || [])
        }
      });

    } catch (error) {
      console.error("Erro na IA ou no JSON:", error);
      alert("Nossa panela queimou! Tente gerar novamente.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header
        title="O que temos hoje?"
        centerTitle
        showBackButton
        showSearch
        searchText={busca}
        setSearchText={setBusca}
        searchPlaceholder="Buscar ingrediente..."
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Banner Hero */}
        <Animated.View entering={FadeInDown.delay(100)} style={styles.heroCard}>
          <View style={styles.heroTextArea}>
            <View style={styles.heroTag}>
              <Zap size={10} color={Colors.primary} fill={Colors.primary} />
              <Text style={styles.heroTagText}>IA GASTRONÔMICA</Text>
            </View>
            <Text style={styles.heroTitle}>Cozinha Inteligente</Text>
            <Text style={styles.heroSubtitle}>Selecione os itens e crie sua receita.</Text>
          </View>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80' }}
            style={styles.heroImage}
          />
        </Animated.View>

        {/* Título da Seção */}
        <Animated.View entering={FadeInDown.delay(150)} style={styles.sectionTitleContainer}>
          <Text style={styles.sectionTitleText}>Ingredientes da minha dispensa:</Text>
        </Animated.View>

        {/* Linha de Ação */}
        <View style={styles.actionRow}>
          <Text style={styles.countText}>
            {selecionados.length} {selecionados.length === 1 ? 'selecionado' : 'selecionados'}
          </Text>
          {selecionados.length > 0 && (
            <TouchableOpacity style={styles.clearButton} onPress={limparSelecao}>
              <RotateCcw size={14} color={Colors.primary} />
              <Text style={styles.clearButtonText}>Limpar</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Categorias e Chips */}
        {categoriasFiltradas.map((cat, idx) => (
          <Animated.View
            key={cat.titulo}
            entering={FadeInDown.delay(200 + idx * 100)}
            layout={Layout.springify()}
            style={styles.categoryContainer}
          >
            <View style={styles.sectionHeader}>
              {cat.icon}
              <Text style={styles.categoryTitle}>{cat.titulo}</Text>
            </View>

            <View style={styles.chipsWrapper}>
              {cat.itens.map((item) => {
                const isSelected = selecionados.includes(item);
                return (
                  <Pressable
                    key={item}
                    onPress={() => toggleIngrediente(item)}
                    style={[styles.chip, isSelected && styles.chipSelected]}
                  >
                    <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                      {item}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </Animated.View>
        ))}
      </ScrollView>

      {/* Footer com Botão Gerador Reutilizável */}
      <View style={styles.footer}>
        <GenerateButton
          label={isGenerating ? "Cozinhando ideias... 🍳" : "Gerar Receita Mágica"}
          selectedCount={selecionados.length}
          onPress={handleGerarReceita}
          style={[styles.generateButton, isGenerating ? { opacity: 0.7 } : null]}
          iconColor={isGenerating ? Colors.primary : Colors.light} // Deixa meio transparente se estiver carregando
          alwaysVisible={true}
          showBadge={false}
          disabled={isGenerating} // Evita que o usuário clique duas vezes enquanto a IA pensa
        />
      </View>
    </View>
  );
}