import { decode } from "base64-arraybuffer";

// Meu import
import { STORAGE_BUCKETS } from "../constants/database";
import { supabase } from "./supabase";

/**
 * Gera uma imagem da receita via Cloudflare AI e faz upload para o Supabase Storage
 * @param imagePrompt Prompt em inglês descrevendo a receita (gerado pelo Gemini)
 * @param recipeId ID único da receita (ex: "ia-1234567890")
 * @returns URL pública da imagem no Supabase ou null se falhar
 */
export async function generateAndUploadRecipeImage(
  imagePrompt: string,
  recipeId: string,
): Promise<string | null> {
  try {
    // 1. Valida o prompt
    if (!imagePrompt || typeof imagePrompt !== "string") {
      console.warn("imagePrompt inválido:", imagePrompt);
      return null;
    }

    const cleaned = imagePrompt.replace(/"/g, "").trim();
    if (!cleaned) {
      console.warn("imagePrompt vazio após limpeza");
      return null;
    }

    // 2. Pega as variáveis de ambiente do Cloudflare
    const cfAccountId = process.env.EXPO_PUBLIC_CLOUDFLARE_ACCOUNT_ID;
    const cfApiToken = process.env.EXPO_PUBLIC_CLOUDFLARE_API_TOKEN;

    if (!cfAccountId || !cfApiToken) {
      console.warn(
        "Variáveis de ambiente Cloudflare não configuradas. Verifique EXPO_PUBLIC_CLOUDFLARE_ACCOUNT_ID e EXPO_PUBLIC_CLOUDFLARE_API_TOKEN",
      );
      return null;
    }

    // 3. Faz requisição para gerar imagem na API do Cloudflare
    const cfUrl = `https://api.cloudflare.com/client/v4/accounts/${cfAccountId}/ai/run/@cf/black-forest-labs/flux-1-schnell`;

    const cfResponse = await fetch(cfUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${cfApiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: cleaned,
      }),
    });

    if (!cfResponse.ok) {
      const errorText = await cfResponse.text();
      console.error("Erro na API Cloudflare:", cfResponse.status, errorText);
      return null;
    }

    const jsonResult = await cfResponse.json();

    // 4. Extrai o Base64 da resposta
    const base64Image = jsonResult.result?.image;
    if (!base64Image) {
      console.warn("Resposta Cloudflare sem imagem Base64:", jsonResult);
      return null;
    }

    // 5. Converte Base64 para Uint8Array (compatível com React Native)
    const imageBuffer = decode(base64Image);

    // 6. Prepara o path no Supabase Storage
    const fileName = `${recipeId}-${Date.now()}.jpg`;
    const bucketPath = `ai-recipes/${fileName}`;

    // 7. Faz upload para o Supabase Storage
    const { data: uploadedData, error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKETS.ai_recipes)
      .upload(bucketPath, imageBuffer, {
        contentType: "image/jpeg",
        upsert: false,
      });

    if (uploadError) {
      console.error("Erro ao fazer upload para Supabase:", uploadError);
      return null;
    }

    // 8. Pega a URL pública da imagem
    const { data: publicUrlData } = supabase.storage
      .from(STORAGE_BUCKETS.ai_recipes)
      .getPublicUrl(bucketPath);

    if (!publicUrlData || !publicUrlData.publicUrl) {
      console.warn("Não foi possível gerar URL pública da imagem");
      return null;
    }

    console.log("Imagem gerada e uploadada com sucesso:", publicUrlData.publicUrl);
    return publicUrlData.publicUrl;
  } catch (error) {
    console.error("Erro em generateAndUploadRecipeImage:", error);
    return null;
  }
}