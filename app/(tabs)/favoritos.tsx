import React from 'react';
import { View, Text, FlatList, Image, Pressable } from 'react-native';
import { ArrowLeft, Search, SlidersHorizontal, Heart } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { favStyles as styles } from '../../styles/favoritos_styles';
import { Colors, Spacing } from '../../constants/theme';

const FAVORITOS_DATA = [
    { id: '1', name: 'Bowl de Quinoa e Vegetais', info: '15 min • Fácil', img: require('../../assets/images/Bowl_Quinoa.png') },
    { id: '2', name: 'Pasta Pesto Mediterrânea', info: '20 min • Médio', img: require('../../assets/images/Pasta_Pesto.png') },
    { id: '3', name: 'Creme de Abóbora Roasted', info: '40 min • Fácil', img: require('../../assets/images/Creme_Abóbora.png') },
    { id: '4', name: 'Panquecas Fit de Banana', info: '10 min • Super Fácil', img: require('../../assets/images/Panquecas_fit.png') },
    { id: '5', name: 'Risoto de Cogumelos', info: '35 min • Difícil', img: require('../../assets/images/Risoto_cogumelos.png') },
    { id: '6', name: 'Pizza Integral Marguerita', info: '45 min • Médio', img: require('../../assets/images/Pizza_marguerita.png') },
];

export default function FavoritosScreen() {
    const renderItem = ({ item, index }: any) => (
        <Animated.View
            entering={FadeInDown.delay(index * 80).duration(400)}
            style={styles.card}
        >
            <Pressable>
                <View style={styles.imageContainer}>
                    <Image source={item.img} style={styles.image} resizeMode="cover" />
                    <View style={styles.heartIcon}>
                        <Heart size={18} color={Colors.primary} fill={Colors.primary} />
                    </View>
                </View>
                <Text style={styles.recipeName} numberOfLines={2}>{item.name}</Text>
                <Text style={styles.recipeDetail}>{item.info}</Text>
            </Pressable>
        </Animated.View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerTop}>
                    <ArrowLeft size={24} color={Colors.dark} />
                    <Text style={styles.title}>Favoritos</Text>
                    <Search size={24} color={Colors.dark} />
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

            <View style={styles.infoBar}>
                <Text style={styles.infoText}>12 receitas salvas</Text>
                <Pressable style={styles.filterBtn}>
                    <SlidersHorizontal size={16} color={Colors.primary} />
                    <Text style={[styles.infoText, { color: Colors.primary, fontWeight: '600' }]}>Filtrar</Text>
                </Pressable>
            </View>

            <FlatList
                data={FAVORITOS_DATA}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                numColumns={2}
                columnWrapperStyle={{ justifyContent: 'space-between', gap: Spacing.md }}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
}