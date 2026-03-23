import React from "react";
import { View, Text, Image, ScrollView, Pressable } from "react-native";
import { useRouter } from "expo-router";
import {
  ChevronDown,
  Sparkles,
  Flame,
  UtensilsCrossed,
  Leaf,
  User2
} from "lucide-react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { homeStyles as styles } from "../../styles/home_styles";
import { Colors } from "../../constants/theme";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>

      {/* Header Fixo com Sombra */}
      <View style={styles.headerFixed}>
        <Pressable
          style={styles.userHeader}
          onPress={() => router.push("/perfil")}
        >
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
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.mainTitle}>O que vamos cozinhar hoje?</Text>
        <Text style={styles.mainSubtitle}>
          Transforme o que você tem na geladeira em pratos incríveis.
        </Text>

        {/* Ingredientes com quebra de linha (Responsivo) */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Ingredientes selecionados</Text>
          <Pressable>
            <Text style={styles.editText}>Editar</Text>
          </Pressable>
        </View>

        <View style={styles.ingredientsWrapper}>
          <View style={styles.ingredientTag}>
            <Flame size={16} color={Colors.primary} />
            <Text style={styles.ingredientText}>Ovos (4)</Text>
          </View>
          <View style={styles.ingredientTag}>
            <UtensilsCrossed size={16} color={Colors.primary} />
            <Text style={styles.ingredientText}>Tomate (1)</Text>
          </View>
          <View style={styles.ingredientTag}>
            <Leaf size={16} color={Colors.primary} />
            <Text style={styles.ingredientText}>Cebola (1)</Text>
          </View>
        </View>

        {/* Botão Gerar Receitas */}
        <Pressable style={styles.generateButton}>
          <Sparkles size={20} color={Colors.light} fill={Colors.light} />
          <Text style={styles.generateButtonText}>
            Gerar receitas com meus ingredientes
          </Text>
        </Pressable>

        {/* Sugestões */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Sugestões rápidas</Text>
          <Pressable>
            <Text style={[styles.editText, { fontSize: 14 }]}>Ver todas</Text>
          </Pressable>
        </View>

        <Animated.View entering={FadeInDown.delay(200)} style={styles.recipeCard}>
          <Image
            source={require("../../assets/images/omelete.png")}
            style={styles.recipeImage}
          />
          <View style={styles.recipeInfo}>
            <Text style={styles.recipeTime}>⏱ 10 MIN</Text>
            <Text style={styles.recipeTitle}>Omelete de Ervas e Queijo</Text>
            <Text style={styles.recipeDesc}>Perfeito com seus 4 ovos e queijo.</Text>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(400)} style={styles.recipeCard}>
          <Image
            source={require("../../assets/images/shakshuka.png")}
            style={styles.recipeImage}
          />
          <View style={styles.recipeInfo}>
            <Text style={styles.recipeTime}>⏱ 20 MIN</Text>
            <Text style={styles.recipeTitle}>Shakshuka Express</Text>
            <Text style={styles.recipeDesc}>Usa seus tomates e cebola frescos.</Text>
          </View>
        </Animated.View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}