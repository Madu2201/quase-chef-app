import { View, Text, TextInput, Button, Pressable } from "react-native";
import { router } from "expo-router";

export default function CadastroScreen() {
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
        Criar Conta
      </Text>

      <TextInput
        placeholder="Nome completo"
        style={{
          borderWidth: 1,
          borderColor: "#94A3B8",
          padding: 10,
          marginBottom: 12,
        }}
      />
      <TextInput
        placeholder="Telefone"
        style={{
          borderWidth: 1,
          borderColor: "#94A3B8",
          padding: 10,
          marginBottom: 12,
        }}
      />
      <TextInput
        placeholder="Senha"
        secureTextEntry
        style={{
          borderWidth: 1,
          borderColor: "#94A3B8",
          padding: 10,
          marginBottom: 12,
        }}
      />
      <TextInput
        placeholder="Confirmar senha"
        secureTextEntry
        style={{
          borderWidth: 1,
          borderColor: "#94A3B8",
          padding: 10,
          marginBottom: 12,
        }}
      />

      <Pressable onPress={() => router.push("/(auth)/login")}>
        <Text style={{ marginTop: 12, color: "#475569" }}>
          Já tem conta? Voltar para Login
        </Text>
      </Pressable>
    </View>
  );
}