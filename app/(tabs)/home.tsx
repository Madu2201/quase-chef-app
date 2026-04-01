import { useRouter, useFocusEffect } from "expo-router";
import {
  ChevronDown,
  Flame,
  Leaf,
  User2,
  UtensilsCrossed,
  ChevronRight,
} from "lucide-react-native";
import React, { useEffect, useState, useCallback } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
  StatusBar,
  TouchableOpacity,
} from "react-native";
/* Adicionada a animação FadeInRight */
import Animated, { FadeInDown, FadeInRight } from "react-native-reanimated";

import { Header } from "../../components/header";
import { GenerateButton } from "../../components/generate_button";
import { Colors, Spacing, Radius, FontSizes } from "../../constants/theme";
import { homeStyles as styles } from "../../styles/home_styles";

// import de dados
import { useAuth } from "@/hooks/useAuth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User as UserIcon } from 'lucide-react-native';

// Dados mockados para os chips animados
const INGREDIENTES = [
  {
    id: 1,
    icon: <Flame size={14} color={Colors.light} />,
    label: "Ovos (4)",
    active: true,
  },
  {
    id: 2,
    icon: <UtensilsCrossed size={14} color={Colors.primary} />,
    label: "Tomate (1)",
  },
  {
    id: 3,
    icon: <Leaf size={14} color={Colors.primary} />,
    label: "Cebola (1)",
  },
  {
    id: 4,
    icon: <Leaf size={14} color={Colors.primary} />,
    label: "Pimentão (1)",
  },
  {
    id: 5,
    icon: <Leaf size={14} color={Colors.primary} />,
    label: "Queijo (200g)",
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [fotoUrl, setFotoUrl] = useState('');

  const [nomeExibido, setNomeExibido] = useState<any>(["Usuário"]);

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
    }, [user]) // O array de dependências avisa: "rode de novo se o objeto 'user' mudar"
  );

  const ativosCount = INGREDIENTES.filter((i) => i.active).length;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Header title="" showSearch={false}>
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

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Ingredientes selecionados</Text>
          <Pressable onPress={() => router.push("/dispensa")}>
            <Text style={styles.editText}>Editar</Text>
          </Pressable>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.ingredientsScroll}
          contentContainerStyle={styles.ingredientsScrollContent}
        >
          {INGREDIENTES.map((item, index) => (
            <Animated.View
              key={item.id}
              entering={FadeInRight.delay(index * 100 + 300).duration(500)}
            >
              <Chip active={item.active} icon={item.icon} label={item.label} />
            </Animated.View>
          ))}
        </ScrollView>

        <Animated.View
          entering={FadeInDown.delay(600)}
          style={styles.btnContainer}
        >
          {/* Botão com estilo customizado para a Home */}
          <GenerateButton
            label="Gerar receitas mágicas"
            selectedCount={ativosCount}
            onPress={() => router.push("/selecao_ia")}
            alwaysVisible={true}
            showBadge={false}
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

        <RecipeCard
          delay={700}
          image={require("../../assets/images/omelete.png")}
          time="10 MIN"
          title="Omelete de Ervas"
          desc="Perfeito com seus 4 ovos."
          onPress={() => router.push("/detalhe_receita")}
        />
        <RecipeCard
          delay={800}
          image={require("../../assets/images/shakshuka.png")}
          time="15 MIN"
          title="Shakshuka"
          desc="Ovos cozidos em salsa de tomate."
          onPress={() => router.push("/detalhe_receita")}
        />
        <RecipeCard
          delay={900}
          image={require("../../assets/images/Pizza_marguerita.png")}
          time="20 MIN"
          title="Pizza de Marguerita"
          desc="Ingredientes frescos e massa leve."
          onPress={() => router.push("/detalhe_receita")}
        />
      </ScrollView>
    </View>
  );
}

// Sub-componentes mantidos
const Chip = ({ active = false, icon, label }: any) => (
  <View style={[styles.chip, active && styles.chipActive]}>
    {icon}
    <Text style={active ? styles.chipTextActive : styles.chipText}>
      {label}
    </Text>
  </View>
);

const RecipeCard = ({ delay, image, time, title, desc, onPress }: any) => (
  <Animated.View
    entering={FadeInDown.delay(delay).springify()}
    style={styles.recipeCard}
  >
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={{ flexDirection: "row", alignItems: "center" }}
    >
      <Image source={image} style={styles.recipeImage} />
      <View style={styles.recipeInfo}>
        <Text style={styles.recipeTime}>⏱ {time}</Text>
        <Text style={styles.recipeTitle}>{title}</Text>
        <Text style={styles.recipeDesc} numberOfLines={1}>
          {desc}
        </Text>

        <View
          style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}
        >
          <Text
            style={{
              color: Colors.primary,
              fontSize: FontSizes.small,
              fontWeight: "600",
              marginRight: 2,
            }}
          >
            Ver receita
          </Text>
          <ChevronRight size={14} color={Colors.primary} />
        </View>
      </View>
    </TouchableOpacity>
  </Animated.View>
);