import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { Colors } from '../constants/theme';
import { styles } from '../styles/selecao_ia_styles';

const FILTROS_RAPIDOS = [
  { label: 'Saudável', icon: 'leaf-outline' as const },
  { label: 'Rápido', icon: 'flash-outline' as const },
  { label: 'Vegetariano', icon: 'flower-outline' as const },
  { label: 'Gourmet', icon: 'star-outline' as const },
];

const PROTEINAS = [
  'Frango',
  'Ovo',
  'Carne bovina',
  'Carne suína',
  'Peixe',
];

const VEGETAIS = [
  'Cebola',
  'Tomate',
  'Brócolis',
  'Cenoura',
  'Abobrinha',
  'Batata',
  'Batata-doce',
  'Alface',
  'Espinafre',
  'Pimentão',
  'Pepino',
  'Couve-flor',
];

const GRAOS_CEREAIS = [
  'Arroz branco',
  'Arroz integral',
  'Feijão preto',
  'Feijão carioca',
  'Lentilha',
  'Grão-de-bico',
  'Macarrão penne',
  'Macarrão espaguete',
  'Aveia',
  'Quinoa',
  'Farinha',
];

const TEMPEROS_BASICOS = [
  'Alho',
  'Sal',
  'Pimenta-do-reino',
  'Azeite',
  'Orégano',
  'Molho de tomate',
  'Queijo ralado',
  'Manjericão',
  'Páprica',
  'Limão',
  'Manteiga',
];

type AnimatedChipProps = {
  item: string;
  selected: boolean;
  onPress: () => void;
};

function AnimatedIngredientChip({ item, selected, onPress }: AnimatedChipProps) {
  return (
    <Pressable onPress={onPress}>
      {({ pressed }) => (
        <Animated.View
          entering={FadeInDown.duration(220)}
          style={[
            styles.chip,
            selected && styles.chipSelected,
            pressed && styles.chipPressed,
            pressed && !selected && styles.chipPressedUnselected,
          ]}
        >
          <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
            {item}
          </Text>
        </Animated.View>
      )}
    </Pressable>
  );
}

type AnimatedFilterProps = {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  selected: boolean;
  onPress: () => void;
};

function AnimatedQuickFilter({
  label,
  icon,
  selected,
  onPress,
}: AnimatedFilterProps) {
  return (
    <Pressable onPress={onPress}>
      {({ pressed }) => (
        <Animated.View
          entering={FadeInDown.duration(220)}
          style={[
            styles.quickFilterItem,
            selected && styles.quickFilterItemActive,
            pressed && styles.quickFilterPressed,
          ]}
        >
          <Ionicons
            name={icon}
            size={14}
            color={selected ? '#FFF' : Colors.dark}
          />
          <Text
            style={[
              styles.quickFilterText,
              selected && styles.quickFilterTextActive,
            ]}
          >
            {label}
          </Text>
        </Animated.View>
      )}
    </Pressable>
  );
}

export default function SelecaoIAScreen() {
  const [busca, setBusca] = useState('');
  const [selecionados, setSelecionados] = useState<string[]>([]);
  const [filtrosSelecionados, setFiltrosSelecionados] = useState<string[]>(['Rápido']);

  const toggleItem = (item: string) => {
    setSelecionados((prev) =>
      prev.includes(item) ? prev.filter((valor) => valor !== item) : [...prev, item]
    );
  };

  const toggleFiltro = (filtro: string) => {
    setFiltrosSelecionados((prev) =>
      prev.includes(filtro)
        ? prev.filter((item) => item !== filtro)
        : [...prev, filtro]
    );
  };

  const filtrarLista = (itens: string[]) => {
    if (!busca.trim()) return itens;

    return itens.filter((item) =>
      item.toLowerCase().includes(busca.trim().toLowerCase())
    );
  };

  const proteinasFiltradas = useMemo(() => filtrarLista(PROTEINAS), [busca]);
  const vegetaisFiltrados = useMemo(() => filtrarLista(VEGETAIS), [busca]);
  const graosFiltrados = useMemo(() => filtrarLista(GRAOS_CEREAIS), [busca]);
  const temperosFiltrados = useMemo(() => filtrarLista(TEMPEROS_BASICOS), [busca]);

  const totalSelecionados = selecionados.length;

  const renderChip = (item: string) => {
    const selecionado = selecionados.includes(item);

    return (
      <AnimatedIngredientChip
        key={item}
        item={item}
        selected={selecionado}
        onPress={() => toggleItem(item)}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.topBar}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={Colors.primary} />
          </Pressable>
        </View>

        <View style={styles.heroCard}>
          <View style={styles.heroTextArea}>
            <View style={styles.heroTag}>
              <Text style={styles.heroTagText}>IA CHEF INTELLIGENCE</Text>
            </View>

            <Text style={styles.heroTitle}>O que a IA vai criar hoje?</Text>
            <Text style={styles.heroSubtitle}>
              A combinação perfeita começa com o que você já tem.
            </Text>
          </View>

          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=1200',
            }}
            style={styles.heroImage}
            resizeMode="cover"
          />
        </View>

        <View style={styles.searchWrapper}>
          <View style={styles.searchBar}>
            <Ionicons name="search-outline" size={22} color={Colors.subtitle} />
            <TextInput
              style={styles.searchInput}
              placeholder="Procurar ingredientes..."
              placeholderTextColor={Colors.subtext}
              value={busca}
              onChangeText={setBusca}
            />
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.quickFiltersScrollContent}
          style={styles.quickFiltersScroll}
        >
          {FILTROS_RAPIDOS.map((filtro) => {
            const ativo = filtrosSelecionados.includes(filtro.label);

            return (
              <AnimatedQuickFilter
                key={filtro.label}
                label={filtro.label}
                icon={filtro.icon}
                selected={ativo}
                onPress={() => toggleFiltro(filtro.label)}
              />
            );
          })}
        </ScrollView>

        <View style={styles.categoryContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.categoryTitle}>PROTEÍNAS</Text>
            <View style={styles.sectionLine} />
          </View>
          <View style={styles.chipsWrapper}>
            {proteinasFiltradas.map(renderChip)}
          </View>
        </View>

        <View style={styles.categoryContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.categoryTitle}>VEGETAIS</Text>
            <View style={styles.sectionLine} />
          </View>
          <View style={styles.chipsWrapper}>
            {vegetaisFiltrados.map(renderChip)}
          </View>
        </View>

        <View style={styles.categoryContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.categoryTitle}>GRÃOS & CEREAIS</Text>
            <View style={styles.sectionLine} />
          </View>
          <View style={styles.chipsWrapper}>
            {graosFiltrados.map(renderChip)}
          </View>
        </View>

        <View style={styles.categoryContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.categoryTitle}>TEMPEROS & BÁSICOS</Text>
            <View style={styles.sectionLine} />
          </View>
          <View style={styles.chipsWrapper}>
            {temperosFiltrados.map(renderChip)}
          </View>
        </View>

        <View style={{ height: 125 }} />
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          disabled={totalSelecionados === 0}
          style={({ pressed }) => [
            styles.generateButton,
            totalSelecionados === 0 && styles.generateButtonDisabled,
            pressed && totalSelecionados > 0 && styles.generateButtonPressed,
          ]}
          onPress={() => {
            if (totalSelecionados === 0) return;
            console.log('Ingredientes selecionados:', selecionados);
            console.log('Filtros selecionados:', filtrosSelecionados);
          }}
        >
          <Ionicons
            name="sparkles"
            size={18}
            color={totalSelecionados === 0 ? 'rgba(255,255,255,0.75)' : '#FFF'}
          />

          <Text
            style={[
              styles.generateButtonText,
              totalSelecionados === 0 && styles.generateButtonTextDisabled,
            ]}
          >
            {totalSelecionados === 0 ? 'Selecione ingredientes' : 'Gerar Receita'}
          </Text>

          <View
            style={[
              styles.badge,
              totalSelecionados === 0 && styles.badgeDisabled,
            ]}
          >
            <Text
              style={[
                styles.badgeText,
                totalSelecionados === 0 && styles.badgeTextDisabled,
              ]}
            >
              {totalSelecionados} item{totalSelecionados !== 1 ? 's' : ''}
            </Text>
          </View>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}