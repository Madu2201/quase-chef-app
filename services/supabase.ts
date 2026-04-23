import { createClient } from "@supabase/supabase-js";
import { decode } from "base64-arraybuffer"; // Você precisará instalar esta lib ou usar uma alternativa

// Essas chaves são strings, o TS vai inferir isso automaticamente
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || "";

// Criamos a instância do cliente
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Faz o upload de uma imagem em base64 para o bucket 'receitas_ia'
 */
export async function uploadImagemReceitaIA(base64Data: string, fileName: string) {
  try {
    // Remove o prefixo data:image/jpeg;base64, se existir
    const base64 = base64Data.includes("base64,")
      ? base64Data.split("base64,")[1]
      : base64Data;

    const { data, error } = await supabase.storage
      .from("receitas_ia")
      .upload(`public/${fileName}.jpg`, decode(base64), {
        contentType: "image/jpeg",
        upsert: true,
      });

    if (error) throw error;

    // Retorna a URL pública
    const { data: publicUrlData } = supabase.storage
      .from("receitas_ia")
      .getPublicUrl(data.path);

    return publicUrlData.publicUrl;
  } catch (error) {
    console.error("Erro ao fazer upload da imagem:", error);
    return null;
  }
}
