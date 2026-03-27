import React, { useState } from 'react';
import { View, Text, FlatList, Image, Pressable, Switch, ScrollView, StatusBar } from 'react-native';
import { Heart, Sparkles, Utensils, IceCream, Package } from 'lucide-react-native';
/* Adicionada a animação FadeInRight para os filtros */
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';

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

const FILTROS = [
    { id: 'Todos', label: 'Todos', icon: Sparkles },
    { id: 'Salgadas', label: 'Salgadas', icon: Utensils },
    { id: 'Doces', label: 'Doces', icon: IceCream },
    { id: 'Lanches', label: 'Lanches', icon: Package },
];

export default function FavoritosScreen() {
    const [isEnabled, setIsEnabled] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [filtro, setFiltro] = useState('Todos');

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
                <Text style={styles.infoText}>{FAVORITOS_DATA.length} receitas encontradas</Text>
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
                        entering={FadeInDown.delay(index * 150).duration(600).springify()}
                        style={styles.card}
                    >
                        <Pressable>
                            <View style={styles.imageContainer}>
                                <Image source={item.img} style={styles.image} resizeMode="cover" />
                                <View style={styles.heartIcon}>
                                    <Heart size={16} color={Colors.secondary} fill={Colors.secondary} />
                                </View>
                            </View>
                            <View style={styles.cardInfo}>
                                <Text style={styles.recipeName} numberOfLines={2}>{item.name}</Text>
                                <Text style={styles.recipeDetail}>{item.info}</Text>
                            </View>
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