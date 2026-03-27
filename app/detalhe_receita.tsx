import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  View,
} from 'react-native';
import Animated, { FadeInDown, FadeInLeft, FadeInUp } from 'react-native-reanimated';

import { Colors } from '../constants/theme';
import { detalheReceitaStyles as styles } from '../styles/detalhe_receita_styles';

interface ReceitaData {
  titulo: string;
  descricao: string;
  tempo: string;
  dificuldade: string;
  calorias: string;
  imagem: string;
  itensCount: number;
  ingredientes: { id: string; nome: string; status: 'ok' | 'faltando' }[];
  preparo: string[];
}

export default function DetalheReceitaScreen() {
  const params = useLocalSearchParams();
  const [favorito, setFavorito] = useState(false);

  const receita: ReceitaData = {
    titulo: (params.title as string) || 'Bowl Mediterrâneo de Quinoa',
    descricao:
      (params.description as string) ||
      'Uma refeição leve, nutritiva e perfeita para aproveitar o que sobrou na geladeira.',
    tempo: (params.time as string) || '25 min',
    dificuldade: (params.difficulty as string) || 'Fácil',
    calorias: '320 kcal',
    imagem:
      (params.image as string) ||
      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1000',

    itensCount: params.id === '1' ? 4 : 6,

    ingredientes:
      params.id === '1'
        ? [
            { id: '1', nome: '2 Ovos grandes', status: 'ok' },
            { id: '2', nome: 'Queijo Mussarela', status: 'ok' },
            { id: '3', nome: 'Sal e Pimenta', status: 'ok' },
            { id: '4', nome: 'Manteiga', status: 'faltando' },
          ]
        : [
            { id: '1', nome: '1 xícara de Quinoa cozida', status: 'ok' },
            { id: '2', nome: '1/2 xícara de Tomate cereja', status: 'ok' },
            { id: '3', nome: 'Queijo Feta', status: 'faltando' },
            { id: '4', nome: 'Pepino em cubos', status: 'ok' },
            { id: '5', nome: 'Azeite de Oliva', status: 'ok' },
            { id: '6', nome: 'Limão siciliano', status: 'ok' },
          ],

    preparo:
      params.id === '1'
        ? [
            'Em uma tigela pequena, bata os ovos levemente com um garfo e adicione uma pitada de sal.',
            'Aqueça uma frigideira antiaderente com um pouco de manteiga em fogo médio.',
            'Despeje os ovos, adicione o queijo no centro e dobre o omelete quando as bordas estiverem firmes.',
            'Deixe o queijo derreter por um minuto e sirva quente.',
          ]
        : [
            'Lave bem a quinoa sob água corrente e cozinhe em água salgada por cerca de 15 minutos.',
            'Pique os tomates cereja ao meio e o pepino em cubos pequenos enquanto a quinoa esfria.',
            'Em uma tigela grande, misture a quinoa cozida com os vegetais picados.',
            'Finalize com o queijo feta esfarelado (se tiver), azeite, suco de limão e sirva gelado.',
          ],
  };

  const voltarParaReceitas = () => {
    router.push({
      pathname: '/(tabs)/receitas',
      params: {
        restoreScroll: String(params.scrollY ?? 0),
      },
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={styles.topBarWrapper}>
        <View style={styles.topBar}>
          <Pressable
            onPress={voltarParaReceitas}
            style={({ pressed }) => [
              styles.topBarIconButton,
              { opacity: pressed ? 0.5 : 1 },
            ]}
          >
            <Ionicons name="arrow-back" size={18} color={Colors.secondary} />
          </Pressable>

          <Text style={styles.topBarTitle}>Detalhes da Receita</Text>

          <Pressable
            onPress={() =>
              Alert.alert('Compartilhar', `Link de "${receita.titulo}" copiado!`)
            }
            style={({ pressed }) => [
              styles.topBarIconButton,
              { opacity: pressed ? 0.5 : 1 },
            ]}
          >
            <Ionicons
              name="share-social-outline"
              size={18}
              color={Colors.secondary}
            />
          </Pressable>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
      >
        <Animated.View entering={FadeInUp.duration(800)} style={styles.imageHeader}>
          <Image source={{ uri: receita.imagem }} style={styles.image} />

          <View style={styles.badgePopular}>
            <Text style={styles.badgeText}>Sugestão Quase-Chef</Text>
          </View>
        </Animated.View>

        <View style={styles.contentCard}>
          <Animated.Text entering={FadeInDown.delay(200)} style={styles.title}>
            {receita.titulo}
          </Animated.Text>

          <Text style={styles.description}>{receita.descricao}</Text>

          <View style={styles.infoContainer}>
            <View style={styles.infoCard}>
              <Ionicons name="time-outline" size={20} color={Colors.secondary} />
              <Text style={styles.infoLabel}>Tempo</Text>
              <Text style={styles.infoValue}>{receita.tempo}</Text>
            </View>

            <View style={styles.infoCard}>
              <Ionicons
                name="stats-chart-outline"
                size={20}
                color={Colors.secondary}
              />
              <Text style={styles.infoLabel}>Nível</Text>
              <Text style={styles.infoValue}>{receita.dificuldade}</Text>
            </View>

            <View style={styles.infoCard}>
              <Ionicons name="flame-outline" size={20} color={Colors.secondary} />
              <Text style={styles.infoLabel}>Energia</Text>
              <Text style={styles.infoValue}>{receita.calorias}</Text>
            </View>
          </View>

          <View style={styles.sectionTitleRow}>
            <Text style={styles.sectionTitle}>Ingredientes necessários</Text>
            <Text style={styles.itemsCount}>{receita.itensCount} itens</Text>
          </View>

          {receita.ingredientes.map((item, index) => (
            <Animated.View
              key={item.id}
              entering={FadeInLeft.delay(400 + index * 50)}
              style={[
                styles.ingredientItem,
                item.status === 'faltando' && styles.ingredientMissing,
              ]}
            >
              <Ionicons
                name={
                  item.status === 'faltando'
                    ? 'warning-outline'
                    : 'checkmark-circle'
                }
                size={20}
                color={item.status === 'faltando' ? Colors.secondary : '#48BB78'}
              />
              <Text style={styles.ingredientText}>{item.nome}</Text>
              {item.status === 'faltando' && (
                <Text style={styles.missingLabel}>Faltando</Text>
              )}
            </Animated.View>
          ))}

          <Text style={styles.preparoTitle}>Modo de preparo</Text>

          {receita.preparo.map((passo, index) => (
            <View key={index} style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>{index + 1}</Text>
              </View>
              <Text style={styles.stepText}>{passo}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          onPress={() => setFavorito(!favorito)}
          style={({ pressed }) => [
            styles.favButton,
            {
              opacity: pressed ? 0.7 : 1,
              borderColor: favorito ? Colors.secondary : '#FEE7D6',
              backgroundColor: '#FFF',
            },
          ]}
        >
          <Ionicons
            name={favorito ? 'heart' : 'heart-outline'}
            size={26}
            color={Colors.secondary}
          />
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.mainButton,
            { opacity: pressed ? 0.8 : 1 },
          ]}
          onPress={() => Alert.alert('Quase-Chef', 'Preparando...')}
        >
          <Ionicons name="play-circle" size={22} color="#FFF" />
          <Text style={styles.mainButtonText}>Iniciar preparo</Text>
        </Pressable>
      </View>
    </View>
  );
}