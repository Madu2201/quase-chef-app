import { useRouter } from "expo-router";
import {
  ChevronDown,
  Flame,
  Leaf,
  User2,
  UtensilsCrossed,
  ChevronRight,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
  StatusBar,
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

  const [nomeExibido, setNomeExibido] = useState<any>(["Usuário"]);

  useEffect(() => {
    const carregarNome = async () => {
      if (user?.full_name) {
        setNomeExibido((user.full_name || "").split(" "));
      } else {
        const salvo = await AsyncStorage.getItem("@user_name");
        if (salvo) setNomeExibido(salvo.split(" "));
      }
    };
    carregarNome();
  }, [user]);

  const ativosCount = INGREDIENTES.filter(i => i.active).length;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Header title="" showSearch={false}>
        <Pressable
          style={styles.userHeader}
          onPress={() => router.push("/perfil")}
        >
          <View style={styles.avatarContainer}>
            {user?.avatar_url ? (
              <Image
                source={{ uri: user.avatar_url }}
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
        />
        <RecipeCard
          delay={800}
          image={require("../../assets/images/shakshuka.png")}
          time="15 MIN"
          title="Shakshuka"
          desc="Ovos cozidos em salsa de tomate."
        />
        <RecipeCard
          delay={900}
          image={require("../../assets/images/Pizza_marguerita.png")}
          time="20 MIN"
          title="Pizza de Marguerita"
          desc="Ingredientes frescos e massa leve."
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

const RecipeCard = ({ delay, image, time, title, desc }: any) => (
  <Animated.View
    entering={FadeInDown.delay(delay).springify()}
    style={styles.recipeCard}
  >
    <Image source={image} style={styles.recipeImage} />
    <View style={styles.recipeInfo}>
      <Text style={styles.recipeTime}>⏱ {time}</Text>
      <Text style={styles.recipeTitle}>{title}</Text>
      <Text style={styles.recipeDesc}>{desc}</Text>
    </View>
  </Animated.View>
);