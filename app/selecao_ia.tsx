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

// Tela de Seleção de Ingredientes para IA
export default function SelecaoIAScreen() {
  const {
    busca,
    setBusca,
    selecionados,
    isGenerating,
    categoriasFiltradas,
    toggleIngrediente,
    limparSelecao,
    handleGerarReceita,
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

      {/* Footer com Botão Gerador */}
      <View style={styles.footer}>
        <GenerateButton
          label={
            isGenerating ? "Cozinhando ideias... 🍳" : "Gerar Receita Mágica"
          }
          selectedCount={selecionados.length}
          onPress={handleGerarReceita}
          disabled={isGenerating}
          style={isGenerating ? { opacity: 0.7 } : null}
          iconColor={isGenerating ? Colors.primary : Colors.light}
          alwaysVisible={true}
          showBadge={false}
        />
      </View>
    </View>
  );
}
