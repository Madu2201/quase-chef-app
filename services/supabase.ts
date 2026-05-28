import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import { Platform } from "react-native";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || "";

if (!supabaseUrl) {
  throw new Error("EXPO_PUBLIC_SUPABASE_URL não foi encontrada no .env");
}

if (!supabaseAnonKey) {
  throw new Error("EXPO_PUBLIC_SUPABASE_ANON_KEY não foi encontrada no .env");
}

const authConfig =
  Platform.OS === "web"
    ? {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      }
    : {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      };

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: authConfig,
});
