import { useLayoutEffect, useRef } from 'react';
import { NativeScrollEvent, NativeSyntheticEvent, ScrollView } from 'react-native';

/**
 * Hook para gerenciar a preservação da posição de scroll horizontal
 * de um componente ScrollView durante mudanças de estado.
 * 
 * Usa useLayoutEffect para sincronismo, evitando tremidas visuais.
 * 
 * @param filtro - Valor atual do filtro (trigger para restaurar posição)
 * @returns { chipsScrollRef, handleChipsScroll } - ref para ScrollView e handler
 */
export function useChipsScroll(filtro: string) {
  const chipsScrollRef = useRef<ScrollView>(null);
  const chipsScrollPositionRef = useRef(0);

  /**
   * Handler chamado pelo evento onScroll da ScrollView
   * Salva a posição atual do scroll horizontal
   */
  const handleChipsScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    chipsScrollPositionRef.current = event.nativeEvent.contentOffset.x;
  };

  /**
   * Restaura a posição do scroll sincronamente após mudança de filtro
   * useLayoutEffect garante que a restauração aconteça ANTES da renderização visual
   * evitando tremelique/tremida visível na UI
   */
  useLayoutEffect(() => {
    chipsScrollRef.current?.scrollTo({
      x: chipsScrollPositionRef.current,
      animated: false,
    });
  }, [filtro]);

  return {
    chipsScrollRef,
    handleChipsScroll,
  };
}
