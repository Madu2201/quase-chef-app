import { router, useLocalSearchParams } from 'expo-router';
import { BarChart, Clock, Heart, IceCream, Package } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList, Image,
  ListRenderItemInfo,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StatusBar,
  Switch,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

// Meus imports
import { ChipsFilter } from '../../components/ChipsFilter';
import { Header } from '../../components/header';
import { Colors } from '../../constants/theme';
import { useFavoritosGlobal } from '../../hooks/useFavoritos';
import { Recipe, useReceitasList } from '../../hooks/useReceitas';
import { receitasStyles as styles } from '../../styles/receitas_styles';

export default function ReceitasScreen() {
  const params = useLocalSearchParams();
  const flatListRef = useRef<FlatList<Recipe>>(null);
  
  const [scrollY, setScrollY] = useState(0);
  const {
    busca,
    setBusca,
    usarEstoque,
    setUsarEstoque,
    filtro,
    setFiltro,
    receitasFiltradas,
    receitasExibidas,
    totalReceitasEncontradas,
    carregando,
    hasMounted,
    handleEndReached,
    handleMomentumScrollBegin,
  } = useReceitasList();
  const { isFavorito, toggleFavorito } = useFavoritosGlobal();


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

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    setScrollY(event.nativeEvent.contentOffset.y);
  };

  function renderRecipeCard({ item, index }: ListRenderItemInfo<Recipe>) {
    try {
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
              <Text style={styles.recipeTitle}>{item.title || "Receita sem título"}</Text>
              
              <TouchableOpacity onPress={() => toggleFavorito(item.id)} style={styles.heartButton}>
                <Heart size={22} color={Colors.secondary} fill={ehFav ? Colors.secondary : 'transparent'} />
              </TouchableOpacity>
              
            </View>
            <View style={styles.metaRow}>
              <View style={styles.metaItem}><Clock size={14} color={Colors.primary} /><Text style={styles.metaText}>{item.time || "-"}</Text></View>
              <View style={styles.metaItem}><BarChart size={14} color={Colors.primary} /><Text style={styles.metaText}>{item.difficulty || "-"}</Text></View>
            </View>
            <Text style={styles.recipeDescription}>{item.descStart || ""}</Text>
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
    } catch (err) {
      console.error("❌ Erro ao renderizar card de receita:", err);
      return null;
    }
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
      
      <ChipsFilter 
        filtro={filtro}
        setFiltro={setFiltro}
        receitasExibidas={receitasExibidas}
        totalReceitasEncontradas={totalReceitasEncontradas}
        hasMounted={hasMounted}
      />
      
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
          data={receitasExibidas}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderRecipeCard}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          onMomentumScrollBegin={handleMomentumScrollBegin}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.5}
        />
      )}
    </View>
  );
}