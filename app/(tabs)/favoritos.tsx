import { router } from 'expo-router'; // ✅ Importado para navegação
import { Activity, Banknote, Heart, IceCream, LayoutGrid, Package, Utensils, Zap } from 'lucide-react-native';
import React, { useState } from 'react';
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
const RecipeCard = ({ item, index }: { item: Recipe, index: number }) => {
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
            entering={FadeInDown.delay(index * 150).duration(600).springify()}
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
    
    // Estado inicial ajustado para 'Todas'
    const [filtro, setFiltro] = useState('Todas');

    const { receitasBanco } = useReceitas();
    const { isFavorito } = useFavoritosGlobal();

    const receitasFiltradas = receitasBanco.filter(receita => {
        if (!isFavorito(receita.id)) return false;

        // Lógica de filtro ajustada para a chave correta
        const passaNoFiltro = filtro === 'Todas' ? true : receita.tags.includes(filtro);
        if (!passaNoFiltro) return false;

        if (!searchText) return true;
        const termoBusca = searchText.toLowerCase();
        const achouNoTitulo = receita.title.toLowerCase().includes(termoBusca);
        const achouNosIngredientes = receita.rawIngredients.toLowerCase().includes(termoBusca);
        
        return achouNoTitulo || achouNosIngredientes;
    });

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
                            entering={FadeInRight.delay(index * 100).duration(500)}
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
                    ListHeaderComponent={ListHeader}
                    columnWrapperStyle={styles.columnWrapper}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item, index }) => <RecipeCard item={item} index={index} />}
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