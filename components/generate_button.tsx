import { LinearGradient } from "expo-linear-gradient";
import { Sparkles } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  StyleSheet, Text, TouchableOpacity, View
} from "react-native";
import Animated, {
  cancelAnimation, Easing, interpolate, useAnimatedStyle, useSharedValue, withRepeat, withTiming,
} from "react-native-reanimated";

// Meus imports
import { Colors, Fonts, FontSizes, Radius, Shadows, Spacing, } from "../constants/theme";
import type { GenerateButtonProps } from "../types/components";

const SHIMMER_BAND_WIDTH = 124;

// Mensagens de carregamento para o botão de gerar receitas
const LOADING_MESSAGES = [
  "Cozinhando ideias... 🍳",
  "Picando os ingredientes... 🔪",
  "Aquecendo o fogão... 🔥",
  "Misturando sabores... 🧂",
  "Finalizando o prato... ✨",
];

// Componente de botão de gerar receitas
export const GenerateButton = ({
  onPress,
  selectedCount,
  label = "Gerar receitas",
  style,
  badgeContainerStyle,
  showBadge = true,
  alwaysVisible = false,
  iconColor = Colors.light,
  disabled = false,
  forceEnabled = false,
  loading = false,
}: GenerateButtonProps) => {
  const buttonW = useSharedValue(220);
  const shimmerPhase = useSharedValue(0);
  const textOpacity = useSharedValue(1);
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    if (loading) {
      shimmerPhase.value = withRepeat(
        withTiming(1, { duration: 1600, easing: Easing.linear }),
        -1,
        false,
      );

      // Efeito de carrossel de texto
      const interval = setInterval(() => {
        textOpacity.value = withTiming(0, { duration: 400 }, () => {
          textOpacity.value = withTiming(1, { duration: 400 });
        });

        setTimeout(() => {
          setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
        }, 400);
      }, 4500)

      return () => {
        clearInterval(interval);
        cancelAnimation(textOpacity);
        textOpacity.value = 1;
        setMessageIndex(0);
      };
    } else {
      cancelAnimation(shimmerPhase);
      shimmerPhase.value = 0;
      textOpacity.value = 1;
      setMessageIndex(0);
    }
  }, [loading, shimmerPhase, textOpacity]);

  const shimmerStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: interpolate(
          shimmerPhase.value,
          [0, 1],
          [
            -SHIMMER_BAND_WIDTH,
            Math.max(buttonW.value, 120) + SHIMMER_BAND_WIDTH,
          ],
        ),
      },
      { rotate: "-14deg" },
    ],
  }));

  const animatedTextStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ translateY: interpolate(textOpacity.value, [0, 1], [4, 0]) }]
  }));

  if (!alwaysVisible && selectedCount === 0) return null;

  // Verifica se o botão deve estar desabilitado
  const isDisabled = forceEnabled
    ? disabled
    : disabled || (alwaysVisible && selectedCount === 0);
  const shouldReduceOpacity = forceEnabled
    ? false
    : alwaysVisible && selectedCount === 0;

  const effectiveIconColor = loading ? Colors.light : iconColor;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        style,
        shouldReduceOpacity && { opacity: 0.6 },
        loading && styles.buttonLoading,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={isDisabled}
      onLayout={(e) => {
        buttonW.value = e.nativeEvent.layout.width;
      }}
    >
      <View style={styles.content}>
        <Sparkles
          size={20}
          color={effectiveIconColor}
          fill={effectiveIconColor}
        />
        <Animated.View style={loading ? animatedTextStyle : null}>
          <Text style={styles.text}>
            {loading ? LOADING_MESSAGES[messageIndex] : label}
          </Text>
        </Animated.View>
      </View>

      {showBadge && selectedCount > 0 && (
        <View style={[styles.badgeContainer, badgeContainerStyle]}>
          <Text style={styles.badgeText}>{selectedCount}</Text>
        </View>
      )}

      {loading && (
        <Animated.View
          pointerEvents="none"
          style={[styles.shimmerStripe, shimmerStyle]}
        >
          <LinearGradient
            colors={[
              "transparent",
              "rgba(255,255,255,0.12)",
              "rgba(255,255,255,0.45)",
              "rgba(255,255,255,0.12)",
              "transparent",
            ]}
            locations={[0, 0.28, 0.5, 0.72, 1]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
      )}
    </TouchableOpacity>
  );
};

// Estilos do botão
const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: Radius.full,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    ...Shadows.md,
  },
  buttonLoading: {
    overflow: "hidden",
    opacity: 0.96,
  },
  shimmerStripe: {
    position: "absolute",
    left: 0,
    top: -10,
    bottom: -10,
    width: SHIMMER_BAND_WIDTH,
    zIndex: 2,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  text: {
    color: Colors.light,
    fontFamily: Fonts.bold,
    fontSize: FontSizes.medium - 1,
  },
  badgeContainer: {
    backgroundColor: Colors.light,
    width: 28,
    height: 28,
    borderRadius: Radius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    color: Colors.primary,
    fontSize: FontSizes.small,
    fontFamily: Fonts.bold,
  },
});
