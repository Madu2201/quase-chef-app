import { useEffect } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { router } from "expo-router";

export default function LoadingScreen() {
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/(auth)/login"); // vai para login depois de 2s
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FFF3E8",
      }}
    >
      <Text style={{ fontSize: 24, fontWeight: "bold", color: "#f88b3d" }}>
        Quase Chef!
      </Text>
      <Text style={{ marginTop: 8, color: "#475569" }}>
        Evite o desperdício, aproveite o sabor.
      </Text>
      <ActivityIndicator
        size="large"
        color="#f88b3d"
        style={{ marginTop: 16 }}
      />
    </View>
  );
}