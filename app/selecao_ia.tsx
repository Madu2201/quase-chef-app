import { ChevronDown, ChevronUp, RotateCcw, X, Zap } from "lucide-react-native";
import React, { memo, useMemo } from "react";
import {
    Image,
    Pressable,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Animated, {
    FadeInDown,
    FadeInRight,
    Layout,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Meus imports
import { GenerateButton } from "../components/generate_button";
import { Header } from "../components/header";
import { Colors } from "../constants/theme";
import { useSelecaoIA } from "../hooks/useSelecaoIA";
import { styles } from "../styles/selecao_ia_styles";
import type { Ingredient } from "../types/despensa";
import { formatarQuantidade } from "../utils/normalization";

// --- SUB-COMPONENTES AUXILIARES (MEMOIZADOS) ---

/** Bandeja horizontal de itens já selecionados */
const SelectedTray = memo(
  ({
    items,
    onRemove,
  }: {
    items: Ingredient[];
    onRemove: (id: string) => void;
  }) => {
    if (items.length === 0) return null;

    return (
      <View style={styles.trayWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.trayScrollContent}
        >
          {items.map((ing) => (
            <Animated.View
              key={`tray-${ing.id}`}
              entering={FadeInRight.duration(300)}
            >
              <TouchableOpacity
                style={styles.trayItem}
                onPress={() => onRemove(ing.id)}
                activeOpacity={0.8}
              >
                <Text style={styles.trayItemText}>{ing.name}</Text>
                <X size={14} color={Colors.light} />
              </TouchableOpacity>
            </Animated.View>
          ))}
        </ScrollView>
      </View>
    );
  },
);

/** Chip individual de ingrediente na lista principal */
const IngredientChip = memo(
  ({
    ing,
    isSelected,
    onToggle,
  }: {
    ing: Ingredient;
    isSelected: boolean;
    onToggle: (id: string) => void;
  }) => {
    // Formatação local para evitar poluição no JSX principal
    const formattedQty = useMemo(() => {
      const q = Number(ing.qty);
      if (!Number.isFinite(q)) return ing.unit || "";
      const arredondado = formatarQuantidade(q);
      const texto =
        arredondado % 1 === 0
          ? String(arredondado)
          : arredondado.toFixed(2).replace(/\.?0+$/, "");
      return `${texto} ${ing.unit}`.trim();
    }, [ing.qty, ing.unit]);

    return (
      <Pressable
        onPress={() => onToggle(ing.id)}
        style={[styles.chipIngredient, isSelected && styles.chipIngredientActive]}
      >
        <View style={styles.chipTextBlock}>
          <Text style={[styles.chipText, isSelected && styles.chipTextActive]}>
            {ing.name}
          </Text>
          <Text style={[styles.chipMeta, isSelected && styles.chipMetaActive]}>
            {formattedQty}
          </Text>
        </View>
      </Pressable>
    );
  },
);

// --- TELA PRINCIPAL ---

export default function SelecaoIAScreen() {
  const insets = useSafeAreaInsets();

  const {
    busca,
    setBusca,
    selecionadosCount,
    ingredientesSelecionados,
    categoriasColapsadas,
    toggleCategoria,
    isGenerating,
    categoriasFiltradas,
    toggleIngrediente,
    limparSelecao,
    handleGerarReceita,
    selecionadosIds,
  } = useSelecaoIA();

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
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 140 },
        ]}
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

        {/* Título e Contador */}
        <Animated.View
          entering={FadeInDown.delay(150)}
          style={styles.sectionTitleContainer}
        >
          <Text style={styles.sectionTitleText}>
            Ingredientes da minha despensa:
          </Text>
        </Animated.View>

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

        {/* Bandeja de Selecionados */}
        <SelectedTray
          items={ingredientesSelecionados}
          onRemove={toggleIngrediente}
        />

        {/* Listagem de Categorias (Alfabética) */}
        {categoriasFiltradas.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {busca
                ? "Nenhum ingrediente encontrado."
                : "Sua despensa está vazia."}
            </Text>
          </View>
        ) : (
          categoriasFiltradas.map((cat, idx) => {
            const isCollapsed = categoriasColapsadas.includes(cat.titulo);

            return (
              <Animated.View
                key={cat.titulo}
                entering={FadeInDown.delay(200 + idx * 50)}
                layout={Layout.springify()}
                style={styles.categoryContainer}
              >
                {/* Header Alfabético Estilizado */}
                <TouchableOpacity
                  style={styles.sectionHeader}
                  onPress={() => toggleCategoria(cat.titulo)}
                  activeOpacity={0.7}
                >
                  <View style={styles.categoryHeaderContent}>
                    <View style={styles.alphabetBadge}>
                      <Text style={styles.alphabetLetter}>{cat.titulo}</Text>
                    </View>
                    <View style={styles.quantityPill}>
                      <Text style={styles.quantityText}>
                        {cat.itens.length}{" "}
                        {cat.itens.length === 1 ? "item" : "itens"}
                      </Text>
                    </View>
                    <View style={styles.headerDivider} />
                  </View>
                  {isCollapsed ? (
                    <ChevronDown size={20} color={styles.chevronIcon.color} />
                  ) : (
                    <ChevronUp size={20} color={styles.chevronIcon.color} />
                  )}
                </TouchableOpacity>

                {/* Lista de Chips (Sanfona) */}
                {!isCollapsed && (
                  <View style={styles.chipsWrapper}>
                    {cat.itens.map((ing) => (
                      <IngredientChip
                        key={ing.id}
                        ing={ing}
                        isSelected={selecionadosIds.includes(ing.id)}
                        onToggle={toggleIngrediente}
                      />
                    ))}
                  </View>
                )}
              </Animated.View>
            );
          })
        )}
      </ScrollView>

      {/* Rodapé Fixo */}
      <View style={styles.footer}>
        <GenerateButton
          label={isGenerating ? "Cozinhando ideias... 🍳" : "Gerar Receita Mágica"}
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
