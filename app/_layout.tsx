import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_700Bold,
  useFonts,
} from "@expo-google-fonts/plus-jakarta-sans";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { AuthProvider } from "../hooks/useAuth";
import { DispensaProvider } from "../hooks/useDispensa";
import { FavoritosProvider } from "../hooks/useFavoritos";
import { ReceitasProvider } from "../hooks/useReceitas";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    "PlusJakartaSans-Regular": PlusJakartaSans_400Regular,
    "PlusJakartaSans-Medium": PlusJakartaSans_500Medium,
    "PlusJakartaSans-Bold": PlusJakartaSans_700Bold,
  });

useEffect(() => {
    if (loaded || error) {
      // Adicionamos um fôlego de 500ms para o React Native renderizar
      // a sua primeira tela (LoadingScreen) antes de remover o fundo laranja nativo
      setTimeout(async () => {
        await SplashScreen.hideAsync();
      }, 500);
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <DispensaProvider>
          <ReceitasProvider>
            <FavoritosProvider>
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(auth)" />
                <Stack.Screen name="(tabs)" />
                <Stack.Screen
                  name="selecao_ia"
                  options={{ presentation: "modal" }}
                />
                <Stack.Screen name="detalhe_receita" />
                <Stack.Screen name="preparo_receita" />
                <Stack.Screen name="perfil" />
              </Stack>
            </FavoritosProvider>
          </ReceitasProvider>
        </DispensaProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}