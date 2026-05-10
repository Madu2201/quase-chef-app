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

    if (!response.ok) {
      const text = await response.text();
      try {
        const parsed = JSON.parse(text) as { error?: string };
        console.warn(
          "[huggingFaceService] API error:",
          parsed?.error ?? response.status,
        );
      } catch {
        console.warn(
          "[huggingFaceService] API returned non-JSON body (status",
          response.status,
          "); skipping image.",
        );
      }
      return "";
    }

    const blob = await response.blob();

    return await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve((reader.result as string) ?? "");
      reader.onerror = () => {
        console.warn("[huggingFaceService] Falha ao converter imagem para Base64.");
        resolve("");
      };
      reader.readAsDataURL(blob);
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn("[huggingFaceService]", message);
    return "";
  }
}
