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

    const ListHeader = () => (
        <View style={styles.listHeaderContainer}>
            {/* Filtros lado a lado com Scroll horizontal */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.chipsScroll}
            >
                <Chip active icon={<Sparkles size={14} color={Colors.light} fill={Colors.light} />} label="Todos" />
                <Chip icon={<Utensils size={14} color={Colors.primary} />} label="Salgadas" />
                <Chip icon={<IceCream size={14} color={Colors.primary} />} label="Doces" />
            </ScrollView>

            {/* Contador alinhado com a borda da imagem */}
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
                        trackColor={{ false: Colors.brown, true: Colors.secondary }}
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

const Chip = ({ active = false, icon, label }: any) => (
    <Pressable style={[styles.chip, active && styles.chipActive]}>
        {icon}
        <Text style={active ? styles.chipTextActive : styles.chipText}>{label}</Text>
    </Pressable>
);