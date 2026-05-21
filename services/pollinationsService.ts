const IMAGE_PROXY_URL = "http://192.168.1.86:3000/generate-image";

export async function gerarImagemDaReceita(
  nomeDaReceita: string,
): Promise<string> {
  try {
    const response = await fetch(IMAGE_PROXY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: `High-quality professional food photography of ${nomeDaReceita}, gourmet presentation, restaurant style, 4k, delicious, appetizing`,
        model: "flux",
        width: 1024,
        height: 1024,
      }),
    });

    if (!response.ok) {
      console.warn(
        "[pollinationsService] Proxy error:",
        response.status,
      );
      return "";
    }

    const data = await response.json();

    if (!data.success) {
      console.warn(
        "[pollinationsService]",
        data.error,
      );
      return "";
    }

    return typeof data.base64 === "string"
      ? data.base64
      : "";

  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : String(error);

    console.warn("[pollinationsService]", message);

    return "";
  }
}
