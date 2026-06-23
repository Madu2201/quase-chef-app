import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || "";

// Solução para evitar o erro "window is not defined" no servidor (SSR)
const isWeb = Platform.OS === "web";
const isServer = typeof window === "undefined";

let customStorage;

if (isWeb) {
  if (!isServer) {
    // Se for Web e estiver no navegador, usa o localStorage do próprio navegador
    customStorage = window.localStorage;
  } else {
    // Se for Web mas estiver rodando no servidor, usa um objeto temporário vazio
    customStorage = {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
    };
  }
} else {
  // Se for celular (Android/iOS), usa o AsyncStorage padrão
  customStorage = AsyncStorage;
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: customStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: isWeb ? true : false, // Permite detectar sessão na URL se for web
  },
});