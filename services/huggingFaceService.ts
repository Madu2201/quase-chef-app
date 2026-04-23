import { InferenceClient } from "@huggingface/inference";

// Lembre-se: EXPO_PUBLIC_ para o lado do cliente
const HF_TOKEN = process.env.EXPO_PUBLIC_HF_TOKEN;
const client = new InferenceClient(HF_TOKEN);

const MODEL_ID = "baidu/ERNIE-Image-Turbo";

export async function gerarImagemDaReceita(nomeDaReceita: string): Promise<string> {
  if (!HF_TOKEN) {
    throw new Error("HF_TOKEN não configurado. Verifique seu arquivo .env");
  }

  const promptOtimizado = `Food photography, professional photo of ${nomeDaReceita}, gourmet presentation, highly detailed, cinematic lighting, 4k, bokeh background, appetizer, restaurant style`;

  try {
    // 1. Chamada do SDK
    const response = await client.textToImage({
      model: MODEL_ID,
      inputs: promptOtimizado,
      parameters: {
        // Reduza de 30 para 20
        num_inference_steps: 20, 
        guidance_scale: 7.5,
      },
    });

    /**
     * O PULO DO GATO:
     * O SDK retorna um Blob. Em vez de confiar apenas no FileReader, 
     * vamos garantir que temos um Blob válido e convertê-lo.
     */
    if (!(response instanceof Blob)) {
      throw new Error("A resposta da IA não é um Blob válido.");
    }

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onloadend = () => {
        const base64data = reader.result as string;
        if (base64data) {
          resolve(base64data);
        } else {
          reject(new Error("Erro ao converter imagem para Base64"));
        }
      };

      reader.onerror = (e) => {
        console.error("Erro no FileReader:", e);
        reject(e);
      };

      // No React Native, é vital garantir que o blob seja lido assim
      reader.readAsDataURL(response);
    });

  } catch (error: any) {
    // Tratamento específico de carregamento do modelo (Erro 503)
    if (error.message?.includes("503") || error.message?.includes("loading")) {
      console.warn("⚠️ O modelo está aquecendo no Hugging Face. Tentando novamente em breve...");
      throw new Error("A IA está se preparando. Tente novamente em 20 segundos.");
    }

    console.error("🔴 Erro Hugging Face:", error.message || error);
    throw error;
  }
}