import React, { useState } from 'react';
import { View, ScrollView, Image, Text, Pressable, StatusBar, Share, TouchableOpacity } from 'react-native';
import { Heart, Clock, BarChart3, Flame, PlayCircle, CheckCircle2, AlertCircle, Share2 } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp, FadeInDown, FadeInLeft } from 'react-native-reanimated';
import { router, useLocalSearchParams } from 'expo-router';

import { Header } from '../components/header';
import { Colors } from '../constants/theme';
import { detalheReceitaStyles as styles } from '../styles/detalhe_receita_styles';

export default function DetalheReceitaScreen() {
  const params = useLocalSearchParams();
  const [favorito, setFavorito] = useState(false);

  // Mock de dados baseado nos parâmetros
  const receita = {
    titulo: (params.title as string) || 'Bowl Mediterrâneo',
    descricao: (params.description as string) || 'Uma refeição leve e nutritiva com ingredientes frescos.',
    tempo: (params.time as string) || '25 min',
    dificuldade: (params.difficulty as string) || 'Fácil',
    calorias: '320 kcal',
    imagem: (params.image as string) || 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1000',
    itensCount: 4,
    ingredientes: [
      { id: '1', nome: '2 Ovos grandes', status: 'ok' },
      { id: '2', nome: 'Queijo Mussarela', status: 'ok' },
      { id: '3', nome: 'Sal e Pimenta', status: 'ok' },
      { id: '4', nome: 'Manteiga', status: 'faltando' },
    ],
    preparo: [
      'Em uma tigela pequena, bata os ovos levemente até ficarem homogêneos.',
      'Aqueça a frigideira com manteiga em fogo médio.',
      'Despeje os ovos e adicione o queijo uniformemente.',
      'Sirva imediatamente enquanto quente.',
    ],
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <Header
        title="Detalhes da Receita"
        centerTitle
        onBack={() => router.back()}
        showSearch={false}
        rightElement={
          <TouchableOpacity onPress={() => Share.share({ message: `Receita de ${receita.titulo}` })}>
            <Share2 size={22} color={Colors.primary} />
          </TouchableOpacity>
        }
      />

      <View style={styles.mainContentWrapper}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

          {/* Imagem com Badge Animado */}
          <Animated.View entering={FadeInUp.duration(600)} style={styles.imageHeader}>
            <Image source={{ uri: receita.imagem }} style={styles.image} />
            <Animated.View entering={FadeInLeft.delay(500)} style={styles.badgePopular}>
              <Text style={styles.badgeText}>Sugestão Quase Chef</Text>
            </Animated.View>
          </Animated.View>

          <View style={styles.contentCard}>
            <Animated.Text entering={FadeInDown.delay(200)} style={styles.title}>{receita.titulo}</Animated.Text>
            <Text style={styles.description}>{receita.descricao}</Text>

            {/* Seção de Info Estilo Pill */}
            <View style={styles.infoContainer}>
              <InfoCard icon={Clock} label="Tempo" value={receita.tempo} />
              <InfoCard icon={BarChart3} label="Nível" value={receita.dificuldade} />
              <InfoCard icon={Flame} label="Calorias" value={receita.calorias} />
            </View>

            {/* Ingredientes */}
            <View style={styles.sectionTitleRow}>
              <Text style={styles.sectionTitle}>Ingredientes</Text>
              <Text style={styles.itemsCount}>{receita.itensCount} itens</Text>
            </View>

            {receita.ingredientes.map((item, index) => (
              <Animated.View key={item.id} entering={FadeInLeft.delay(400 + index * 50)}
                style={[styles.ingredientItem, item.status === 'faltando' && styles.ingredientMissing]}>
                {item.status === 'faltando' ? <AlertCircle size={20} color={Colors.errorDark} /> : <CheckCircle2 size={20} color={Colors.success} />}
                <Text style={styles.ingredientText}>{item.nome}</Text>
              </Animated.View>
            ))}

            {/* Preparo */}
            <Text style={styles.preparoTitle}>Modo de preparo</Text>
            {receita.preparo.map((passo, index) => (
              <View key={index} style={styles.stepItem}>
                <View style={styles.stepNumber}><Text style={styles.stepNumberText}>{index + 1}</Text></View>
                <Text style={styles.stepText}>{passo}</Text>
              </View>
            ))}
          </View>
        </ScrollView>

        {/* Efeito de Fade no final da lista */}
        <LinearGradient
          colors={['transparent', Colors.background]}
          style={styles.fadeGradient}
          pointerEvents="none"
        />
      </View>

      {/* Footer Fixo */}
      <View style={styles.footer}>
        <Pressable onPress={() => setFavorito(!favorito)} style={styles.favButton}>
          <Heart size={26} color={Colors.secondary} fill={favorito ? Colors.secondary : 'transparent'} />
        </Pressable>
        <Pressable style={styles.mainButton}>
          <PlayCircle size={22} color={Colors.light} />
          <Text style={styles.mainButtonText}>Iniciar preparo</Text>
        </Pressable>
      </View>
    </View>
  );
}

const InfoCard = ({ icon: Icon, label, value }: any) => (
  <View style={styles.infoCard}>
    <View style={styles.infoIconContainer}><Icon size={18} color={Colors.primary} /></View>
    <View>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  </View>
);