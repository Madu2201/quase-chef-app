const HF_TOKEN = process.env.EXPO_PUBLIC_HF_TOKEN;
const MODEL_ID = "black-forest-labs/FLUX.1-schnell";

export async function gerarImagemDaReceita(
  nomeDaReceita: string,
): Promise<string> {
  // Dica de Engenharia de Prompt: Mesmo que o nome venha em PT-BR,
  // colocar essas palavras-chave em inglês no final garante que a IA faça foto de comida e não um desenho.
  const promptOtimizado = `uma deliciosa comida de restaurante: ${nomeDaReceita}, foto de comida realista,perspectiva de cima ou de frente, 4k, com luzes de restaurante, iluminação perfeita.`;

  try {
    const response = await fetch(
      `https://router.huggingface.co/hf-inference/models/${MODEL_ID}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${HF_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs: promptOtimizado }),
      },
    );

    if (!response.ok) {
      throw new Error("Erro na API do Hugging Face");
    }

    // No React Native, pegamos a resposta como Blob (arquivo binário)
    const blob = await response.blob();

    // Convertemos o Blob para Base64 para poder mostrar na tela ou enviar pro Supabase
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string); // Retorna a string Base64 (data:image/jpeg;base64,...)
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Erro ao gerar imagem:", error);
    throw error;
  }
}
