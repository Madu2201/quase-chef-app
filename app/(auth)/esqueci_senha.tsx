import { View, Text, TextInput, Button, Pressable } from "react-native";
import { router } from "expo-router";

export default function EsqueciSenhaScreen() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        padding: 20,
        backgroundColor: "#FFF3E8",
      }}
    >
      <Text
        style={{
          fontSize: 24,
          fontWeight: "bold",
          color: "#f88b3d",
          marginBottom: 16,
        }}
      >
        Esqueci minha senha
      </Text>

      <TextInput
        placeholder="Digite seu e-mail"
        style={{
          borderWidth: 1,
          borderColor: "#94A3B8",
          padding: 10,
          marginBottom: 12,
        }}
      />

      <Button
        title="Enviar instruções"
        onPress={() => router.push("/(auth)/login")}
      />

      <Pressable onPress={() => router.push("/(auth)/login")}>
        <Text style={{ marginTop: 12, color: "#475569" }}>
          Voltar para Login
        </Text>
      </Pressable>
    </View>
  );
}