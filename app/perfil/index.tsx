import { View, Text, Pressable } from "react-native";
import { router } from "expo-router";

export default function PerfilScreen() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#FFF3E8",
        padding: 20,
      }}
    >
      {/* Botão de voltar para Home */}
      <Pressable
        onPress={() => router.replace("/(tabs)/home")}
        style={{
          marginBottom: 20,
          paddingVertical: 8,
          paddingHorizontal: 12,
          backgroundColor: "#f88b3d",
          borderRadius: 6,
          alignSelf: "flex-start",
        }}
      >
        <Text style={{ color: "#fff", fontSize: 16 }}>← Voltar para Home</Text>
      </Pressable>

      {/* Conteúdo do Perfil */}
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ fontSize: 24, fontWeight: "bold", color: "#f88b3d" }}>
          Meu Perfil
        </Text>
        <Text style={{ marginTop: 8, color: "#475569" }}>
          Aqui vão os dados do usuário.
        </Text>
      </View>
    </View>
  );
}