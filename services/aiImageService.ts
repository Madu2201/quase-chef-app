/**
 * Serviço de geração de imagens por IA (Mock)
 * Este arquivo centraliza a lógica de geração de imagens para as receitas.
 */

/**
 * Gera uma imagem para a receita baseada em um prompt.
 * Por enquanto, retorna um placeholder estático para não quebrar a UI.
 * 
 * @param prompt O nome ou descrição da receita para gerar a imagem
 * @returns Promise que resolve com a URL da imagem ou null
 */
export async function generateRecipeImage(prompt: string): Promise<string | null> {
  console.log(`[aiImageService] Mock: Gerando imagem para: "${prompt}"`);
  
  // Simulando um pequeno delay de rede
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Retorna uma imagem genérica de comida (Unsplash é ótimo para placeholders)
  // Usamos um parâmetro aleatório para evitar cache e simular uma nova imagem
  const randomId = Math.floor(Math.random() * 1000);
  return `https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1000&auto=format&fit=crop&sig=${randomId}`;
}
