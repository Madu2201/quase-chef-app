import React, { useState } from 'react';
import { View, ScrollView, Image, Text, Pressable, StatusBar, Share, TouchableOpacity } from 'react-native';
import { Heart, Clock, BarChart3, Flame, PlayCircle, CheckCircle2, AlertCircle, Share2, Sparkles, Lightbulb } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp, FadeInDown, FadeInLeft } from 'react-native-reanimated';
import { router, useLocalSearchParams } from 'expo-router';

import { Header } from '../components/header';
import { Colors } from '../constants/theme';
import { detalheReceitaStyles as styles } from '../styles/detalhe_receita_styles';

export default function DetalheReceitaScreen() {
  const params = useLocalSearchParams();
  const [favorito, setFavorito] = useState(false);

  const isIA = params.tipo === 'ia';

  // Sincronizado com os passos da tela de preparo
  const receita = {
    titulo: (params.title as string) || 'Omelete de Ervas',
    descricao: (params.description as string) || 'Uma omelete fofinha e aromática, perfeita para um café da manhã nutritivo.',
    tempo: (params.time as string) || '10 min',
    dificuldade: (params.difficulty as string) || 'Fácil',
    calorias: '210 kcal',
    imagem: (params.image as string) || 'https://images.unsplash.com/photo-1510629954389-c1e0da47d415?q=80&w=1000',
    itensCount: 4,
    dicaIA: "Você pode adicionar queijo feta ou cubinhos de tomate para uma versão mediterrânea ainda mais saborosa.",
    ingredientes: [
      { id: '1', nome: '2 Ovos grandes', status: 'ok' },
      { id: '2', nome: 'Salsinha e Cebolinha', status: 'ok' },
      { id: '3', nome: 'Sal e Pimenta', status: 'ok' },
      { id: '4', nome: 'Manteiga', status: 'ok' },
    ],
    // Array de objetos para facilitar o transporte de dados extras como timer e dicas
    preparo: [
      {
        titulo: "Quebre os ovos em uma tigela",
        descricao: "Certifique-se de não deixar cair cascas. Adicione uma pitada de sal e as ervas picadas agora.",
        dica: "Dica: Use ervas frescas para um sabor mais intenso e aromático.",
        hasTimer: false
      },
      {
        titulo: "Aqueça a frigideira",
        descricao: "Coloque uma colher de manteiga e espere derreter levemente em fogo baixo.",
        dica: "Não deixe a manteiga queimar, isso altera o sabor final.",
        hasTimer: false
      },
      {
        titulo: "Cozinhe e finalize",
        descricao: "Despeje a mistura e cozinhe em fogo baixo até que o fundo esteja dourado. Dobre ao meio com cuidado.",
        dica: "Use uma espátula de silicone para não quebrar a massa.",
        hasTimer: true,
        tempoTimer: 300 // 5 minutos
      }
    ],
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <Header
        title={isIA ? "Receita gerada por IA" : "Detalhes da Receita"}
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

          <Animated.View entering={FadeInUp.duration(600)} style={styles.imageHeader}>
            <Image source={{ uri: receita.imagem }} style={styles.image} />
            <Animated.View
              entering={FadeInLeft.delay(500)}
              style={[styles.badgePopular, isIA && { backgroundColor: Colors.secondary }]}
            >
              {isIA && <Sparkles size={12} color={Colors.light} style={{ marginRight: 4 }} />}
              <Text style={styles.badgeText}>
                {isIA ? "Gerado por IA" : "Sugestão Quase Chef"}
              </Text>
            </Animated.View>
          </Animated.View>

          <View style={styles.contentCard}>
            <Animated.Text entering={FadeInDown.delay(200)} style={styles.title}>{receita.titulo}</Animated.Text>
            <Text style={styles.description}>{receita.descricao}</Text>

            <View style={styles.infoContainer}>
              <InfoCard icon={Clock} label="Tempo" value={receita.tempo} />
              <InfoCard icon={BarChart3} label="Nível" value={receita.dificuldade} />
              <InfoCard icon={Flame} label="Calorias" value={receita.calorias} />
            </View>

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

            {isIA && (
              <Animated.View entering={FadeInDown.delay(300)} style={styles.aiTipContainer}>
                <View style={styles.aiTipHeader}>
                  <Lightbulb size={18} color={Colors.secondary} />
                  <Text style={styles.aiTipTitle}>Dica da IA!</Text>
                </View>
                <Text style={styles.aiTipText}>{receita.dicaIA}</Text>
              </Animated.View>
            )}

            <Text style={styles.preparoTitle}>Modo de preparo</Text>
            {receita.preparo.map((passo, index) => (
              <View key={index} style={styles.stepItem}>
                <View style={styles.stepNumber}><Text style={styles.stepNumberText}>{index + 1}</Text></View>
                <Text style={styles.stepText}>{passo.titulo}</Text>
              </View>
            ))}
          </View>
        </ScrollView>

        <LinearGradient colors={['transparent', Colors.background]} style={styles.fadeGradient} pointerEvents="none" />
      </View>

      <View style={styles.footer}>
        <Pressable onPress={() => setFavorito(!favorito)} style={styles.favButton}>
          <Heart size={26} color={Colors.secondary} fill={favorito ? Colors.secondary : 'transparent'} />
        </Pressable>

        {/* BOTÃO CONECTADO: Envia os dados para a tela de preparo */}
        <Pressable
          style={styles.mainButton}
          onPress={() => router.push({
            pathname: '/preparo_receita',
            params: {
              titulo: receita.titulo,
              imagem: receita.imagem,
              passosJson: JSON.stringify(receita.preparo) // Passa os passos reais
            }
          })}
        >
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