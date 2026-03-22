import { useEffect, useState } from "react";
import { View, Image, StyleSheet, StatusBar, Dimensions } from "react-native";
import { router } from "expo-router";
import { Colors } from "../../constants/theme";

const { width } = Dimensions.get("window");

export default function LoadingScreen() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    // Intervalo de 1 segundo para cada ponto
    const interval = setInterval(() => {
      setStep((prev) => {
        // Se chegar no 3º ponto, volta para o 1 (ciclo infinito)
        // O 0 é o estado "vazio" antes do primeiro ponto acender
        return prev < 3 ? prev + 1 : 1;
      });
    }, 1000);

    // Redirecionamento após exatamente 6 segundos (2 ciclos de 3s)
    const timer = setTimeout(() => {
      router.replace("/(auth)/login");
    }, 6000);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.secondary} />

      <View style={styles.content}>
        <Image
          source={require("../../assets/images/splash.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* Os pontos vão acender de 1 a 3, resetar e repetir */}
      <View style={styles.pagination}>
        <View
          style={[
            styles.dot,
            step >= 1 ? styles.dotActive : styles.dotInactive,
          ]}
        />
        <View
          style={[
            styles.dot,
            step >= 2 ? styles.dotActive : styles.dotInactive,
          ]}
        />
        <View
          style={[
            styles.dot,
            step >= 3 ? styles.dotActive : styles.dotInactive,
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.secondary,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: width * 0.8,
    height: width * 0.8,
  },
  pagination: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 60,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.light,
    // Transição suave para os pontos não "piscarem" secos
    transitionProperty: "opacity",
    transitionDuration: "0.3s",
  },
  dotActive: {
    opacity: 1,
    transform: [{ scale: 1.2 }],
  },
  dotInactive: {
    opacity: 0.3,
  },
});