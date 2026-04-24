import { supabase } from "./supabase";

// ============================================
// FUNÇÕES DE BUSCA SEGURAS
// ============================================

/**
 * Busca uma receita completa no banco de dados pelo ID
 * @param receitaId - ID da receita a buscar
 * @returns Dados completos da receita ou null
 */
export async function buscarReceitaPorId(receitaId: number | string) {
  try {
    const id = typeof receitaId === "string" ? parseInt(receitaId, 10) : receitaId;

    const { data, error } = await supabase
      .from("receitas")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error(`❌ Erro ao buscar receita com ID ${id}:`, error.message);
      return null;
    }

    return data;
  } catch (exception) {
    console.error(`❌ Exceção ao buscar receita por ID:`, exception);
    return null;
  }
}

/**
 * Busca múltiplas receitas pelo array de IDs
 * @param ids - Array de IDs das receitas
 * @returns Array de receitas encontradas
 */
export async function buscarReceitasPorIds(ids: (number | string)[]) {
  try {
    const numIds = ids.map((id) =>
      typeof id === "string" ? parseInt(id, 10) : id
    );

    const { data, error } = await supabase
      .from("receitas")
      .select("*")
      .in("id", numIds);

    if (error) {
      console.error(`❌ Erro ao buscar receitas com IDs:`, error.message);
      return [];
    }

    return data || [];
  } catch (exception) {
    console.error(`❌ Exceção ao buscar receitas por IDs:`, exception);
    return [];
  }
}
