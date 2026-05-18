export async function gerarImagemDaReceita(
  nomeDaReceita: string,
): Promise<string> {
  const promptOtimizado = encodeURIComponent(
    `High-quality professional food photography of ${nomeDaReceita}, gourmet presentation, restaurant style, 4k, delicious, appetizing`,
  );
  const width = 1024;
  const height = 1024;
  const seed = Math.floor(Math.random() * 1000000);
  const model = "flux"; // Pollinations.ai suporta vários modelos, flux é excelente

  const url = `https://pollinations.ai/p/${promptOtimizado}?width=${width}&height=${height}&seed=${seed}&model=${model}&nologo=true`;

  try {
    // O PULO DO GATO PARA DRIBLAR O CORS NO LOCALHOST:
    // Passamos a URL da IA por dentro do proxy allorigins, que injeta o CORS correto.
    const urlComProxy = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;

    const response = await fetch(urlComProxy);

    if (!response.ok) {
      console.warn("[pollinationsService] API error:", response.status);
      return "";
    }

    const blob = await response.blob();

    return await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve((reader.result as string) ?? "");
      reader.onerror = () => {
        console.warn(
          "[pollinationsService] Falha ao converter imagem para Base64.",
        );
        resolve("");
      };
      reader.readAsDataURL(blob);
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn("[pollinationsService]", message);
    return "";
  }
}
