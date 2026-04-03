import { router } from 'expo-router'; // ✅ Importado para navegação
import { Heart, IceCream, Package, Sparkles, Utensils } from 'lucide-react-native';
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

// ✅ 1. Importamos os Hooks Reais
import { useFavoritosGlobal } from '../../hooks/useFavoritos';
import { Recipe, useReceitas } from '../../hooks/useReceitas';

// Dados Iniciais para os filtros (Mantidos os seus originais)
const FILTROS = [
    { id: 'Todos', label: 'Todos', icon: Sparkles },
    { id: 'Salgadas', label: 'Salgadas', icon: Utensils },
    { id: 'Doces', label: 'Doces', icon: IceCream },
    { id: 'Lanches', label: 'Lanches', icon: Package },
];

// Componente do Card isolado e conectado ao Cérebro de Favoritos
const RecipeCard = ({ item, index }: { item: Recipe, index: number }) => {
    // ✅ 2. Conectando o card ao Hook Global
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
            {/* Clicar na imagem abre os Detalhes */}
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
                    
                    {/* Botão independente só para o coração */}
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
                    {/* Exibe o tempo e a dificuldade juntos igual seu design antigo */}
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
    const [filtro, setFiltro] = useState('Todos');

    // ✅ 3. Puxando dados Reais
    const { receitasBanco } = useReceitas();
    const { isFavorito } = useFavoritosGlobal();

    // ✅ 4. Lógica Mestra de Filtragem (Filtra APENAS favoritos, cruza com busca e com a tag)
    const receitasFiltradas = receitasBanco.filter(receita => {
        // Regra de ouro: Se não for favorito, nem mostra na tela
        if (!isFavorito(receita.id)) return false;

        // Verifica a Tag/Filtro
        const passaNoFiltro = filtro === 'Todos' ? true : receita.tags.includes(filtro);
        if (!passaNoFiltro) return false;

        // Verifica a Barra de Pesquisa
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
                {FILTROS.map((item, index) => {
                    const Icon = item.icon;
                    const isActive = filtro === item.id;
                    return (
                        <Animated.View
                            key={item.id}
                            entering={FadeInRight.delay(index * 100).duration(500)}
                        >
                            <Chip
                                active={isActive}
                                onPress={() => setFiltro(item.id)}
                                icon={<Icon size={14} color={isActive ? Colors.light : Colors.primary} fill={isActive && item.id === 'Todos' ? Colors.light : 'transparent'} />}
                                label={item.label}
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

    // Renderiza a tela
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
                // Uma tela vazia elegante para quando não houver favoritos
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 }}>
                    <Heart size={48} color={Colors.subtext} style={{ marginBottom: 10, opacity: 0.5 }} />
                    <Text style={{ color: Colors.subtext, fontSize: 16, textAlign: 'center' }}>
                        {searchText ? "Nenhuma receita salva encontrada com esse nome." : "Você ainda não salvou nenhuma receita. \nExplore e favorite suas preferidas!"}
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

// Componente do Chip para os filtros
const Chip = ({ active = false, icon, label, onPress }: any) => (
    <Pressable onPress={onPress} style={[styles.chip, active && styles.chipActive]}>
        {icon}
        <Text style={active ? styles.chipTextActive : styles.chipText}>{label}</Text>
    </Pressable>
);