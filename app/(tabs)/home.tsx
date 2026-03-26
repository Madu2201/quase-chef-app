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

  // Conteúdo da tela
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

      {/* Conteúdo principal */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.mainTitle}>O que vamos cozinhar hoje?</Text>
        <Text style={styles.mainSubtitle}>
          Transforme o que você tem na geladeira em pratos incríveis.
        </Text>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Ingredientes selecionados</Text>
          <Pressable><Text style={styles.editText}>Editar</Text></Pressable>
        </View>

        {/* Tags de Ingredientes */}
        <View style={styles.ingredientsWrapper}>
          <Tag icon={<Flame size={16} color={Colors.primary} />} label="Ovos (4)" />
          <Tag icon={<UtensilsCrossed size={16} color={Colors.primary} />} label="Tomate (1)" />
          <Tag icon={<Leaf size={16} color={Colors.primary} />} label="Cebola (1)" />
        </View>

        {/* Botão de Gerar Receitas */}
        <Pressable style={styles.generateButton}>
          <Sparkles size={20} color={Colors.light} fill={Colors.light} />
          <Text style={styles.generateButtonText}>Gerar receitas com meus ingredientes</Text>
        </Pressable>

        {/* Sugestões rápidas */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Sugestões rápidas</Text>
          <Pressable><Text style={[styles.editText, { fontSize: 14 }]}>Ver todas</Text></Pressable>
        </View>

        {/* Cards de Exemplo */}
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
          desc="Ovos cozidos em uma salsa de tomate e especiarias."
        />
      </ScrollView>
    </View>
  );
}

// Sub-componentes para limpar o código principal
const Tag = ({ icon, label }: { icon: any, label: string }) => (
  <View style={styles.ingredientTag}>
    {icon}
    <Text style={styles.ingredientText}>{label}</Text>
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