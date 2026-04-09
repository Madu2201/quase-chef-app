import { router, useLocalSearchParams } from "expo-router";
import {
    Heart,
    Lightbulb,
    Pause,
    Play,
    RotateCcw,
    Share2,
    Stars,
    X,
} from "lucide-react-native";
import React from "react";
import {
    Alert,
    Image,
    Pressable,
    ScrollView,
    Share,
    StatusBar,
    Text,
    View,
} from "react-native";
import Animated, {
    FadeIn,
    FadeInLeft,
    FadeInUp,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from "react-native-reanimated";

// Meus imports
import { Colors } from "../constants/theme";
import { useFavoritosGlobal } from "../hooks/useFavoritos";
import { usePreparoReceita } from "../hooks/usePreparoReceita";
import type { Recipe } from "../hooks/useReceitas";
import { preparoStyles as styles } from "../styles/preparo_styles";
import { formatTime } from "../utils/timeFormatter";

export default function PreparoReceitaScreen() {
  const params = useLocalSearchParams();
  const idReceita = params.id as string;

  // Tratamento de dados iniciais
  const imagemUri = Array.isArray(params.imagem)
    ? params.imagem[0]
    : params.imagem;
  const passosDinamicos = params.passosJson
    ? JSON.parse(params.passosJson as string)
    : [];

  // LÓGICA EXTRAÍDA PARA HOOKS
  const { isFavorito, toggleFavorito } = useFavoritosGlobal();
  const {
    passoAtual,
    isConcluido,
    tempo,
    timerAtivo,
    setTimerAtivo,
    proximoPasso,
    passoAnterior,
    resetarTimer,
    step,
    totalPassos,
  } = usePreparoReceita(passosDinamicos);

  const isIA = params.tipo === "ia";
  const iaRecipeData: Recipe | undefined = isIA
    ? {
        id: idReceita,
        title: (params.titulo as string) || "",
        time: (params.time as string) || "",
        difficulty: (params.difficulty as string) || "",
        descStart: (params.description as string) || "",
        ingredients: (params.rawIngredients as string) || "[]",
        descEnd: "",
        image: imagemUri as string,
        calories: (params.calories as string) || "",
        rawIngredients: (params.rawIngredients as string) || "[]",
        rawSteps: (params.passosJson as string) || "[]",
        tags: ["IA"],
        tipo: "ia",
      }
    : undefined;

  const ehFav = isFavorito(idReceita);
  const heartScale = useSharedValue(1);

  const handleToggleFavorito = () => {
    if (idReceita) {
      toggleFavorito(idReceita, iaRecipeData);
      heartScale.value = withSpring(1.5, {}, () => {
        heartScale.value = withSpring(1);
      });
    }
  };

  // Função de compartilhamento
  const handleShare = async () => {
    try {
      await Share.share({
        message: `Olha só a receita de ${params.titulo} que acabei de preparar! 🍳`,
      });
    } catch (error) {
      Alert.alert("Erro", "Não foi possível compartilhar.");
    }
  };

  const animatedHeartStyle = useAnimatedStyle(() => ({
    transform: [{ scale: heartScale.value }],
  }));

  // VIEW: ESTADO CONCLUÍDO
  if (isConcluido) {
    return (
      <ScrollView
        contentContainerStyle={styles.containerSucesso}
        showsVerticalScrollIndicator={false}
      >
        <StatusBar barStyle="dark-content" />
        <Animated.View
          entering={FadeInUp.duration(600)}
          style={styles.badgeWrapper}
        >
          <View style={styles.successBadge}>
            <Stars size={48} color={Colors.primary} />
          </View>
        </Animated.View>

        <Animated.View
          entering={FadeInUp.duration(600).delay(200)}
          style={{ width: "100%", alignItems: "center" }}
        >
          <Text style={styles.congratsTitle}>Parabéns!</Text>
          <Text style={styles.congratsSub}>
            Você concluiu sua receita com sucesso.
          </Text>
        </Animated.View>

        <Animated.View
          entering={FadeInLeft.duration(600).delay(400)}
          style={[styles.successCard, { width: "100%" }]}
        >
          <Image
            source={{ uri: imagemUri as string }}
            style={styles.successImage}
            resizeMode="cover"
          />
          <View style={styles.successInfo}>
            <Text style={styles.preparouLabel}>VOCÊ PREPAROU:</Text>
            <Text style={styles.sucessRecipeTitle}>{params.titulo}</Text>
          </View>
        </Animated.View>

        <Animated.View
          entering={FadeInUp.duration(600).delay(600)}
          style={[styles.successActions, { width: "100%" }]}
        >
          <Pressable
            style={[styles.btnOutline, ehFav && styles.btnOutlineActive]}
            onPress={handleToggleFavorito}
          >
            <Animated.View style={animatedHeartStyle}>
              <Heart
                size={18}
                color={ehFav ? Colors.errorDark : Colors.primary}
                fill={ehFav ? Colors.errorDark : "transparent"}
              />
            </Animated.View>
            <Text
              style={[
                styles.btnOutlineText,
                ehFav && { color: Colors.errorDark },
              ]}
            >
              {ehFav ? "Favoritado" : "Favoritar"}
            </Text>
          </Pressable>

          <Pressable style={styles.btnOutline} onPress={handleShare}>
            <Share2 size={18} color={Colors.primary} />
            <Text style={styles.btnOutlineText}>Compartilhar</Text>
          </Pressable>
        </Animated.View>

        <Animated.View
          entering={FadeInUp.duration(600).delay(800)}
          style={{ width: "100%" }}
        >
          <Pressable
            style={styles.btnVoltarInico}
            onPress={() => router.back()}
          >
            <Text style={[styles.btnAcaoTexto, { color: Colors.light }]}>
              Voltar para Início
            </Text>
          </Pressable>
        </Animated.View>
      </ScrollView>
    );
  }

  // VIEW: ESTADO DE PREPARO (PASSOS)
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.closeButton}>
          <X size={24} color={Colors.primary} />
        </Pressable>
        <Text style={styles.headerTitle}>{params.titulo}</Text>
      </View>

      <View style={styles.progressContainer}>
        {passosDinamicos.map((_: any, i: number) => (
          <View
            key={i}
            style={[
              styles.progressStep,
              i <= passoAtual ? styles.progressActive : styles.progressInactive,
            ]}
          />
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Animated.View key={passoAtual} entering={FadeIn.duration(400)}>
          <View style={styles.stepCard}>
            <Text style={styles.stepIndicator}>
              Passo {passoAtual + 1} de {totalPassos}
            </Text>
            <Text style={styles.stepTitle}>{step?.titulo}</Text>
            <Text style={styles.stepDescription}>{step?.descricao}</Text>

            {step?.hasTimer && (
              <View style={styles.timerInternalWrapper}>
                <View style={styles.outerCircle}>
                  <View style={styles.innerCircle}>
                    <Text style={styles.timerText}>{formatTime(tempo)}</Text>
                    <Text style={styles.timerSubtext}>Tempo</Text>
                  </View>
                </View>

                <View style={styles.timerActionsRow}>
                  <Pressable
                    style={styles.btnTimerReset}
                    onPress={resetarTimer}
                  >
                    <RotateCcw size={15} color={Colors.primary} />
                    <Text style={styles.btnTimerResetText}>Reiniciar</Text>
                  </Pressable>

                  <Pressable
                    style={styles.btnTimerControl}
                    onPress={() => setTimerAtivo(!timerAtivo)}
                  >
                    {timerAtivo ? (
                      <Pause size={20} color="white" fill="white" />
                    ) : (
                      <Play size={15} color="white" fill="white" />
                    )}
                    <Text style={styles.btnTimerControlText}>
                      {timerAtivo ? "Pausar" : "Iniciar"}
                    </Text>
                  </Pressable>
                </View>
              </View>
            )}
          </View>

          <Animated.View
            entering={FadeInLeft.duration(600).delay(200)}
            style={styles.dicaBox}
          >
            <View style={styles.dicaIconCircle}>
              <Lightbulb size={20} color={Colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.dicaTitle}>DICA DO CHEF</Text>
              <Text style={styles.dicaText}>{step?.dica}</Text>
            </View>
          </Animated.View>
        </Animated.View>
      </ScrollView>

      <View style={styles.footer}>
        {passoAtual > 0 && (
          <Pressable
            style={[styles.btnAcao, styles.btnBorda]}
            onPress={passoAnterior}
          >
            <Text style={[styles.btnAcaoTexto, { color: Colors.primary }]}>
              Anterior
            </Text>
          </Pressable>
        )}
        <Pressable
          style={[styles.btnAcao, styles.btnLaranja]}
          onPress={proximoPasso}
        >
          <Text style={[styles.btnAcaoTexto, { color: Colors.light }]}>
            {passoAtual === totalPassos - 1 ? "Concluir" : "Próximo"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
