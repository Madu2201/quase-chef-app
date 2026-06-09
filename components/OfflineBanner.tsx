import { useSegments } from "expo-router";
import { WifiOff } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Platform, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Meus imports
import { Colors, Fonts, FontSizes, Radius, Shadows, Spacing, } from "../constants/theme";
import { useNetworkStatus } from "../hooks/useNetworkStatus";

const HIDDEN_OFFSET = 16;
const TABS_BOTTOM_OFFSET = 72;

// Função para exibir um banner de aviso quando o dispositivo estiver offline
export function OfflineBanner() {
  const { isOffline, offlineActionMessage } = useNetworkStatus();
  const insets = useSafeAreaInsets();
  const segments = useSegments();
  const [shouldRender, setShouldRender] = useState(isOffline);
  const isOfflineRef = useRef(isOffline);
  const opacity = useRef(new Animated.Value(isOffline ? 1 : 0)).current;
  const translateY = useRef(new Animated.Value(isOffline ? 0 : HIDDEN_OFFSET)).current;

  const isTabsRoute = segments[0] === "(tabs)";
  const bottomOffset =
    (isTabsRoute ? TABS_BOTTOM_OFFSET : Spacing.md) + insets.bottom;

  useEffect(() => {
    isOfflineRef.current = isOffline;
  }, [isOffline]);

  useEffect(() => {
    opacity.stopAnimation();
    translateY.stopAnimation();

    if (isOffline) {
      setShouldRender(true);

      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 180,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 180,
          useNativeDriver: true,
        }),
      ]).start();

      return;
    }

    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: HIDDEN_OFFSET,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (finished && !isOfflineRef.current) {
        setShouldRender(false);
      }
    });
  }, [isOffline, opacity, translateY]);

  if (!shouldRender) {
    return null;
  }

  return (
    <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
      <Animated.View
        pointerEvents="none"
        style={[
          styles.container,
          {
            bottom: bottomOffset,
            opacity,
            transform: [{ translateY }],
          },
        ]}
      >
        <WifiOff color={Colors.light} size={16} />
        <Text style={styles.text}>
          {offlineActionMessage ||
            "Sem internet. Algumas ações podem não funcionar."}
        </Text>
      </Animated.View>
    </View>
  );
}

// Estilos para o banner offline
const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: Spacing.md,
    right: Spacing.md,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.md,
    backgroundColor: "rgba(0, 0, 0, 0.88)",
    ...Shadows.lg,
    ...Platform.select({
      web: {
        boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.22)",
      },
      default: {},
    }),
  },
  text: {
    flex: 1,
    color: Colors.light,
    fontFamily: Fonts.medium,
    fontSize: FontSizes.small,
  },
});