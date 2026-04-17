import { router } from "expo-router";
import {
    Heart,
    Package
} from "lucide-react-native";
import React, { useEffect, useMemo, useState } from "react";
import {
    FlatList, Image, Pressable, ScrollView,
    StatusBar, Switch, Text, View
} from "react-native";
import Animated, {
    FadeInDown, FadeInRight, useAnimatedStyle,
    useSharedValue, withSequence, withSpring
} from "react-native-reanimated";

// Meus imports
import { Header } from "../../components/header";
import { BASE_CHIPS, IA_CHIP } from "../../constants/filtros";
import { Colors } from "../../constants/theme";
import { useFavoritosGlobal, useFavoritosLogic } from "../../hooks/useFavoritos";
import { useFiltroEstoque } from "../../hooks/useFiltroEstoque";
import { Recipe } from "../../hooks/useReceitas";
import { favStyles as styles } from "../../styles/favoritos_styles";
import { ChipItem } from "../../types/favoritos";

// Configuração dos Filtros
const CHIPS: ChipItem[] = [BASE_CHIPS[0], IA_CHIP, ...BASE_CHIPS.slice(1)];

export default function FavoritosScreen() {
  const [useEstoque, setUseEstoque] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filtro, setFiltro] = useState("Todas");
  const [hasMounted, setHasMounted] = useState(false);

  // Consome a lógica unificada de filtragem (SEM o estoque aqui)
  const { receitasFiltradas: listaBaseFavoritos } = useFavoritosLogic(searchText, filtro);
  const { filtrarPorEstoque } = useFiltroEstoque();

  // Aplica o filtro de estoque no final, apenas para renderização
  const receitasRenderizadas = useMemo(() => {
    if (useEstoque) {
      return filtrarPorEstoque(listaBaseFavoritos);
    }
    return listaBaseFavoritos;
  }, [listaBaseFavoritos, useEstoque, filtrarPorEstoque]);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <Header
        title="Favoritos"
        centerTitle
        searchText={searchText}
        setSearchText={setSearchText}
        searchPlaceholder="Buscar receitas salvas..."
      >
        <View style={styles.stockToggle}>
          <Package size={18} color={Colors.primary} />
          <Text style={styles.stockText}>Cozinhar com meu estoque</Text>
          <Switch
            trackColor={{ false: Colors.subtext + "30", true: Colors.secondary }}
            thumbColor={Colors.light}
            onValueChange={setUseEstoque}
            value={useEstoque}
            style={styles.switchStyle}
          />
        </View>
      </Header>

      {/* Header da Lista: Chips de Filtro */}
      <View style={styles.listHeaderContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.chipsScroll}
          contentContainerStyle={styles.chipsScrollContent}
        >
          {CHIPS.map((chip, index) => (
            <Animated.View
              key={chip.label}
              entering={!hasMounted ? FadeInRight.delay(index * 100).duration(500) : undefined}
            >
              <Chip
                active={filtro === chip.label}
                onPress={() => setFiltro(chip.label)}
                label={chip.label}
                icon={
                  <chip.icon
                    size={14}
                    color={filtro === chip.label ? Colors.light : Colors.primary}
                  />
                }
              />
            </Animated.View>
          ))}
        </ScrollView>

        <View style={styles.infoBar}>
          <Text style={styles.infoText}>
            {receitasRenderizadas.length} {receitasRenderizadas.length === 1 ? "receita salva" : "receitas salvas"}
          </Text>
        </View>
      </View>

      {/* Grid de Receitas */}
      {receitasRenderizadas.length === 0 ? (
        <EmptyState isSearch={!!searchText || filtro !== "Todas"} />
      ) : (
        <FlatList
          data={receitasRenderizadas}
          keyExtractor={(item) => String(item.id)}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <RecipeCard item={item} index={index} hasMounted={hasMounted} />
          )}
        />
      )}
    </View>
  );
}

/** Componente de Card Individual */
const RecipeCard = ({ item, index, hasMounted }: { item: Recipe; index: number; hasMounted: boolean }) => {
  const { isFavorito, toggleFavorito } = useFavoritosGlobal();
  const scale = useSharedValue(1);
  const ehFav = isFavorito(item.id);

  const animatedHeartStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handleLike = () => {
    scale.value = withSequence(withSpring(1.3), withSpring(1));
    toggleFavorito(item.id, item);
  };

  return (
    <Animated.View
      entering={!hasMounted ? FadeInDown.delay(index * 150).springify() : undefined}
      style={styles.card}
    >
      <Pressable onPress={() => router.push({ pathname: "/detalhe_receita", params: {
          id: item.id,
          tipo: item.tipo,
          title: item.title,
          image: item.image,
          time: item.time,
          difficulty: item.difficulty,
          calories: item.calories,
          description: item.descStart,
        } })}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: item.image }} style={styles.image} resizeMode="cover" />

          <Pressable style={styles.heartIcon} onPress={handleLike} hitSlop={10}>
            <Animated.View style={animatedHeartStyle}>
              <Heart
                size={16}
                color={ehFav ? Colors.secondary : Colors.subtext}
                fill={ehFav ? Colors.secondary : "transparent"}
              />
            </Animated.View>
          </Pressable>
        </View>

        <View style={styles.cardInfo}>
          <Text style={styles.recipeName} numberOfLines={2}>{item.title}</Text>
          <Text style={styles.recipeDetail}>{item.time} • {item.difficulty}</Text>
        </View>
      </Pressable>
    </Animated.View>
  );
};

/** Componente de Chip (Filtro) */
const Chip = ({ active, icon, label, onPress }: any) => (
  <Pressable onPress={onPress} style={[styles.chip, active && styles.chipActive]}>
    {icon}
    <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
  </Pressable>
);

/** Feedback visual para lista vazia */
const EmptyState = ({ isSearch }: { isSearch: boolean }) => (
  <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
    <Heart size={48} color={Colors.subtext} style={{ marginBottom: 15, opacity: 0.3 }} />
    <Text style={{ color: Colors.subtext, fontSize: 16, textAlign: "center", lineHeight: 22 }}>
      {isSearch
        ? "Nenhum favorito encontrado para os filtros selecionados."
        : "Sua pasta de favoritos está vazia.\nSalve receitas para acessá-las aqui!"}
    </Text>
  </View>
);