import React from "react";
import { View, Text, Image, ScrollView, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { ChevronDown, Sparkles, Flame, UtensilsCrossed, Leaf, User2 } from "lucide-react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import { Header } from "../../components/header";
import { homeStyles as styles } from "../../styles/home_styles";
import { Colors } from "../../constants/theme";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Header title="" showSearch={false}>
        <Pressable style={styles.userHeader} onPress={() => router.push("/perfil")}>
          <View style={styles.avatarContainer}>
            <User2 size={28} color={Colors.primary} />
          </View>
          <View>
            <Text style={styles.greetingText}>Bom dia,</Text>
            <View style={styles.userNameRow}>
              <Text style={styles.userName}>Olá, Maria!</Text>
              <ChevronDown size={18} color={Colors.primary} />
            </View>
          </View>
        </Pressable>
      </Header>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.mainTitle}>O que vamos cozinhar hoje?</Text>
        <Text style={styles.mainSubtitle}>
          Transforme o que você tem na geladeira em pratos incríveis.
        </Text>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Ingredientes selecionados</Text>
          <Pressable onPress={() => router.push("/dispensa")}>
            <Text style={styles.editText}>Editar</Text>
          </Pressable>
        </View>

        {/* Chips de Ingredientes com Quebra de Linha Automática */}
        <View style={styles.ingredientsWrapper}>
          <Chip active icon={<Flame size={14} color={Colors.light} />} label="Ovos (4)" />
          <Chip icon={<UtensilsCrossed size={14} color={Colors.primary} />} label="Tomate (1)" />
          <Chip icon={<Leaf size={14} color={Colors.primary} />} label="Cebola (1)" />
        </View>

        <Pressable style={styles.generateButton} onPress={() => console.log("Gerar Receitas")}>
          <Sparkles size={15} color={Colors.light} fill={Colors.light} />
          <Text style={styles.generateButtonText}>Gerar receitas com meus ingredientes</Text>
        </Pressable>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Sugestões rápidas</Text>
          <Pressable><Text style={[styles.editText, { fontSize: 14 }]}>Ver todas</Text></Pressable>
        </View>

        <RecipeCard
          delay={200}
          image={require("../../assets/images/omelete.png")}
          time="10 MIN"
          title="Omelete de Ervas"
          desc="Perfeito com seus 4 ovos."
        />

        <RecipeCard
          delay={400}
          image={require("../../assets/images/shakshuka.png")}
          time="15 MIN"
          title="Shakshuka"
          desc="Ovos cozidos em salsa de tomate."
        />

        <RecipeCard
          delay={600}
          image={require("../../assets/images/Pizza_marguerita.png")}
          time="20 MIN"
          title="Pizza de Marguerita"
          desc="Ingredientes frescos e massa leve."
        />
      </ScrollView>
    </View>
  );
}

// Sub-componentes internos para manter o código limpo
const Chip = ({ active = false, icon, label }: any) => (
  <View style={[styles.chip, active && styles.chipActive]}>
    {icon}
    <Text style={active ? styles.chipTextActive : styles.chipText}>{label}</Text>
  </View>
);

const RecipeCard = ({ delay, image, time, title, desc }: any) => (
  <Animated.View entering={FadeInDown.delay(delay)} style={styles.recipeCard}>
    <Image source={image} style={styles.recipeImage} />
    <View style={styles.recipeInfo}>
      <Text style={styles.recipeTime}>⏱ {time}</Text>
      <Text style={styles.recipeTitle}>{title}</Text>
      <Text style={styles.recipeDesc}>{desc}</Text>
    </View>
  </Animated.View>
);