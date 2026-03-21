import { View, Text, TextInput, Button, Pressable } from "react-native";
import { router } from "expo-router";

export default function LoginScreen() {
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
        Bem-vindo de volta!
      </Text>

      <TextInput
        placeholder="Email"
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

      <Button title="Entrar" onPress={() => router.replace("/(tabs)/home")} />

      <Pressable onPress={() => router.push("/(auth)/esqueci_senha")}>
        <Text style={{ marginTop: 12, color: "#475569" }}>
          Esqueceu a senha?
        </Text>
      </Pressable>

      <Pressable onPress={() => router.push("/(auth)/cadastro")}>
        <Text style={{ marginTop: 12, color: "#475569" }}>Cadastre-se</Text>
      </Pressable>
    </View>
  );
}