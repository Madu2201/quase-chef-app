import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { AlertCircle, BarChart3, CheckCircle2, Clock, Flame, Heart, Lightbulb, PlayCircle, Share2 } from 'lucide-react-native';
import React, { useState } from 'react';
import { Image, Pressable, ScrollView, Share, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown, FadeInLeft, FadeInUp } from 'react-native-reanimated';

// Meus imports
import { Header } from '../components/header';
import { Colors } from '../constants/theme';
import { detalheReceitaStyles as styles } from '../styles/detalhe_receita_styles';

// Tipagens para os dados que recebemos via params
interface Ingrediente {
  id: string;
  nome: string;
  status: 'ok' | 'faltando';
}

interface PassoPreparo {
  titulo: string;
  descricao: string;
  dica: string;
  hasTimer: boolean;
  tempoTimer: number;
}

// Tela de detalhes da receita
export default function DetalheReceitaScreen() {
  const params = useLocalSearchParams();
  const [favorito, setFavorito] = useState(false);
  const formatarTempo = (t: string) => t.toLowerCase().replace('minutos', 'min').replace('minuto', 'min').replace('horas', 'h').replace('hora', 'h');

  const isIA = params.tipo === 'ia';

  let ingredientesTraduzidos: Ingrediente[] = [];
  try {
    if (typeof params.ingredients === 'string') {
      const rawIng = JSON.parse(params.ingredients);
      ingredientesTraduzidos = rawIng.map((ing: any, idx: number) => ({
        id: String(idx),
        nome: ing.texto_original || ing,
        status: 'ok' as const
      }));
    }
  } catch (e) {
    console.log("Erro ao processar ingredientes:", e);
  }

  let passosTraduzidos: PassoPreparo[] = [];
  try {
    if (typeof params.steps === 'string') {
      const rawSteps = JSON.parse(params.steps);
      passosTraduzidos = rawSteps.map((passo: any) => ({
        titulo: passo.titulo || "Passo",
        descricao: passo.descricao,
        dica: passo.dica_do_chef || "",
        hasTimer: passo.tempo_timer_minutos > 0,
        tempoTimer: (passo.tempo_timer_minutos || 0) * 60
      }));
    }
  } catch (e) {
    console.log("Erro ao processar passos:", e);
  }

  // Construção do objeto receita com dados processados e valores padrão para casos de ausência de dados
  const receita = {
    titulo: (params.title as string) || 'Receita Desconhecida',
    descricao: (params.description as string) || 'Descrição indisponível.',
    tempo: formatarTempo((params.time as string) || '-- min'),
    dificuldade: (params.difficulty as string) || '--',
    calorias: (params.calories as string) || '-- kcal',
    imagem: (params.image as string) || 'https://images.unsplash.com/photo-1510629954389-c1e0da47d415?q=80&w=1000',
    itensCount: ingredientesTraduzidos.length,
    dicaIA: (params.dicaIA as string) || "Que tal adicionar seu toque especial a essa receita?",

    ingredientes: ingredientesTraduzidos.length > 0 ? ingredientesTraduzidos : [{ id: '1', nome: 'Sem ingredientes cadastrados.', status: 'faltando' as const }],
    preparo: passosTraduzidos.length > 0 ? passosTraduzidos : [{ titulo: "Siga sua intuição", descricao: "Sem passos cadastrados", dica: "", hasTimer: false, tempoTimer: 0 }]
  };

  // Tela de detalhes da receita, com animações, compartilhamento e navegação para a tela de preparo
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

      {/* Conteúdo Principal */}
      <View style={styles.mainContentWrapper}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {!isIA && (
            <Animated.View entering={FadeInUp.duration(600)} style={styles.imageHeader}>
              <Image source={{ uri: receita.imagem }} style={styles.image} />
              <Animated.View entering={FadeInLeft.delay(500)} style={[styles.badgePopular, { backgroundColor: Colors.primary }]}>
                <Text style={styles.badgeText}>Sugestão Quase Chef</Text>
              </Animated.View>
            </Animated.View>
          )}
          {/* Conteúdo da receita, ingredientes e preparo, com animações para cada seção e item */}
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
              <Animated.View key={item.id} entering={FadeInLeft.delay(400 + index * 50)} style={[styles.ingredientItem, item.status === 'faltando' && styles.ingredientMissing]}>
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

            {/* Preparo da receita, com animações para cada passo */}
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
      {/* Botões de ação para favoritar e iniciar preparo, fixados no rodapé da tela */}
      <View style={styles.footer}>
        <Pressable onPress={() => setFavorito(!favorito)} style={styles.favButton}>
          <Heart size={26} color={Colors.secondary} fill={favorito ? Colors.secondary : 'transparent'} />
        </Pressable>
        <Pressable
          style={styles.mainButton}
          onPress={() => router.push({
            pathname: '/preparo_receita',
            params: {
              titulo: receita.titulo,
              imagem: receita.imagem,
              passosJson: JSON.stringify(receita.preparo)
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

// Sub-componentes mantidos
interface InfoCardProps {
  icon: React.ComponentType<{ size: number; color: string }>;
  label: string;
  value: string;
}

const InfoCard: React.FC<InfoCardProps> = ({ icon: Icon, label, value }) => (
  <View style={styles.infoCard}>
    <View style={styles.infoIconContainer}><Icon size={18} color={Colors.primary} /></View>
    <View>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  </View>
);