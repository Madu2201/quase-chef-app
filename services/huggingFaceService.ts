const HF_TOKEN = process.env.EXPO_PUBLIC_HF_TOKEN;
const MODEL_ID = "mrfakename/Z-Image-Turbo";

export async function gerarImagemDaReceita(
  nomeDaReceita: string,
): Promise<string> {
  // Dica de Engenharia de Prompt: Mesmo que o nome venha em PT-BR,
  // colocar essas palavras-chave em inglês no final garante que a IA faça foto de comida e não um desenho.
  const promptOtimizado = `Uma fotografia gastronômica ultra-realista de alta qualidade de um prato de restaurante chamado "${nomeDaReceita}", apresentação sofisticada e apetitosa, comida fresca e detalhada, textura visível e suculenta, servido em prato elegante, composição profissional, iluminação cinematográfica de restaurante (luz quente e suave), sombras naturais, reflexos sutis, fundo desfocado estilo bokeh, perspectiva de cima ou ângulo frontal, foco nítido no prato, profundidade de campo, estilo fotografia profissional, 4K, extremamente detalhado`;

  try {
    const response = await fetch(
      `https://api-inference.huggingface.co/models/${MODEL_ID}`,
      {
        headers: {
          Authorization: `Bearer ${HF_TOKEN}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ inputs: promptOtimizado }),
      },
    );

    if (!response.ok) {
      // O PULO DO GATO: Vamos ler a mensagem de erro que a API mandou!
      const errorText = await response.text();
      console.error("🔴 ERRO REAL DO HUGGING FACE:", errorText);

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
