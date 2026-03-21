import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="home" options={{ title: "Home" }} />
      <Tabs.Screen name="receitas" options={{ title: "Receitas" }} />
      {/* Perfil não entra aqui, para não aparecer na barra */}
    </Tabs>
  );
}