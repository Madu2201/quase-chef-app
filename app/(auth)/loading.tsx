import { useEffect, useState } from "react";
import { View, Image, StyleSheet, StatusBar, Dimensions, Text } from "react-native";
import { router } from "expo-router";

// Imports do Tema
import { Colors, Fonts, FontSizes, Spacing, Shadows, Radius } from "../../constants/theme";

const { width } = Dimensions.get("window");

export default function LoadingScreen() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => (prev < 3 ? prev + 1 : 1));
    }, 800);

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
        {/* Container da Logo para aplicar Borda e Arredondamento */}
        <View style={styles.logoWrapper}>
          <Image
            source={require("../../assets/images/icon.png")}
            style={styles.logo}
            resizeMode="cover" // Alterado para cover para preencher o quadrado arredondado
          />
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.title}>Quase Chef!</Text>
          <Text style={styles.subtitle}>
            Evite o desperdício, aproveite o sabor.
          </Text>
        </View>
      </View>

      <View style={styles.pagination}>
        {[1, 2, 3].map((item) => (
          <View
            key={item}
            style={[
              styles.dot,
              step >= item ? styles.dotActive : styles.dotInactive,
            ]}
          />
        ))}
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
    paddingHorizontal: Spacing.xl,
  },
  logoWrapper: {
    width: width * 0.3,
    height: width * 0.3,
    backgroundColor: Colors.light,
    borderRadius: Radius.lg * 2,
    borderWidth: 5,
    borderColor: Colors.light,
    overflow: "hidden",
    marginBottom: Spacing.lg,
    ...Shadows.lg,
  },
  logo: {
    width: "100%",
    height: "100%",
  },
  textContainer: {
    alignItems: "center",
    gap: Spacing.xs,
  },
  title: {
    fontFamily: Fonts.bold,
    fontSize: FontSizes.large * 1.5,
    color: Colors.light,
    textAlign: "center",
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.medium,
    color: Colors.light + "99", // Cor clara com opacidade
    textAlign: "center",
  },
  pagination: {
    flexDirection: "row",
    gap: Spacing.sm,
    marginBottom: 60,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.light,
  },
  dotActive: {
    opacity: 1,
    transform: [{ scale: 1.2 }],
  },
  dotInactive: {
    opacity: 0.4,
    transform: [{ scale: 1 }],
  },
});