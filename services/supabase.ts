import { createClient } from "@supabase/supabase-js";
import { decode } from "base64-arraybuffer"; // Você precisará instalar esta lib ou usar uma alternativa

// Essas chaves são strings, o TS vai inferir isso automaticamente
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || "";

// Criamos a instância do cliente
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
