import React, { useState } from 'react'; // Adicionado useState
import { View, Text, FlatList, Image, Pressable, TextInput, Switch } from 'react-native';
import { Search, Heart, Zap, Leaf, TrendingUp, Package } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { favStyles as styles } from '../../styles/favoritos_styles';
import { Colors } from '../../constants/theme';

const FAVORITOS_DATA = [
    { id: '1', name: 'Bowl de Quinoa e Vegetais', info: '15 min • Fácil', img: require('../../assets/images/Bowl_Quinoa.png') },
    { id: '2', name: 'Pasta Pesto Mediterrânea', info: '20 min • Médio', img: require('../../assets/images/Pasta_Pesto.png') },
    { id: '3', name: 'Creme de Abóbora Roasted', info: '40 min • Fácil', img: require('../../assets/images/Creme_Abóbora.png') },
    { id: '4', name: 'Panquecas Fit de Banana', info: '10 min • Super Fácil', img: require('../../assets/images/Panquecas_fit.png') },
    { id: '5', name: 'Risoto de Cogumelos', info: '35 min • Difícil', img: require('../../assets/images/Risoto_cogumelos.png') },
    { id: '6', name: 'Pizza Integral Marguerita', info: '45 min • Médio', img: require('../../assets/images/Pizza_marguerita.png') },
];

export default function FavoritosScreen() {
    const [isEnabled, setIsEnabled] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    // 1. ESTADO PARA A BUSCA
    const [searchText, setSearchText] = useState("");

    // 2. FILTRAGEM EM TEMPO REAL
    // Filtramos a lista original baseada no que o usuário digita
    const filteredRecipes = FAVORITOS_DATA.filter((item) =>
        item.name.toLowerCase().includes(searchText.toLowerCase())
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>Favoritos</Text>
                </View>

                <View style={styles.headerContent}>
                    <View style={[styles.searchBar, isFocused && styles.searchBarFocused]}>
                        <Search size={20} color={Colors.primary} />
                        <TextInput
                            placeholder="Buscar receitas salvas..."
                            style={styles.searchInput}
                            placeholderTextColor={Colors.primary + "80"}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            selectionColor={Colors.primary}

                            // 3. ATUALIZAÇÃO DO TEXTO (MUITO IMPORTANTE)
                            value={searchText}
                            onChangeText={(text) => setSearchText(text)}
                        />
                    </View>

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

                    <View style={styles.tabContainer}>
                        <Pressable style={[styles.tabItem, styles.tabActive]}>
                            <Text style={[styles.tabText, styles.tabTextActive]}>Todas</Text>
                        </Pressable>
                        <Pressable style={styles.tabItem}>
                            <Text style={styles.tabText}>Salgadas</Text>
                        </Pressable>
                        <Pressable style={styles.tabItem}>
                            <Text style={styles.tabText}>Doces</Text>
                        </Pressable>
                    </View>
                </View>
            </View>

            <View style={styles.infoBar}>
                {/* 4. CONTADOR DINÂMICO */}
                <Text style={styles.infoText}>{filteredRecipes.length} receitas encontradas</Text>
            </View>

            <FlatList
                // 5. USAR A LISTA FILTRADA AQUI (Não use FAVORITOS_DATA aqui)
                data={filteredRecipes}
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
                keyExtractor={item => item.id}
                numColumns={2}
                columnWrapperStyle={styles.columnWrapper}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}

                // 6. CASO NÃO ENCONTRE NADA
                ListEmptyComponent={
                    <Text style={{ textAlign: 'center', marginTop: 20, color: Colors.primary }}>
                        Nenhuma receita encontrada.
                    </Text>
                }
            />
        </View>
    );
}