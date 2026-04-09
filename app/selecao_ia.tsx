import { router } from "expo-router";
import {
  Flame,
  Leaf,
  RotateCcw,
  Sparkles,
  Utensils,
  Zap,
} from "lucide-react-native";
import React, { useMemo, useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown, Layout } from "react-native-reanimated";

// Meus imports
import { GenerateButton } from "../components/generate_button";
import { Header } from "../components/header";
import { CATEGORIAS_DISPENSA } from "../constants/ingredients";
import { Colors } from "../constants/theme";
import { useDispensa } from "../hooks/useDispensa";
import { styles } from "../styles/selecao_ia_styles";

// Importa a função de perguntar ao Gemini
import { perguntarAoGemini } from "../services/geminiService";

// Tela de Seleção de Ingredientes para IA
export default function SelecaoIAScreen() {
  const [busca, setBusca] = useState("");
  const [selecionados, setSelecionados] = useState<string[]>([]);

  // 2. Adicione este novo estado para controlar o carregamento da IA
  const [isGenerating, setIsGenerating] = useState(false);

  const { filteredIngredients } = useDispensa();

  const toggleIngrediente = (item: string) => {
    if (selecionados.includes(item)) {
      setSelecionados(selecionados.filter((i) => i !== item));
    } else {
      setSelecionados([...selecionados, item]);
    }
  };

  const limparSelecao = () => setSelecionados([]);

  // Agrupar ingredientes da dispensa por categorias (sem repetição)
  const categoriasComItens = useMemo(() => {
    // Verificação de segurança para evitar erros se filteredIngredients for undefined
    if (!filteredIngredients || !Array.isArray(filteredIngredients)) {
      return [];
    }

    // Rastrear quais ingredientes já foram atribuídos a uma categoria
    const ingredientesAtribuidos = new Set<string>();

    // Função para verificar se um ingrediente corresponde a um item da categoria
    const verificarCorrespondencia = (
      ingName: string,
      catItem: string,
    ): boolean => {
      const ingLower = ingName.toLowerCase().trim();
      const itemLower = catItem.toLowerCase().trim();

      // Correspondência exata ou contém
      if (
        ingLower === itemLower ||
        ingLower.includes(itemLower) ||
        itemLower.includes(ingLower)
      ) {
        return true;
      }

      // Variações comuns
      const variacoes: { [key: string]: string[] } = {
        ovo: ["ovos", "ovo", "egg"],
        frango: ["frango", "chicken", "galinha"],
        carne: [
          "carne moída",
          "carne vermelha",
          "carne",
          "beef",
          "ground meat",
        ],
        peixe: ["peixe", "fish", "salmão", "sardinha"],
        tofu: ["tofu", "soja"],
        feijão: ["feijão", "feijão preto", "feijão carioca", "beans"],
        lentilha: ["lentilha", "lentilhas"],
        grão: ["grão de bico", "grão", "chickpea"],
        tomate: ["tomate", "tomato", "tomate cereja"],
        cebola: ["cebola", "onion", "cebola roxa"],
        pimentão: ["pimentão", "pepper", "pimentão vermelho"],
        brócolis: ["brócolis", "brócolis"],
        cenoura: ["cenoura", "carrot"],
        espinafre: ["espinafre", "spinach"],
        abobrinha: ["abobrinha", "zucchini"],
        batata: ["batata", "potato", "batata doce"],
        arroz: ["arroz", "rice", "arroz branco", "arroz integral"],
        macarrão: ["macarrão", "pasta", "espaguete"],
        pão: ["pão", "bread"],
        cuscuz: ["cuscuz", "couscous"],
        tapioca: ["tapioca", "mandioca"],
        alho: ["alho", "garlic"],
        sal: ["sal", "salt"],
        pimenta: ["pimenta", "pimenta do reino", "pepper"],
        azeite: ["azeite", "olive oil"],
        óleo: ["óleo", "oil", "óleo de girassol"],
        vinagre: ["vinagre", "vinegar"],
        orégano: ["orégano", "oregano"],
        manjericão: ["manjericão", "basil"],
        páprica: ["páprica", "paprika"],
      };

      for (const [key, values] of Object.entries(variacoes)) {
        if (values.some((v) => ingLower.includes(v.toLowerCase()))) {
          if (values.some((v) => itemLower.includes(v.toLowerCase()))) {
            return true;
          }
        }
      }

      return false;
    };

    const categorias = CATEGORIAS_DISPENSA.map((cat) => {
      const itensFiltrados = filteredIngredients.filter((ing) => {
        // Pula ingredientes já atribuídos a outra categoria
        if (ingredientesAtribuidos.has(ing.name.toLowerCase())) {
          return false;
        }

        // Procura correspondência na categoria atual
        const temCorrespondencia = cat.itens.some((item) =>
          verificarCorrespondencia(ing.name, item),
        );

        // Se encontrou correspondência, marca como atribuído
        if (temCorrespondencia) {
          ingredientesAtribuidos.add(ing.name.toLowerCase());
        }

        return temCorrespondencia;
      });

      return {
        ...cat,
        icon:
          cat.icon === "Flame" ? (
            <Flame size={14} color={Colors.dark} />
          ) : cat.icon === "Leaf" ? (
            <Leaf size={14} color={Colors.dark} />
          ) : cat.icon === "Utensils" ? (
            <Utensils size={14} color={Colors.dark} />
          ) : cat.icon === "Sparkles" ? (
            <Sparkles size={14} color={Colors.dark} />
          ) : (
            <Zap size={14} color={Colors.dark} />
          ),
        itens: itensFiltrados.map((ing) => ing.name),
      };
    });

    // Adicionar categoria "Outros" para itens não categorizados
    const outrosItens = filteredIngredients.filter(
      (ing) => !ingredientesAtribuidos.has(ing.name.toLowerCase()),
    );

    if (outrosItens.length > 0) {
      categorias.push({
        titulo: "OUTROS",
        icon: <RotateCcw size={14} color={Colors.dark} />,
        itens: outrosItens.map((ing) => ing.name),
      });
    }

    return categorias.filter((cat) => cat.itens.length > 0);
  }, [filteredIngredients]);

  // 3. Filtra os itens com base na busca, mantendo a estrutura de categorias
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
      alert("Selecione pelo menos um ingrediente da sua dispensa!");
      return;
    }

    setIsGenerating(true);

    try {
      // 4. Cria o prompt para a IA usando os ingredientes selecionados
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
      const textoLimpo = respostaIA
        .replace(/```json/gi, "")
        .replace(/```/gi, "")
        .trim();
      const receitaGerada = JSON.parse(textoLimpo);

      // 5. Navega para a tela de detalhes da receita, passando os dados gerados pela IA
      const receitaId = `ia-${Date.now()}`;
      router.push({
        pathname: "/detalhe_receita",
        params: {
          id: receitaId,
          tipo: "ia",
          title:
            receitaGerada.titulo || receitaGerada.title || "Receita Surpresa",
          description:
            receitaGerada.descricao ||
            receitaGerada.description ||
            "Sem descrição",
          time: receitaGerada.tempo || receitaGerada.time || "30 min",
          difficulty:
            receitaGerada.dificuldade || receitaGerada.difficulty || "Média",
          calories: receitaGerada.calorias || receitaGerada.calories || "N/A",
          dicaIA: receitaGerada.dicaIA || "",
          ingredients: JSON.stringify(
            receitaGerada.ingredientes || receitaGerada.ingredients || [],
          ),
          steps: JSON.stringify(
            receitaGerada.passos || receitaGerada.steps || [],
          ),
        },
      });
    } catch (error) {
      console.error("Erro na IA ou no JSON:", error);
      alert("Nossa panela queimou! Tente gerar novamente.");
    } finally {
      setIsGenerating(false);
    }
  };

  // 6. O restante do código permanece o mesmo, apenas adicionamos a lógica de carregamento e a navegação com os dados da IA
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

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Banner Hero */}
        <Animated.View entering={FadeInDown.delay(100)} style={styles.heroCard}>
          <View style={styles.heroTextArea}>
            <View style={styles.heroTag}>
              <Zap size={10} color={Colors.primary} fill={Colors.primary} />
              <Text style={styles.heroTagText}>IA GASTRONÔMICA</Text>
            </View>
            <Text style={styles.heroTitle}>Cozinha Inteligente</Text>
            <Text style={styles.heroSubtitle}>
              Selecione os itens e crie sua receita.
            </Text>
          </View>
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
            }}
            style={styles.heroImage}
          />
        </Animated.View>

        {/* Título da Seção */}
        <Animated.View
          entering={FadeInDown.delay(150)}
          style={styles.sectionTitleContainer}
        >
          <Text style={styles.sectionTitleText}>
            Ingredientes da minha dispensa:
          </Text>
        </Animated.View>

        {/* Linha de Ação */}
        <View style={styles.actionRow}>
          <Text style={styles.countText}>
            {selecionados.length}{" "}
            {selecionados.length === 1 ? "selecionado" : "selecionados"}
          </Text>
          {selecionados.length > 0 && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={limparSelecao}
            >
              <RotateCcw size={14} color={Colors.primary} />
              <Text style={styles.clearButtonText}>Limpar</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Categorias e Chips */}
        {categoriasFiltradas.length === 0 ? (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              paddingHorizontal: 20,
            }}
          >
            <Text
              style={{
                color: Colors.subtext,
                fontSize: 16,
                textAlign: "center",
              }}
            >
              {busca
                ? "Nenhum ingrediente encontrado com essa busca."
                : "Sua dispensa está vazia. Adicione ingredientes para gerar receitas com IA!"}
            </Text>
          </View>
        ) : (
          categoriasFiltradas.map((cat, idx) => (
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
                      style={[styles.chip, isSelected && styles.chipActive]}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          isSelected && styles.chipTextActive,
                        ]}
                      >
                        {item}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </Animated.View>
          ))
        )}
      </ScrollView>

      {/* Footer com Botão Gerador Reutilizável */}
      <View style={styles.footer}>
        <GenerateButton
          label={
            isGenerating ? "Cozinhando ideias... 🍳" : "Gerar Receita Mágica"
          }
          selectedCount={selecionados.length}
          onPress={handleGerarReceita}
          style={
            isGenerating
              ? [styles.generateButton, { opacity: 0.7 }]
              : styles.generateButton
          }
          iconColor={isGenerating ? Colors.primary : Colors.light} // Deixa meio transparente se estiver carregando
          alwaysVisible={true}
          showBadge={false}
          disabled={isGenerating} // Evita que o usuário clique duas vezes enquanto a IA pensa
        />
      </View>
    </View>
  );
}
