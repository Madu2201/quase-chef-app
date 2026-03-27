import { useRouter } from 'expo-router';
import { Sparkles } from 'lucide-react-native';
import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { Colors } from '../constants/theme';

// Este componente você pode entregar para ela apenas importar
export const BotaoGerarIA = () => {
  const router = useRouter();

  return (
    <Pressable 
      style={styles.button}
      onPress={() => router.push("/selecao_ia")}
    >
      <Sparkles size={20} color={Colors.light} fill={Colors.light} />
      <Text style={styles.text}>
        Gerar receitas com meus ingredientes
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.secondary,
    height: 65,
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    marginTop: 20,
    // Sombra para ficar igual ao Figma
    shadowColor: Colors.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  text: {
    color: Colors.light,
    fontSize: 16,
    fontWeight: 'bold',
  }
});