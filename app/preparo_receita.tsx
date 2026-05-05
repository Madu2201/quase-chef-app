import { router, useLocalSearchParams } from "expo-router";
import {
  AlertCircle, Heart, Lightbulb, Pause, Play, RotateCcw, Share2, Stars, X,
} from "lucide-react-native";
import React from "react";
import {
  ActivityIndicator, Alert, Image, Pressable, ScrollView, Share, StatusBar, Text, View,
} from "react-native";
import Animated, {
  FadeIn, FadeInLeft, FadeInUp, useAnimatedStyle, useSharedValue, withSpring,
} from "react-native-reanimated";

// Meus imports organizados
import { Colors } from "../constants/theme";
import { useFavoritosGlobal } from "../hooks/useFavoritos";
import { usePreparoReceita } from "../hooks/usePreparoReceita";
import type { Recipe } from "../hooks/useReceitas";
import { preparoStyles as styles } from "../styles/preparo_styles";
import type { PassoPreparo } from "../types/detalhe_receita";
import type { PreparoReceitaParams } from "../types/preparo_receita";
import { criarReceitaIAParaPreparo, processarParamsPreparo } from "../utils/preparoUtils";
import { formatTime } from "../utils/timeFormatter";

export default function PreparoReceitaScreen() {
  // ============================================
  // REGRA 1: TODOS OS HOOKS NO TOPO
  // ============================================
  
  const params = useLocalSearchParams();

  // Processamento organizado dos parâmetros
  const paramsProcessados: PreparoReceitaParams = processarParamsPreparo(params);
  const passosDinamicos: PassoPreparo[] = paramsProcessados.passosJson
    ? JSON.parse(paramsProcessados.passosJson)
    : [];

  // Hooks - TODOS declarados no topo, sem early returns
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
    isLoading,
    erro,
  } = usePreparoReceita(passosDinamicos, paramsProcessados.id, paramsProcessados.tipo);

  // Estado local e Reanimated hooks
  const isIA = paramsProcessados.tipo === "ia";
  const iaRecipeData: Recipe | undefined = isIA
    ? criarReceitaIAParaPreparo(paramsProcessados)
    : undefined;

  const ehFav = isFavorito(paramsProcessados.id);
  const heartScale = useSharedValue(1);
  const animatedHeartStyle = useAnimatedStyle(() => ({
    transform: [{ scale: heartScale.value }],
  }));

  // Função para controlar o timer com validação
  const toggleTimer = () => {
    if (!timerAtivo && tempo <= 0) {
      return;
    }
    setTimerAtivo(!timerAtivo);
  };

  const handleToggleFavorito = () => {
    if (paramsProcessados.id) {
      toggleFavorito(paramsProcessados.id, iaRecipeData);
      heartScale.value = withSpring(1.5, {}, () => {
        heartScale.value = withSpring(1);
      });
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Olha só a receita de ${paramsProcessados.titulo} que acabei de preparar! 🍳`,
      });
    } catch (error) {
      Alert.alert("Erro", "Não foi possível compartilhar.");
    }
  };

  // ============================================
  // RENDERIZAÇÃO (após TODOS os hooks)
  // ============================================

  // Loading ao buscar receita no banco
  if (isLoading) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={Colors.secondary} />
          <Text style={{ marginTop: 12, color: Colors.subtext }}>Carregando receita...</Text>
        </View>
      </View>
    );
  }

  // Erro ao buscar receita
  if (erro) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <AlertCircle size={48} color={Colors.secondary} style={{ marginBottom: 16 }} />
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: Colors.primary, textAlign: 'center', marginBottom: 8 }}>
            Oops! Algo deu errado
          </Text>
          <Text style={{ fontSize: 14, color: Colors.subtext, textAlign: 'center', marginBottom: 20 }}>
            {erro}
          </Text>
          <Pressable 
            style={styles.btnLaranja}
            onPress={() => router.back()}
          >
            <Text style={[styles.btnAcaoTexto, { color: Colors.light }]}>Voltar</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  // VIEW: ESTADO CONCLUÍDO (renderizado como JSX, não early return)
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
            source={{ uri: paramsProcessados.imagem }}
            style={styles.successImage}
            resizeMode="cover"
          />
          <View style={styles.successInfo}>
            <Text style={styles.preparouLabel}>VOCÊ PREPAROU:</Text>
            <Text style={styles.sucessRecipeTitle}>{paramsProcessados.titulo}</Text>
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
        <Text style={styles.headerTitle}>{paramsProcessados.titulo}</Text>
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
                    style={[
                      styles.btnTimerControl,
                      (!timerAtivo && tempo <= 0) && styles.btnTimerControlDisabled // Adicione esta linha
                    ]}
                    onPress={toggleTimer}
                    disabled={!timerAtivo && tempo <= 0}
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

          {/* Renderiza apenas se houver uma dica no passo atual */}
          {!!step?.dica && (
            <Animated.View
              entering={FadeInLeft.duration(600).delay(200)}
              style={styles.dicaBox}
            >
              <View style={styles.dicaIconCircle}>
                <Lightbulb size={20} color={Colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.dicaTitle}>DICA DO CHEF</Text>
                <Text style={styles.dicaText}>{step.dica}</Text>
              </View>
            </Animated.View>
          )}
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
