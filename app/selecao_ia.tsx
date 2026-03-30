import React, { useState, useMemo } from "react";
import { View, Text, ScrollView, TouchableOpacity, Pressable, Image } from "react-native";
import { Sparkles, RotateCcw, Leaf, Flame, Utensils, Zap } from "lucide-react-native";
import Animated, { FadeInDown, Layout } from "react-native-reanimated";
import { router } from "expo-router";

// Meus importes
import { Header } from "../components/header";
import { GenerateButton } from "../components/generate_button";
import { Colors } from "../constants/theme";
import { styles } from "../styles/selecao_ia_styles";

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
  const handleGerarReceita = () => {
    router.push({
      pathname: "/detalhe_receita",
      params: {
        tipo: 'ia',
        title: 'Risoto de Sobras Criativo',
        description: 'Uma combinação inteligente baseada nos itens selecionados da sua dispensa.'
      }
    });
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
          label="Gerar Receita Mágica"
          selectedCount={selecionados.length}
          onPress={handleGerarReceita}
          style={styles.generateButton}
          alwaysVisible={true} // O botão não some mais
          showBadge={false}    // Remove o badge interno
        />
      </View>
    </View>
  );
}