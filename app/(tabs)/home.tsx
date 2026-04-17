import { useFocusEffect, useRouter } from "expo-router";
import {
  ChevronDown,
  ChevronRight,
  User2,
  Zap
} from "lucide-react-native";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

// Meus imports
import { GenerateButton } from "../../components/generate_button";
import { Header } from "../../components/header";
import { Colors, Radius, Spacing } from "../../constants/theme";
import { homeStyles as styles } from "../../styles/home_styles";

// Hooks e bibliotecas para autenticação e armazenamento local
import { useAuth } from "@/hooks/useAuth";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Novo hook de sugestões
import { useSugestoesHome } from "../../hooks/useSugestoesHome";

// Componente principal
export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [fotoUrl, setFotoUrl] = useState('');

  const [nomeExibido, setNomeExibido] = useState<any>(["Usuário"]);

  // Chama o nosso novo hook pedindo 3 receitas baseadas no estoque
  const { sugestoes, carregando } = useSugestoesHome(3);

  useFocusEffect(
    useCallback(() => {
      const carregarDadosUsuario = async () => {
        // --- 1. Carrega o Nome ---
        if (user?.full_name) {
          setNomeExibido(user.full_name.split(" "));
        } else {
          const nomeSalvo = await AsyncStorage.getItem("@user_full_name");
          if (nomeSalvo) setNomeExibido(nomeSalvo.split(" "));
        }

        // --- 2. Carrega a Foto ---
        if (user?.avatar_url) {
          setFotoUrl(user.avatar_url);
        } else {
          const fotoSalva = await AsyncStorage.getItem("@user_foto");
          if (fotoSalva) setFotoUrl(fotoSalva);
        }
      };

      carregarDadosUsuario();
    }, [user])
  );

  // Renderiza o componente
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Header title="" showSearch={false} style={styles.customHeader}>
        <Pressable
          style={styles.userHeader}
          onPress={() => router.push("/perfil")}
        >
          <View style={styles.avatarContainer}>
            {fotoUrl ? (
              <Image
                source={{ uri: fotoUrl }}
                style={{ width: 40, height: 40, borderRadius: 20 }}
              />
            ) : (
              <User2 size={28} color={Colors.primary} />
            )}
          </View>
          <View>
            <Text style={styles.greetingText}>Bom dia,</Text>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
            >
              <Text style={styles.userName}>Olá, {nomeExibido[0]}!</Text>
              <ChevronDown size={16} color={Colors.primary} />
            </View>
          </View>
        </Pressable>
      </Header>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.Text
          entering={FadeInDown.delay(100)}
          style={styles.mainTitle}
        >
          O que vamos cozinhar hoje?
        </Animated.Text>
        <Animated.Text
          entering={FadeInDown.delay(200)}
          style={styles.mainSubtitle}
        >
          Transforme o que você tem na geladeira em pratos incríveis.
        </Animated.Text>

        {/* Hero Card */}
        <Animated.View
          entering={FadeInDown.delay(500)}
          style={styles.heroCard}
        >
          <View style={styles.heroTextArea}>
            <View style={styles.heroTag}>
              <Zap size={10} color={Colors.primary} fill={Colors.primary} />
              <Text style={styles.heroTagText}>QUASE CHEF</Text>
            </View>
            <Text style={styles.heroTitle}>Cozinhe sem desperdícios!</Text>
          </View>
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=1470&q=80",
            }}
            style={styles.heroImage}
          />
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(600)}
          style={styles.btnContainer}
        >
          {/* Botão para gerar receitas */}
          <GenerateButton
            label="Gerar receitas mágicas"
            selectedCount={0}
            onPress={() => router.push("/selecao_ia")}
            alwaysVisible={true}
            forceEnabled={true}
            style={{
              borderRadius: Radius.lg,
              paddingVertical: Spacing.md,
            }}
          />
        </Animated.View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Sugestões rápidas</Text>

          {/* Adicionado o onPress para navegar para a aba de receitas */}
          <Pressable
            style={{ flexDirection: "row", alignItems: "center" }}
            onPress={() => router.push("/receitas")}
          >
            <Text style={[styles.editText, { fontSize: 14 }]}>Ver todas</Text>
            <ChevronRight size={16} color={Colors.primary} />
          </Pressable>
        </View>

        {/* Renderização Dinâmica das Sugestões */}
        {carregando ? (
          <ActivityIndicator size="large" color={Colors.secondary} style={{ marginVertical: 20 }} />
        ) : sugestoes.length > 0 ? (
          sugestoes.map((receita: any, index: number) => (
            <RecipeCard
              key={receita.id}
              delay={700 + (index * 100)} // Mantém o efeito cascata baseando-se no index
              image={{ uri: receita.image }}
              time={receita.time}
              title={receita.title}
              desc={receita.descStart}
              onPress={() => router.push({
                pathname: '/detalhe_receita',
                params: {
                  id: receita.id,
                  title: receita.title,
                  time: receita.time,
                  difficulty: receita.difficulty,
                  image: receita.image,
                  calories: receita.calories,
                  description: receita.descStart,
                  ingredients: receita.rawIngredients,
                  steps: receita.rawSteps,
                }
              })}
            />
          ))
        ) : (
          <View style={{ padding: 20, alignItems: 'center' }}>
            <Text style={{ color: Colors.subtext, textAlign: 'center' }}>
              Adicione mais itens na dispensa para ver sugestões mágicas por aqui!
            </Text>
          </View>
        )}

      </ScrollView>
    </View>
  );
}

// Sub-componentes mantidos
const RecipeCard = ({ delay, image, time, title, desc, onPress }: any) => (
  <Animated.View
    entering={FadeInDown.delay(delay).springify()}
    style={styles.recipeCard}
  >
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={styles.recipeTouchable}
    >
      <Image
        source={image}
        style={styles.recipeImage}
        resizeMode="cover"
      />

      {/* Container Principal das Infos (agora é row) */}
      <View style={styles.recipeInfo}>

        {/* Bloco de Esquerda: Apenas Textos */}
        <View style={styles.recipeTextBlock}>
          <Text style={styles.recipeTime}>⏱ {time}</Text>

          <Text style={styles.recipeTitle} numberOfLines={1}>
            {title}
          </Text>

          <Text style={styles.recipeDesc} numberOfLines={2}>
            {desc}
          </Text>
        </View>

        {/* Bloco de Direita: Seta Grande e Centralizada */}
        <View style={styles.recipeArrowBlock}>
          <ChevronRight size={22} color={Colors.primary} strokeWidth={2.5} />
        </View>

      </View>
    </TouchableOpacity>
  </Animated.View>
);