import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, FlatList, Image, Pressable, Switch,
  ScrollView, StatusBar, TouchableOpacity,
  ListRenderItemInfo, NativeSyntheticEvent, NativeScrollEvent
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';

// Componentes e Estilos
import { Header } from '../../components/header';
import { receitasStyles as styles } from '../../styles/receitas_styles';
import { Colors } from '../../constants/theme';

// Tipagens
interface Recipe {
  id: string; title: string; time: string; difficulty: string;
  descStart: string; ingredients: string; descEnd: string; image: string;
}

interface ChipItem {
  label: string; icon: keyof typeof Ionicons.glyphMap;
}

const DATA: Recipe[] = [
  { id: '1', title: 'Omelete de queijo', time: '15 min', difficulty: 'Fácil', descStart: 'Aproveite seus', ingredients: 'ovos e queijo', descEnd: 'que sobraram.', image: 'https://images.unsplash.com/photo-1510693206972-df098062cb71?q=80&w=600' },
  { id: '2', title: 'Macarrão ao tomate', time: '25 min', difficulty: 'Médio', descStart: 'Utiliza seu', ingredients: 'macarrão e tomates', descEnd: 'maduros.', image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?q=80&w=600' },
  { id: '3', title: 'Salada Primavera', time: '10 min', difficulty: 'Fácil', descStart: 'Uma mistura leve com suas', ingredients: 'folhas e legumes', descEnd: 'frescos.', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=600' },
  { id: '4', title: 'Frango Grelhado com Ervas', time: '30 min', difficulty: 'Médio', descStart: 'Prepare seu', ingredients: 'frango e ervas', descEnd: 'da horta.', image: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?q=80&w=600' },
  { id: '5', title: 'Sopa de Legumes', time: '40 min', difficulty: 'Fácil', descStart: 'Aqueça-se com seus', ingredients: 'legumes e caldos', descEnd: 'caseiros.', image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=600' },
];

const CHIPS: ChipItem[] = [
  { label: 'Rápidas', icon: 'flash-outline' },
  { label: 'Vegetarianas', icon: 'leaf-outline' },
  { label: 'Populares', icon: 'trending-up-outline' },
  { label: 'Saudáveis', icon: 'fitness-outline' },
  { label: 'Econômicas', icon: 'cash-outline' },
];

export default function ReceitasScreen() {
  const params = useLocalSearchParams();
  const flatListRef = useRef<FlatList<Recipe>>(null);

  const [busca, setBusca] = useState('');
  const [usarEstoque, setUsarEstoque] = useState(false);
  const [filtro, setFiltro] = useState('Rápidas');
  const [favoritos, setFavoritos] = useState<Record<string, boolean>>({});
  const [scrollY, setScrollY] = useState(0);

  // Lógica de restauração de scroll original
  useEffect(() => {
    const restoreScroll = Number(params.restoreScroll ?? 0);
    if (restoreScroll > 0) {
      const timeout = setTimeout(() => {
        flatListRef.current?.scrollToOffset({ offset: restoreScroll, animated: false });
      }, 150);
      return () => clearTimeout(timeout);
    }
  }, [params.restoreScroll]);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    setScrollY(event.nativeEvent.contentOffset.y);
  };

  // --- CABEÇALHO DA LISTA (FILTROS + CONTADOR) ---
  const ListHeader = () => (
    <View style={styles.filtersContainer}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.chipsScroll}
        contentContainerStyle={styles.chipsScrollContent}
      >
        {CHIPS.map((chip) => (
          <Pressable
            key={chip.label}
            onPress={() => setFiltro(chip.label)}
            style={[styles.chip, filtro === chip.label && styles.chipActive]}
          >
            <Ionicons
              name={chip.icon}
              size={14}
              color={filtro === chip.label ? Colors.light : Colors.primary}
            />
            <Text style={[styles.chipText, filtro === chip.label && styles.chipTextActive]}>
              {chip.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      <View style={styles.infoBar}>
        <Text style={styles.infoText}>{DATA.length} receitas encontradas</Text>
      </View>
    </View>
  );

  // --- RENDER DO CARD ---
  function renderRecipeCard({ item }: ListRenderItemInfo<Recipe>) {
    const isFav = favoritos[item.id] || false;

    return (
      <View style={styles.card}>
        <View style={styles.cardImageContainer}>
          <Image source={{ uri: item.image }} style={styles.cardImage} resizeMode="cover" />
        </View>

        <View style={styles.cardBody}>
          <View style={styles.titleRow}>
            <Text style={styles.recipeTitle}>{item.title}</Text>
            <Pressable onPress={() => setFavoritos(p => ({ ...p, [item.id]: !p[item.id] }))} style={styles.heartButton}>
              <Ionicons name={isFav ? 'heart' : 'heart-outline'} size={22} color={Colors.secondary} />
            </Pressable>
          </View>

          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Ionicons name="time-outline" size={14} color={Colors.primary} />
              <Text style={styles.metaText}>{item.time}</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="stats-chart-outline" size={14} color={Colors.primary} />
              <Text style={styles.metaText}>{item.difficulty}</Text>
            </View>
          </View>

          <Text style={styles.recipeDescription}>
            {item.descStart} <Text style={styles.highlightText}>{item.ingredients}</Text> {item.descEnd}
          </Text>

          <TouchableOpacity
            style={styles.viewButton}
            activeOpacity={0.8}
            onPress={() => router.push({
              pathname: '/detalhe_receita',
              params: {
                id: item.id, title: item.title, time: item.time,
                difficulty: item.difficulty, image: item.image,
                description: `${item.descStart} ${item.ingredients} ${item.descEnd}`,
                scrollY: String(scrollY),
              },
            })}
          >
            <Text style={styles.viewButtonText}>Ver receita</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <Header
        title="Receitas Encontradas"
        centerTitle={true}
        searchText={busca}
        setSearchText={setBusca}
        searchPlaceholder="Buscar ingredientes..."
      >
        <View style={styles.stockToggle}>
          <Ionicons name="cube-outline" size={18} color={Colors.primary} />
          <Text style={styles.stockText}>Cozinhar com meu estoque</Text>
          <Switch
            trackColor={{ false: Colors.subtext + '30', true: Colors.secondary }}
            thumbColor={Colors.light}
            onValueChange={setUsarEstoque}
            value={usarEstoque}
            style={styles.switchStyle}
          />
        </View>
      </Header>

      <FlatList
        ref={flatListRef}
        data={DATA}
        keyExtractor={(item) => item.id}
        renderItem={renderRecipeCard}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        ListHeaderComponent={ListHeader}
      />
    </View>
  );
}