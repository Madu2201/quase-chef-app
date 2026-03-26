import React, { useState } from 'react';
import { View, Text, FlatList, Image, Pressable, Switch } from 'react-native';
import { Heart, Zap, Leaf, TrendingUp, Package } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

// Importações do Projeto
import { Header } from '../../components/header';
import { favStyles as styles } from '../../styles/favoritos_styles';
import { Colors } from '../../constants/theme';
import { useFavoritos } from '../../hooks/useFavoritos';

// Dados iniciais para as receitas favoritadas
const FAVORITOS_DATA = [
    { id: '1', name: 'Bowl de Quinoa e Vegetais', info: '15 min • Fácil', img: require('../../assets/images/Bowl_Quinoa.png') },
    { id: '2', name: 'Pasta Pesto Mediterrânea', info: '20 min • Médio', img: require('../../assets/images/Pasta_Pesto.png') },
    { id: '3', name: 'Creme de Abóbora Roasted', info: '40 min • Fácil', img: require('../../assets/images/Creme_Abóbora.png') },
    { id: '4', name: 'Panquecas Fit de Banana', info: '10 min • Super Fácil', img: require('../../assets/images/Panquecas_fit.png') },
    { id: '5', name: 'Risoto de Cogumelos', info: '35 min • Difícil', img: require('../../assets/images/Risoto_cogumelos.png') },
    { id: '6', name: 'Pizza Integral Marguerita', info: '45 min • Médio', img: require('../../assets/images/Pizza_marguerita.png') },
];

// Tela de Favoritos
export default function FavoritosScreen() {
    const [isEnabled, setIsEnabled] = useState(false);
    const { searchText, setSearchText, filteredRecipes } = useFavoritos(FAVORITOS_DATA);

    return (
        <View style={styles.container}>
            {/* Header Unificado com o padrão da tela de Favoritos */}
            <Header
                title="Favoritos"
                centerTitle={true} // Mantém o título centralizado como era antes
                searchText={searchText}
                setSearchText={setSearchText}
                searchPlaceholder="Buscar receitas salvas..."
            >
                {/* Switch de Estoque - Passado como Children para manter o padrão único desta tela */}
                <View style={styles.stockToggle}>
                    <Package size={20} color={Colors.primary} />
                    <Text style={styles.stockText}>Cozinhar com meu estoque</Text>
                    <Switch
                        trackColor={{ false: Colors.brown, true: Colors.secondary }}
                        thumbColor={Colors.light}
                        onValueChange={setIsEnabled}
                        value={isEnabled}
                        style={styles.switchStyle}
                    />
                </View>

                {/* Filtros em Chips */}
                <View style={styles.chipsContainer}>
                    <Pressable style={[styles.chip, styles.chipActive]}>
                        <Zap size={14} color={Colors.light} />
                        <Text style={styles.chipTextActive}>Rápidas</Text>
                    </Pressable>
                    <Pressable style={styles.chip}>
                        <Leaf size={14} color={Colors.primary} />
                        <Text style={styles.chipText}>Vegetarianas</Text>
                    </Pressable>
                    <Pressable style={styles.chip}>
                        <TrendingUp size={14} color={Colors.primary} />
                        <Text style={styles.chipText}>Populares</Text>
                    </Pressable>
                </View>
            </Header>

            {/* Barra de Contagem */}
            <View style={styles.infoBar}>
                <Text style={styles.infoText}>{filteredRecipes.length} receitas encontradas</Text>
            </View>

            {/* Listagem de Receitas */}
            <FlatList
                data={filteredRecipes}
                keyExtractor={item => item.id}
                numColumns={2}
                columnWrapperStyle={styles.columnWrapper}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                renderItem={({ item, index }) => (
                    <Animated.View
                        entering={FadeInDown.delay(index * 50).duration(300)}
                        style={styles.card}
                    >
                        <Pressable>
                            <View style={styles.imageContainer}>
                                <Image source={item.img} style={styles.image} resizeMode="cover" />
                                <View style={styles.heartIcon}>
                                    <Heart size={16} color={Colors.secondary} fill={Colors.secondary} />
                                </View>
                            </View>
                            <Text style={styles.recipeName} numberOfLines={2}>{item.name}</Text>
                            <Text style={styles.recipeDetail}>{item.info}</Text>
                        </Pressable>
                    </Animated.View>
                )}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>
                        Nenhuma receita encontrada.
                    </Text>
                }
            />
        </View>
    );
}