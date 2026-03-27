import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    FlatList,
    Image,
    ListRenderItemInfo,
    NativeScrollEvent,
    NativeSyntheticEvent,
    Pressable,
    ScrollView,
    StatusBar,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

import { Colors } from '../../constants/theme';
import { receitasStyles as styles } from '../../styles/receitas_styles';

interface Recipe {
  id: string;
  title: string;
  time: string;
  difficulty: string;
  descStart: string;
  ingredients: string;
  descEnd: string;
  image: string;
}

interface ChipItem {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const DATA: Recipe[] = [
  {
    id: '1',
    title: 'Omelete de queijo',
    time: '15 min',
    difficulty: 'Fácil',
    descStart: 'Aproveite seus',
    ingredients: 'ovos e queijo',
    descEnd: 'que sobraram.',
    image: 'https://images.unsplash.com/photo-1510693206972-df098062cb71?q=80&w=600',
  },
  {
    id: '2',
    title: 'Macarrão ao tomate',
    time: '25 min',
    difficulty: 'Médio',
    descStart: 'Utiliza seu',
    ingredients: 'macarrão e tomates',
    descEnd: 'maduros.',
    image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?q=80&w=600',
  },
  {
    id: '3',
    title: 'Salada Primavera',
    time: '10 min',
    difficulty: 'Fácil',
    descStart: 'Uma mistura leve com suas',
    ingredients: 'folhas e legumes',
    descEnd: 'frescos.',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=600',
  },
  {
    id: '4',
    title: 'Frango Grelhado com Ervas',
    time: '30 min',
    difficulty: 'Médio',
    descStart: 'Prepare seu',
    ingredients: 'frango e ervas',
    descEnd: 'da horta.',
    image: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?q=80&w=600',
  },
  {
    id: '5',
    title: 'Sopa de Legumes',
    time: '40 min',
    difficulty: 'Fácil',
    descStart: 'Aqueça-se com seus',
    ingredients: 'legumes e caldos',
    descEnd: 'caseiros.',
    image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=600',
  },
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

  useEffect(() => {
    const restoreScroll = Number(params.restoreScroll ?? 0);

    if (restoreScroll > 0) {
      const timeout = setTimeout(() => {
        flatListRef.current?.scrollToOffset({
          offset: restoreScroll,
          animated: false,
        });
      }, 150);

      return () => clearTimeout(timeout);
    }
  }, [params.restoreScroll]);

  const toggleFavorito = (id: string) => {
    setFavoritos((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    setScrollY(event.nativeEvent.contentOffset.y);
  };

  function renderRecipeCard({ item }: ListRenderItemInfo<Recipe>) {
    const isFav = favoritos[item.id] || false;

    return (
      <View style={styles.card}>
        <View style={styles.cardImageContainer}>
          <Image
            source={{ uri: item.image }}
            style={styles.cardImage}
            resizeMode="cover"
          />
        </View>

        <View style={styles.cardBody}>
          <View style={styles.titleRow}>
            <Text style={styles.recipeTitle}>{item.title}</Text>

            <Pressable
              onPress={() => toggleFavorito(item.id)}
              style={styles.heartButton}
            >
              <Ionicons
                name={isFav ? 'heart' : 'heart-outline'}
                size={22}
                color={Colors.secondary}
              />
            </Pressable>
          </View>

          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Ionicons name="time-outline" size={14} color={Colors.primary} />
              <Text style={styles.metaText}>{item.time}</Text>
            </View>

            <View style={styles.metaItem}>
              <Ionicons
                name="stats-chart-outline"
                size={14}
                color={Colors.primary}
              />
              <Text style={styles.metaText}>{item.difficulty}</Text>
            </View>
          </View>

          <Text style={styles.recipeDescription}>
            {item.descStart}{' '}
            <Text style={styles.highlightText}>{item.ingredients}</Text>{' '}
            {item.descEnd}
          </Text>

          <TouchableOpacity
            style={styles.viewButton}
            activeOpacity={0.8}
            onPress={() =>
              router.push({
                pathname: '/detalhe_receita',
                params: {
                  id: item.id,
                  title: item.title,
                  time: item.time,
                  difficulty: item.difficulty,
                  image: item.image,
                  description: `${item.descStart} ${item.ingredients} ${item.descEnd}`,
                  scrollY: String(scrollY),
                },
              })
            }
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

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.primary} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Receitas Encontradas</Text>
      </View>

      <FlatList
        ref={flatListRef}
        data={DATA}
        keyExtractor={(item) => item.id}
        renderItem={renderRecipeCard}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        ListHeaderComponent={
          <View style={styles.filtersContainer}>
            <View style={styles.searchBar}>
              <Ionicons name="search-outline" size={18} color={Colors.primary} />
              <TextInput
                style={styles.searchInput}
                placeholder="Buscar ingredientes..."
                placeholderTextColor={Colors.subtitle}
                value={busca}
                onChangeText={setBusca}
              />
            </View>

            <View style={styles.stockToggle}>
              <View style={styles.stockLeft}>
                <Ionicons name="cube-outline" size={18} color={Colors.subtitle} />
                <Text style={styles.stockText}>Cozinhar com meu estoque</Text>
              </View>

              <View style={styles.switchWrapper}>
                <Switch
                  value={usarEstoque}
                  onValueChange={setUsarEstoque}
                  trackColor={{ false: '#D1D5DB', true: Colors.secondary }}
                  thumbColor="#FFF"
                  ios_backgroundColor="#D1D5DB"
                  style={{
                    transform: [{ scaleX: 0.75 }, { scaleY: 0.75 }],
                  }}
                />
              </View>
            </View>

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
                    color={filtro === chip.label ? '#FFF' : Colors.primary}
                  />
                  <Text
                    style={[
                      styles.chipText,
                      filtro === chip.label && styles.chipTextActive,
                    ]}
                  >
                    {chip.label}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        }
      />
    </View>
  );
}