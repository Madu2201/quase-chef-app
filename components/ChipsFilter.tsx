import { memo, useMemo } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import Animated, { FadeInRight } from 'react-native-reanimated';

// Meus imports
import { BASE_CHIPS as CHIPS } from '../constants/filtros';
import { Colors } from '../constants/theme';
import { useChipsScroll } from '../hooks/useChipsScroll';
import { receitasStyles as styles } from '../styles/receitas_styles';
import type { ChipsFilterProps } from '../types/components';

// Componente de filtro de chips para as receitas
const ChipsFilter = memo(
  ({
    filtro,
    setFiltro,
    receitasExibidas,
    totalReceitasEncontradas,
    hasMounted,
  }: ChipsFilterProps) => {
    const { chipsScrollRef, handleChipsScroll } = useChipsScroll(filtro);

    // Renderiza os chips de forma dinâmica com base no array CHIPS e aplica animação de entrada
    const renderedChips = useMemo(
      () =>
        CHIPS.map((chip, index) => {
          const Icon = chip.icon;
          const isActive = filtro === chip.label;
          return (
            <Animated.View
              key={chip.label}
              entering={
                !hasMounted
                  ? FadeInRight.delay(index * 100).duration(400)
                  : undefined
              }
            >
              <Pressable
                onPress={() => setFiltro(chip.label)}
                style={[styles.chip, isActive && styles.chipActive]}
              >
                <Icon
                  size={14}
                  color={isActive ? Colors.light : Colors.primary}
                  fill={isActive ? '#FFFFFFB3' : 'transparent'}
                />
                <Text
                  style={[
                    styles.chipText,
                    isActive && styles.chipTextActive,
                  ]}
                >
                  {chip.label}
                </Text>
              </Pressable>
            </Animated.View>
          );
        }),
      [filtro, hasMounted, setFiltro]
    );

    return (
      <View style={styles.filtersContainer}>
        <ScrollView
          ref={chipsScrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.chipsScroll}
          contentContainerStyle={styles.chipsScrollContent}
          scrollEventThrottle={16}
          onScroll={handleChipsScroll}
        >
          {renderedChips}
        </ScrollView>
        <View style={styles.infoBar}>
          <Text style={styles.infoText}>
            Mostrando {receitasExibidas.length} de {totalReceitasEncontradas}{' '}
            receitas
          </Text>
        </View>
      </View>
    );
  }
);

ChipsFilter.displayName = 'ChipsFilter';

export { ChipsFilter };