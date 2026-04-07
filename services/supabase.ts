import { createClient } from "@supabase/supabase-js";

// Essas chaves são strings, o TS vai inferir isso automaticamente
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || "";
// DEBUG TEMPORÁRIO (adição DudaR):
// Como estava dando erro no Supabase (URL não reconhecida),
// incluí esse console.log pra validar se o .env está sendo lido pelo Expo.
// Remover depois que estiver tudo ok.
console.log("ENV TEST:", process.env.EXPO_PUBLIC_SUPABASE_URL);

// Criamos a instância do cliente
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
