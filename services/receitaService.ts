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
    const id =
      typeof receitaId === "string" ? parseInt(receitaId, 10) : receitaId;

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
      typeof id === "string" ? parseInt(id, 10) : id,
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

export interface ReceitaIASalvarParams {
  title: string;
  time: string;
  difficulty: string;
  description: string;
  image: string;
  calories: string;
  rawIngredients: string;
  rawSteps: string;
  tags?: string[];
}

export async function salvarReceitaIAParaFavorito(
  userId: string,
  receita: ReceitaIASalvarParams,
) {
  try {
    const ingredientes = JSON.parse(receita.rawIngredients || "[]");
    const passos = JSON.parse(receita.rawSteps || "[]");

    const { data, error } = await supabase
      .from("receitas")
      .insert([
        {
          nome_receita: receita.title,
          tempo_preparo: receita.time,
          dificuldade: receita.difficulty,
          calorias: receita.calories,
          descricao_simples_preparo: receita.description,
          imagem_url: receita.image,
          ingredientes,
          passos_detalhados: passos,
          tags: receita.tags || ["IA"],
          eh_ia: true,
          user_id: userId,
        },
      ])
      .select("id")
      .single();

    if (error || !data) {
      console.error(
        "❌ Erro ao salvar receita IA:",
        error?.message || "Resposta vazia",
      );
      return null;
    }

    const receitaId = data.id;
    const { error: favoritarError } = await supabase
      .from("receitas_favoritas")
      .insert({ user_id: userId, receita_id: receitaId });

    if (favoritarError) {
      console.error("❌ Erro ao favoritar receita IA:", favoritarError.message);
      return null;
    }

    return receitaId;
  } catch (exception) {
    console.error("❌ Exceção ao salvar receita IA:", exception);
    return null;
  }
}

export async function adicionarFavorito(receitaId: number, userId: string) {
  try {
    const { error } = await supabase
      .from("receitas_favoritas")
      .insert({ user_id: userId, receita_id: receitaId });

    if (error) {
      console.error(
        `❌ Erro ao adicionar favorito ${receitaId}:`,
        error.message,
      );
      return false;
    }

    return true;
  } catch (exception) {
    console.error(`❌ Exceção ao adicionar favorito ${receitaId}:`, exception);
    return false;
  }
}

export async function removerFavorito(receitaId: number, userId: string) {
  try {
    const { error } = await supabase
      .from("receitas_favoritas")
      .delete()
      .match({ user_id: userId, receita_id: receitaId });

    if (error) {
      console.error(`❌ Erro ao remover favorito ${receitaId}:`, error.message);
      return false;
    }

    return true;
  } catch (exception) {
    console.error(`❌ Exceção ao remover favorito ${receitaId}:`, exception);
    return false;
  }
}
