import { RotateCcw, Zap } from "lucide-react-native";
import React from "react";
import { Image, Pressable, ScrollView, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown, Layout } from "react-native-reanimated";

// Meus imports
import { GenerateButton } from "../components/generate_button";
import { Header } from "../components/header";
import { Colors } from "../constants/theme";
import { useSelecaoIA } from "../hooks/useSelecaoIA";
import { styles } from "../styles/selecao_ia_styles";
import { getCategoriaIcon } from "../utils/iaUtils";

// Formata qty como na dispensa (evita ruído em decimais)
function formatQuantidadeEUnidade(qty: number, unit: string): string {
  const q = Number(qty);
  if (!Number.isFinite(q)) {
    return unit || "";
  }
  const arredondado = Math.round(q * 1000) / 1000;
  const texto =
    arredondado % 1 === 0
      ? String(arredondado)
      : arredondado.toFixed(2).replace(/\.?0+$/, "");
  return `${texto} ${unit}`.trim();
}

// Tela de Seleção de Ingredientes para IA
export default function SelecaoIAScreen() {
  const {
    busca,
    setBusca,
    selecionadosCount,
    isGenerating,
    categoriasFiltradas,
    toggleIngrediente,
    limparSelecao,
    handleGerarReceita,
    selecionadosIds,
  } = useSelecaoIA();

  // Renderiza a tela
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
              uri: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1470&q=80",
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

        {/* Linha de Ação (Contador e Limpar) */}
        <View style={styles.actionRow}>
          <Text style={styles.countText}>
            {selecionadosCount}{" "}
            {selecionadosCount === 1 ? "selecionado" : "selecionados"}
          </Text>
          {selecionadosCount > 0 && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={limparSelecao}
            >
              <RotateCcw size={14} color={Colors.primary} />
              <Text style={styles.clearButtonText}>Limpar</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Listagem de Categorias e Chips */}
        {categoriasFiltradas.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {busca
                ? "Nenhum ingrediente encontrado com essa busca."
                : "Sua dispensa está vazia. Adicione ingredientes para gerar receitas!"}
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
                {/* Ícone dinâmico vindo do utilitário */}
                {getCategoriaIcon(cat.icon)}
                <Text style={styles.categoryTitle}>{cat.titulo}</Text>
              </View>

              <View style={styles.chipsWrapper}>
                {cat.itens.map((ing) => {
                  const isSelected = selecionadosIds.includes(ing.id);
                  return (
                    <Pressable
                      key={ing.id}
                      onPress={() => toggleIngrediente(ing.id)}
                      style={[styles.chip, isSelected && styles.chipActive]}
                    >
                      <View style={styles.chipTextBlock}>
                        <Text
                          style={[
                            styles.chipText,
                            isSelected && styles.chipTextActive,
                          ]}
                        >
                          {ing.name}
                        </Text>
                        <Text
                          style={[
                            styles.chipMeta,
                            isSelected && styles.chipMetaActive,
                          ]}
                        >
                          {formatQuantidadeEUnidade(ing.qty, ing.unit)}
                        </Text>
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            </Animated.View>
          ))
        )}
      </ScrollView>

      {/* Footer com Botão Gerador */}
      <View style={styles.footer}>
        <GenerateButton
          label={
            isGenerating ? "Cozinhando ideias... 🍳" : "Gerar Receita Mágica"
          }
          selectedCount={selecionadosCount}
          onPress={() => handleGerarReceita()}
          disabled={isGenerating}
          loading={isGenerating}
          alwaysVisible={true}
          showBadge={false}
        />
      </View>
    </View>
  );
}
