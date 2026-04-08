import { router } from 'expo-router'; // ✅ Importado para navegação
import { Activity, Banknote, Heart, IceCream, LayoutGrid, Package, Utensils, Zap } from 'lucide-react-native';
import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, Image, Pressable, ScrollView, StatusBar, Switch, Text, View } from 'react-native';
import Animated, {
    FadeInDown,
    FadeInRight,
    useAnimatedStyle,
    useSharedValue,
    withSequence,
    withSpring
} from 'react-native-reanimated';

// Meus imports
import { Header } from '../../components/header';
import { Colors } from '../../constants/theme';
import { favStyles as styles } from '../../styles/favoritos_styles';

// Importamos os Hooks Reais
import { useDispensa } from '../../hooks/useDispensa';
import { useFavoritosGlobal } from '../../hooks/useFavoritos';
import { Recipe, useReceitas } from '../../hooks/useReceitas';

// ✅ 1. Filtros igual da tela de receitas
const CHIPS = [
    { label: 'Todas', icon: LayoutGrid },
    { label: 'Salgadas', icon: Utensils },
    { label: 'Doces', icon: IceCream },
    { label: 'Rápidas', icon: Zap },
    { label: 'Saudáveis', icon: Activity },
    { label: 'Econômicas', icon: Banknote },
];

// Componente do Card isolado e conectado ao Cérebro de Favoritos
const RecipeCard = ({ item, index, hasMounted }: { item: Recipe, index: number, hasMounted: boolean }) => {
    const { isFavorito, toggleFavorito } = useFavoritosGlobal();
    const ehFav = isFavorito(item.id);
    const scale = useSharedValue(1);

    const animatedHeartStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const handleLike = () => {
        scale.value = withSequence(withSpring(1.3), withSpring(1));
        toggleFavorito(item.id);
    };

    // Card abre a receita, Coração apenas favorita/desfavorita
    return (
        <Animated.View
            entering={!hasMounted ? FadeInDown.delay(index * 150).duration(600).springify() : undefined}
            style={styles.card}
        >
            <Pressable onPress={() => router.push({
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
                    steps: item.rawSteps
                }
            })}>
                <View style={styles.imageContainer}>
                    {item.image ? (
                        <Image source={{ uri: item.image }} style={styles.image} resizeMode="cover" />
                    ) : (
                        <View style={[styles.image, { backgroundColor: '#e0e0e0', justifyContent: 'center', alignItems: 'center' }]}>
                            <Text>Sem foto</Text>
                        </View>
                    )}
                    
                    <Pressable style={styles.heartIcon} onPress={handleLike} hitSlop={10}>
                        <Animated.View style={animatedHeartStyle}>
                            <Heart
                                size={16}
                                color={ehFav ? Colors.secondary : Colors.subtext}
                                fill={ehFav ? Colors.secondary : 'transparent'}
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

// Tela Principal
export default function FavoritosScreen() {
    const [isEnabled, setIsEnabled] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [filtro, setFiltro] = useState('Todas');
    const [hasMounted, setHasMounted] = useState(false);

    const { receitasBanco, filtrarPorCategoria, filtrarPorBusca, filtrarPorEstoque } = useReceitas();
    const { isFavorito } = useFavoritosGlobal();
    const { ingredients: dispensaIngredientes } = useDispensa();

    useEffect(() => {
        setHasMounted(true);
    }, []);

    const receitasFiltradas = useMemo(() => {
        let favoritas = receitasBanco.filter(receita => isFavorito(receita.id));

        favoritas = filtrarPorCategoria(favoritas, filtro);
        favoritas = filtrarPorBusca(favoritas, searchText);

        if (isEnabled) {
            favoritas = filtrarPorEstoque(favoritas, dispensaIngredientes);
        }

        return favoritas;
    }, [receitasBanco, isFavorito, filtro, searchText, isEnabled, dispensaIngredientes, filtrarPorCategoria, filtrarPorBusca, filtrarPorEstoque]);

    const ListHeader = () => (
        <View style={styles.listHeaderContainer}>
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
                            entering={!hasMounted ? FadeInRight.delay(index * 100).duration(500) : undefined}
                        >
                            <Chip
                                active={isActive}
                                onPress={() => setFiltro(chip.label)}
                                icon={<Icon size={14} color={isActive ? Colors.light : Colors.primary} fill={isActive && chip.label === 'Todas' ? Colors.light : 'transparent'} />}
                                label={chip.label}
                            />
                        </Animated.View>
                    );
                })}
            </ScrollView>

            <View style={styles.infoBar}>
                <Text style={styles.infoText}>
                    {receitasFiltradas.length} {receitasFiltradas.length === 1 ? 'receita salva' : 'receitas salvas'}
                </Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <Header
                title="Favoritos"
                centerTitle={true}
                searchText={searchText}
                setSearchText={setSearchText}
                searchPlaceholder="Buscar receitas salvas..."
            >
                <View style={styles.stockToggle}>
                    <Package size={18} color={Colors.primary} />
                    <Text style={styles.stockText}>Cozinhar com meu estoque</Text>
                    <Switch
                        trackColor={{ false: Colors.subtext + '30', true: Colors.secondary }}
                        thumbColor={Colors.light}
                        onValueChange={setIsEnabled}
                        value={isEnabled}
                        style={styles.switchStyle}
                    />
                </View>
            </Header>

            <ListHeader />
            
            {receitasFiltradas.length === 0 ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 }}>
                    <Heart size={48} color={Colors.subtext} style={{ marginBottom: 10, opacity: 0.5 }} />
                    <Text style={{ color: Colors.subtext, fontSize: 16, textAlign: 'center' }}>
                        {searchText || filtro !== 'Todas' 
                            ? "Nenhuma receita salva encontrada com esse filtro." 
                            : "Você ainda não salvou nenhuma receita. \nExplore e favorite suas preferidas!"}
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={receitasFiltradas}
                    keyExtractor={item => String(item.id)}
                    numColumns={2}
                    columnWrapperStyle={styles.columnWrapper}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item, index }) => <RecipeCard item={item} index={index} hasMounted={hasMounted} />}
                />
            )}
        </View>
    );
}

const Chip = ({ active = false, icon, label, onPress }: any) => (
    <Pressable onPress={onPress} style={[styles.chip, active && styles.chipActive]}>
        {icon}
        <Text style={active ? styles.chipTextActive : styles.chipText}>{label}</Text>
    </Pressable>
);