import { Stack } from "expo-router";

// Aqui definimos a estrutura de navegação para as telas de autenticação.
export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="loading" />
      <Stack.Screen name="login" />
      <Stack.Screen name="cadastro" />
      <Stack.Screen name="esqueci_senha" />
    </Stack>
  );
}