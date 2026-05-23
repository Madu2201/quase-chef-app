/**
 * Serviço de geração de imagens por IA via Pollinations
 * Constrói URLs para renderização de imagens de receitas
 */

/**
 * Construir URL do Pollinations.ai para renderizar imagem
 * Esta função é SÍNCRONA: apenas monta a URL, não faz requisições
 *
 * @param imagePrompt Prompt em inglês descrevendo a receita (gerado pelo Gemini)
 * @returns URL completa pronta para renderizar em <Image /> ou null se o prompt for inválido
 */
export function buildPollinationsImageUrl(
  imagePrompt?: string | null,
): string | null {
  if (typeof imagePrompt !== "string") return null;

  // 1. Remove aspas extras do prompt
  const cleaned = imagePrompt.replace(/"/g, "").trim();
  if (!cleaned) return null;

  // 2. Codifica para URL-safe
  const encoded = encodeURIComponent(cleaned);

  // 3. Adiciona seed aleatório para evitar cache excessivo
  const seed = Math.random();

  // 4. Retorna URL final do Pollinations.ai
  return `https://image.pollinations.ai/p/${encoded}?width=1024&height=1024&model=flux&nologo=true&seed=${seed}`;
}
