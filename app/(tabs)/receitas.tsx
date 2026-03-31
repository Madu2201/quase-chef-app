import { router, useLocalSearchParams } from 'expo-router';
import { Activity, Banknote, BarChart, Clock, Heart, LayoutGrid, Leaf, Package, TrendingUp, Zap } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import {
  FlatList, Image,
  ListRenderItemInfo,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StatusBar,
  Switch,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';

import { Header } from '../../components/header';
import { Colors } from '../../constants/theme';
import { Recipe, useReceitas } from '../../hooks/useReceitas';
import { receitasStyles as styles } from '../../styles/receitas_styles';

// Adicionado o 'Todas' para poder ver tudo sem filtro de tag
const CHIPS = [
  { label: 'Todas', icon: LayoutGrid },
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
  const [filtro, setFiltro] = useState('Todas'); // Começa mostrando Todas
  const [favoritos, setFavoritos] = useState<Record<string, boolean>>({});
  const [scrollY, setScrollY] = useState(0);

  const { receitasBanco, carregando } = useReceitas();

  // A PENEIRA COMPLETA: Filtra por Tag E por Busca
  const receitasFiltradas = receitasBanco.filter(receita => {
    // 1. Verifica se passa no filtro do Chip
    const passaNoFiltro = filtro === 'Todas' ? true : receita.tags.includes(filtro);
    
    // 2. Se não passou no Chip, já descarta
    if (!passaNoFiltro) return false;

    // 3. Se a busca estiver vazia, deixa passar
    if (!busca) return true;
    
    // 4. Verifica a busca de texto
    const termoBusca = busca.toLowerCase();
    const achouNoTitulo = receita.title.toLowerCase().includes(termoBusca);
    const achouNosIngredientes = receita.rawIngredients.toLowerCase().includes(termoBusca);
    
    return achouNoTitulo || achouNosIngredientes;
  });

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
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsScroll} contentContainerStyle={styles.chipsScrollContent}>
        {CHIPS.map((chip, index) => {
          const Icon = chip.icon;
          const isActive = filtro === chip.label;
          return (
            <Animated.View key={chip.label} entering={FadeInRight.delay(index * 100).duration(400)}>
              <Pressable onPress={() => setFiltro(chip.label)} style={[styles.chip, isActive && styles.chipActive]}>
                <Icon size={14} color={isActive ? Colors.light : Colors.primary} />
                <Text style={[styles.chipText, isActive && styles.chipTextActive]}>{chip.label}</Text>
              </Pressable>
            </Animated.View>
          );
        })}
      </ScrollView>
      <View style={styles.infoBar}>
        <Text style={styles.infoText}>{receitasFiltradas.length} receitas encontradas</Text>
      </View>
    </View>
  );

  function renderRecipeCard({ item, index }: ListRenderItemInfo<Recipe>) {
    const isFav = favoritos[item.id] || false;
    return (
      <Animated.View entering={FadeInDown.delay(index * 150).duration(600).springify()} style={styles.card}>
        <View style={styles.cardImageContainer}>
          {item.image ? (
            <Image source={{ uri: item.image }} style={styles.cardImage} resizeMode="cover" />
          ) : (
             <View style={[styles.cardImage, { backgroundColor: '#e0e0e0', justifyContent: 'center', alignItems: 'center' }]}>
               <Text>Sem foto</Text>
             </View>
          )}
        </View>
        <View style={styles.cardBody}>
          <View style={styles.titleRow}>
            <Text style={styles.recipeTitle}>{item.title}</Text>
            <TouchableOpacity onPress={() => setFavoritos(p => ({ ...p, [item.id]: !p[item.id] }))} style={styles.heartButton}>
              <Heart size={22} color={Colors.secondary} fill={isFav ? Colors.secondary : 'transparent'} />
            </TouchableOpacity>
          </View>
          <View style={styles.metaRow}>
            <View style={styles.metaItem}><Clock size={14} color={Colors.primary} /><Text style={styles.metaText}>{item.time}</Text></View>
            <View style={styles.metaItem}><BarChart size={14} color={Colors.primary} /><Text style={styles.metaText}>{item.difficulty}</Text></View>
          </View>
          <Text style={styles.recipeDescription}>{item.descStart}</Text>
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
                calories: item.calories,
                description: item.descStart,
                ingredients: item.rawIngredients,
                steps: item.rawSteps,
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
      <Header title="Receitas Encontradas" centerTitle searchText={busca} setSearchText={setBusca} searchPlaceholder="Buscar ingredientes ou receitas...">
        <View style={styles.stockToggle}>
          <Package size={18} color={Colors.primary} />
          <Text style={styles.stockText}>Cozinhar com meu estoque</Text>
          <Switch trackColor={{ false: Colors.subtext + '30', true: Colors.secondary }} thumbColor={Colors.light} onValueChange={setUsarEstoque} value={usarEstoque} style={styles.switchStyle} />
        </View>
      </Header>
      
      {carregando && receitasFiltradas.length === 0 ? (
         <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Buscando receitas fresquinhas...</Text>
         </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={receitasFiltradas} 
          keyExtractor={(item) => String(item.id)}
          renderItem={renderRecipeCard}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          ListHeaderComponent={ListHeader}
        />
      )}
    </View>
  );
}