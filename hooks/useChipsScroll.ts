import { useLayoutEffect, useRef } from 'react';
import { NativeScrollEvent, NativeSyntheticEvent, ScrollView } from 'react-native';

/**
 * Hook para controlar o scroll horizontal da ScrollView de chips de categorias
 * @param filtro - Valor atual do filtro (trigger para restaurar posição)
 * @returns { chipsScrollRef, handleChipsScroll } - ref para ScrollView e handler
 */
export function useChipsScroll(filtro: string) {
  const chipsScrollRef = useRef<ScrollView>(null);
  const chipsScrollPositionRef = useRef(0);

  // Atualiza a posição do scroll sempre que o usuário rolar os chips
  const handleChipsScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    chipsScrollPositionRef.current = event.nativeEvent.contentOffset.x;
  };

  // Restaura a posição do scroll sempre que o filtro mudar (ex: ao selecionar uma categoria)
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