import React, { useState } from 'react';
import { View, Text, FlatList, Image, Pressable, Switch, ScrollView } from 'react-native';
import { Heart, Sparkles, Utensils, IceCream, Package } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { Header } from '../../components/header';
import { favStyles as styles } from '../../styles/favoritos_styles';
import { Colors } from '../../constants/theme';

const FAVORITOS_DATA = [
    { id: '1', name: 'Bowl de Quinoa e Vegetais', info: '15 min • Fácil', img: require('../../assets/images/Bowl_Quinoa.png') },
    { id: '2', name: 'Pasta Pesto Mediterrânea', info: '20 min • Médio', img: require('../../assets/images/Pasta_Pesto.png') },
    { id: '3', name: 'Creme de Abóbora', info: '40 min • Fácil', img: require('../../assets/images/Creme_Abóbora.png') },
    { id: '4', name: 'Panquecas Fit de Banana', info: '10 min • Super Fácil', img: require('../../assets/images/Panquecas_fit.png') },
    { id: '5', name: 'Risoto de Cogumelos', info: '35 min • Difícil', img: require('../../assets/images/Risoto_cogumelos.png') },
    { id: '6', name: 'Pizza Integral Marguerita', info: '45 min • Médio', img: require('../../assets/images/Pizza_marguerita.png') },
];

export default function FavoritosScreen() {
    const [isEnabled, setIsEnabled] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [filtro, setFiltro] = useState('Todos');

    const ListHeader = () => (
        <View style={styles.listHeaderContainer}>
            {/* Scroll horizontal de filtros igual à tela de receitas */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.chipsScroll}
                contentContainerStyle={styles.chipsScrollContent}
            >
                <Chip
                    active={filtro === 'Todos'}
                    onPress={() => setFiltro('Todos')}
                    icon={<Sparkles size={14} color={filtro === 'Todos' ? Colors.light : Colors.primary} fill={filtro === 'Todos' ? Colors.light : 'transparent'} />}
                    label="Todos"
                />
                <Chip
                    active={filtro === 'Salgadas'}
                    onPress={() => setFiltro('Salgadas')}
                    icon={<Utensils size={14} color={filtro === 'Salgadas' ? Colors.light : Colors.primary} />}
                    label="Salgadas"
                />
                <Chip
                    active={filtro === 'Doces'}
                    onPress={() => setFiltro('Doces')}
                    icon={<IceCream size={14} color={filtro === 'Doces' ? Colors.light : Colors.primary} />}
                    label="Doces"
                />
                <Chip
                    active={filtro === 'Lanches'}
                    onPress={() => setFiltro('Lanches')}
                    icon={<Package size={14} color={filtro === 'Lanches' ? Colors.light : Colors.primary} />}
                    label="Lanches"
                />
            </ScrollView>

            <View style={styles.infoBar}>
                <Text style={styles.infoText}>{FAVORITOS_DATA.length} receitas encontradas</Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
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

            <FlatList
                data={FAVORITOS_DATA}
                keyExtractor={item => item.id}
                numColumns={2}
                ListHeaderComponent={ListHeader}
                columnWrapperStyle={styles.columnWrapper}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                renderItem={({ item, index }) => (
                    <Animated.View
                        entering={FadeInDown.delay(index * 100).duration(400)}
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
            />
        </View>
    );
}

const Chip = ({ active = false, icon, label, onPress }: any) => (
    <Pressable onPress={onPress} style={[styles.chip, active && styles.chipActive]}>
        {icon}
        <Text style={active ? styles.chipTextActive : styles.chipText}>{label}</Text>
    </Pressable>
);