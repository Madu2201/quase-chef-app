import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  Pressable,
  Switch,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  ListRenderItemInfo,
  NativeSyntheticEvent,
  NativeScrollEvent
} from 'react-native';
import {
  Heart,
  Zap,
  Leaf,
  TrendingUp,
  Activity,
  Banknote,
  Clock,
  BarChart,
  Package
} from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';

import { Header } from '../../components/header';
import { receitasStyles as styles } from '../../styles/receitas_styles';
import { Colors } from '../../constants/theme';

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

const DATA: Recipe[] = [
  { id: '1', title: 'Omelete de queijo', time: '15 min', difficulty: 'Fácil', descStart: 'Aproveite seus', ingredients: 'ovos e queijo', descEnd: 'que sobraram.', image: 'https://images.unsplash.com/photo-1510693206972-df098062cb71?q=80&w=600' },
  { id: '2', title: 'Macarrão ao tomate', time: '25 min', difficulty: 'Médio', descStart: 'Utiliza seu', ingredients: 'macarrão e tomates', descEnd: 'maduros.', image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?q=80&w=600' },
  { id: '3', title: 'Salada Primavera', time: '10 min', difficulty: 'Fácil', descStart: 'Uma mistura leve com suas', ingredients: 'folhas e legumes', descEnd: 'frescos.', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=600' },
  { id: '4', title: 'Frango Grelhado com Ervas', time: '30 min', difficulty: 'Médio', descStart: 'Prepare seu', ingredients: 'frango e ervas', descEnd: 'da horta.', image: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?q=80&w=600' },
  { id: '5', title: 'Sopa de Legumes', time: '40 min', difficulty: 'Fácil', descStart: 'Aqueça-se com seus', ingredients: 'legumes e caldos', descEnd: 'caseiros.', image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=600' },
];

const CHIPS = [
  { label: 'Rápidas', icon: Zap },
  { label: 'Vegetarianas', icon: Leaf },
  { label: 'Populares', icon: TrendingUp },
  { label: 'Saudáveis', icon: Activity },
  { label: 'Econômicas', icon: Banknote },
];

export default function ReceitasScreen() {
  const params = useLocalSearchParams();
  const flatListRef = useRef<FlatList<Recipe>>(null);

  const [busca, setBusca] = useState('');
  const [usarEstoque, setUsarEstoque] = useState(false);
  const [filtro, setFiltro] = useState('Rápidas');
  const [favoritos, setFavoritos] = useState<Record<string, boolean>>({});
  const [scrollY, setScrollY] = useState(0);

  // Efeito para restaurar o scroll ao voltar da tela de detalhes
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

  const ListHeader = () => (
    <View style={styles.filtersContainer}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.chipsScroll}
        contentContainerStyle={styles.chipsScrollContent}
      >
        {CHIPS.map((chip, index) => {
          const Icon = chip.icon;
          const isActive = filtro === chip.label;
          return (
            <Animated.View
              key={chip.label}
              entering={FadeInRight.delay(index * 100).duration(400)}
            >
              <Pressable
                onPress={() => setFiltro(chip.label)}
                style={[styles.chip, isActive && styles.chipActive]}
              >
                <Icon size={14} color={isActive ? Colors.light : Colors.primary} />
                <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                  {chip.label}
                </Text>
              </Pressable>
            </Animated.View>
          );
        })}
      </ScrollView>

      <View style={styles.infoBar}>
        <Text style={styles.infoText}>{DATA.length} receitas encontradas</Text>
      </View>
    </View>
  );

  function renderRecipeCard({ item, index }: ListRenderItemInfo<Recipe>) {
    const isFav = favoritos[item.id] || false;

    return (
      <Animated.View
        entering={FadeInDown.delay(index * 150).duration(600).springify()}
        style={styles.card}
      >
        <View style={styles.cardImageContainer}>
          <Image source={{ uri: item.image }} style={styles.cardImage} resizeMode="cover" />
        </View>
        <View style={styles.cardBody}>
          <View style={styles.titleRow}>
            <Text style={styles.recipeTitle}>{item.title}</Text>
            <TouchableOpacity
              onPress={() => setFavoritos(p => ({ ...p, [item.id]: !p[item.id] }))}
              style={styles.heartButton}
            >
              <Heart
                size={22}
                color={Colors.secondary}
                fill={isFav ? Colors.secondary : 'transparent'}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Clock size={14} color={Colors.primary} />
              <Text style={styles.metaText}>{item.time}</Text>
            </View>
            <View style={styles.metaItem}>
              <BarChart size={14} color={Colors.primary} />
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
                id: item.id,
                title: item.title,
                time: item.time,
                difficulty: item.difficulty,
                image: item.image,
                restoreScroll: String(scrollY)
              }
            })}
          >
            <Text style={styles.viewButtonText}>Ver receita</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      <Header
        title="Receitas Encontradas"
        centerTitle
        searchText={busca}
        setSearchText={setBusca}
        searchPlaceholder="Buscar ingredientes..."
      >
        <View style={styles.stockToggle}>
          <Package size={18} color={Colors.primary} />
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