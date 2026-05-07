const HF_TOKEN = process.env.EXPO_PUBLIC_HF_TOKEN;
const MODEL_ID = "stabilityai/stable-diffusion-xl-base-1.0";

export async function gerarImagemDaReceita(
  nomeDaReceita: string,
): Promise<string> {
  const promptOtimizado = `High-quality professional food photography of ${nomeDaReceita}, gourmet presentation, restaurant style, 4k`;

  try {
    const response = await fetch(
      `https://api-inference.huggingface.co/models/${MODEL_ID}`,
      {
        headers: {
          Authorization: `Bearer ${HF_TOKEN}`,
          "Content-Type": "application/json",
          "x-use-cache": "false", // Força a IA a gerar uma nova
          "x-wait-for-model": "true", // CRUCIAL: Faz o fetch esperar o modelo carregar se estiver em repouso
        },
        method: "POST",
        body: JSON.stringify({ inputs: promptOtimizado }),
      },
    );

    if (response.status === 503) {
      throw new Error(
        "O modelo está carregando, tente novamente em 30 segundos.",
      );
    }

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Erro na API");
    }

    const blob = await response.blob();

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error("Erro ao converter imagem"));
      reader.readAsDataURL(blob);
    });
  } catch (error: any) {
    console.error("🔴 Erro:", error.message);
    throw error;
  }
}
