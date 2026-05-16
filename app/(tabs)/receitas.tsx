import { router, useLocalSearchParams } from 'expo-router';
import { BarChart, Clock, Heart, IceCream, Package } from 'lucide-react-native';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
    ActivityIndicator,
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

// Meus imports
import { Header } from '../../components/header';
import { BASE_CHIPS as CHIPS } from '../../constants/filtros';
import { Colors } from '../../constants/theme';
import { useAuth } from '../../hooks/useAuth';
import { useFavoritosGlobal } from '../../hooks/useFavoritos';
import { useFiltroEstoque } from '../../hooks/useFiltroEstoque';
import { Recipe, useReceitas } from '../../hooks/useReceitas';
import { receitasStyles as styles } from '../../styles/receitas_styles';

export default function ReceitasScreen() {
  const params = useLocalSearchParams();
  const flatListRef = useRef<FlatList<Recipe>>(null);
  
  const [busca, setBusca] = useState('');
  const [usarEstoque, setUsarEstoque] = useState(false);
  const [filtro, setFiltro] = useState('Todas');
  const [scrollY, setScrollY] = useState(0);
  const [hasMounted, setHasMounted] = useState(false);
  
  const { receitasBanco, carregando, filtrarPorCategoria, filtrarPorBusca, filtrarPorPerfil } = useReceitas();
  const { isFavorito, toggleFavorito } = useFavoritosGlobal();
  const { filtrarPorEstoque } = useFiltroEstoque();
  const { user } = useAuth();

  // 🔥 LÓGICA DE FILTRAGEM INTEGRADA
  const receitasFiltradas = useMemo(() => {
    let filtradas = receitasBanco;

    // 0. Filtragem por perfil do usuário (preferências e alergias)
    filtradas = filtrarPorPerfil(
      filtradas,
      user?.food_preferences,
      user?.allergies,
      user?.temporaryMode,
    );

    // 1. Filtro por Categoria (Chips)
    filtradas = filtrarPorCategoria(filtradas, filtro);

    // 2. Filtro de Texto (Barra de Pesquisa)
    filtradas = filtrarPorBusca(filtradas, busca);

    // 3. Filtro Rigoroso de Estoque (Botão "Cozinhar com meu estoque")
    if (usarEstoque) {
      filtradas = filtrarPorEstoque(filtradas);
    }

    return filtradas;
  }, [receitasBanco, busca, filtro, usarEstoque, filtrarPorCategoria, filtrarPorBusca, filtrarPorEstoque, filtrarPorPerfil, user?.food_preferences, user?.allergies, user?.temporaryMode]);

  // Restaura a posição de scroll ao voltar da tela de detalhes
  useEffect(() => {
    const restoreScroll = Number(params.restoreScroll ?? 0);
    if (restoreScroll > 0) {
      const timeout = setTimeout(() => {
        flatListRef.current?.scrollToOffset({ offset: restoreScroll, animated: false });
      }, 150);
      return () => clearTimeout(timeout);
    }
  }, [params.restoreScroll]);

  useEffect(() => {
    setHasMounted(true);
  }, []);

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
            <Animated.View
              key={chip.label}
              entering={!hasMounted ? FadeInRight.delay(index * 100).duration(400) : undefined}
            >
              <Pressable onPress={() => setFiltro(chip.label)} style={[styles.chip, isActive && styles.chipActive]}>
                <Icon size={14} color={isActive ? Colors.light : Colors.primary} fill={isActive ? '#FFFFFFB3' : 'transparent'} />
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
    const ehFav = isFavorito(item.id);
    
    return (
      <Animated.View
        entering={!hasMounted ? FadeInDown.delay(index * 150).duration(600).springify() : undefined}
        style={styles.card}
      >
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
            
            <TouchableOpacity onPress={() => toggleFavorito(item.id)} style={styles.heartButton}>
              <Heart size={22} color={Colors.secondary} fill={ehFav ? Colors.secondary : 'transparent'} />
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
                tipo: item.tipo,
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
      
      <ListHeader />
      
      {carregando && receitasFiltradas.length === 0 ? (
        <View style={styles.emptyCentered}>
            <ActivityIndicator size="large" color={Colors.secondary} />
            <Text style={styles.emptySmallText}>Buscando receitas fresquinhas...</Text>
        </View>
      ) : receitasFiltradas.length === 0 && usarEstoque ? (
        <View style={styles.emptyCenteredPadding}>
            <Package size={48} color={Colors.subtext} style={styles.emptyIcon} />
            <Text style={styles.emptyTextCenter}>
              Não conseguimos encontrar nenhuma receita onde você possua TODOS os ingredientes.
            </Text>
        </View>
      ) : receitasFiltradas.length === 0 ? (
        <View style={styles.emptyCenteredPadding}>
            <IceCream size={48} color={Colors.subtext} style={styles.emptyIcon} />
            <Text style={styles.emptyTextCenter}>
              Nenhuma receita encontrada com esse filtro.
            </Text>
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
        />
      )}
    </View>
  );
}