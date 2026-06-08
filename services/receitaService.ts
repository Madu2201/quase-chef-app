// Meus imports
import type { ReceitaIASalvarParams } from "../types/receitas";
import { solicitarAtualizacaoCatalogoReceitas } from "./receitaEvents";
import { supabase } from "./supabase";

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

export async function salvarReceitaIAParaFavorito(
  userId: string,
  receita: ReceitaIASalvarParams,
) {
  try {
    const ingredientes = JSON.parse(receita.rawIngredients || "[]");
    const passos = JSON.parse(receita.rawSteps || "[]");
    const titulo = receita.title.trim();
    const payloadPersistencia = {
      nome_receita: titulo,
      tempo_preparo: receita.time,
      dificuldade: receita.difficulty,
      calorias: receita.calories,
      descricao_simples_preparo: receita.description,
      imagem_url: receita.image,
      ingredientes,
      passos_detalhados: passos,
      dica_rapida: receita.dica_rapida,
      pre_visualizacao_passos: receita.pre_visualizacao_passos || [],
      tags: receita.tags || ["IA"],
      eh_ia: true,
      user_id: userId,
      preferencias: receita.preferencias || [],
      alergias_presentes: receita.alergias_presentes || [],
    };

    // Sempre persiste uma nova receita IA. Título não é identidade estável.
    const { data, error } = await supabase
      .from("receitas")
      .insert([payloadPersistencia])
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
      const msg = favoritarError.message ?? "";
      const dup =
        favoritarError.code === "23505" || /duplicate|unique/i.test(msg);
      if (!dup) {
        console.error("❌ Erro ao favoritar receita IA:", msg);
        return null;
      }
    }

    solicitarAtualizacaoCatalogoReceitas();
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
    // 1. Busca a receita para saber se é IA e obter a URL da imagem
    const { data: receita, error: fetchError } = await supabase
      .from("receitas")
      .select("eh_ia, user_id, imagem_url")
      .eq("id", receitaId)
      .single();

    if (fetchError) {
      console.error(
        `❌ Erro ao buscar receita para remover favorito:`,
        fetchError.message,
      );
    }

    // 2. Remove da tabela de favoritos
    const { error } = await supabase
      .from("receitas_favoritas")
      .delete()
      .match({ user_id: userId, receita_id: receitaId });

    if (error) {
      console.error(`❌ Erro ao remover favorito ${receitaId}:`, error.message);
      return false;
    }

    // 3. Se for uma receita gerada por IA deste usuário, exclui a imagem do Storage e depois o registro
    if (receita && receita.eh_ia && receita.user_id === userId) {
      // 3a. Deleta a imagem do Supabase Storage ANTES de deletar o registro
      if (receita.imagem_url) {
        const imagemPath = extrairCaminhoImagemDoStorage(receita.imagem_url);
        if (imagemPath) {
          const { error: deleteImageError } = await supabase.storage
            .from("ai-recipes")
            .remove([imagemPath]);

          if (deleteImageError) {
            console.error(
              `⚠️  Aviso ao deletar imagem do Storage:`,
              deleteImageError.message,
            );
            // Continuamos mesmo com erro de imagem, pois o registro de DB é prioridade
          } else {
            console.log(`✅ Imagem deletada do Storage:`, imagemPath);
          }
        }
      }

      // 3b. Deleta o registro da receita IA da tabela
      const { error: deleteError } = await supabase
        .from("receitas")
        .delete()
        .eq("id", receitaId);

      if (deleteError) {
        console.error(
          `❌ Erro ao excluir registro de receita IA:`,
          deleteError.message,
        );
      } else {
        console.log(`✅ Receita IA excluída do banco:`, receitaId);
      }
    }

    return true;
  } catch (exception) {
    console.error(`❌ Exceção ao remover favorito ${receitaId}:`, exception);
    return false;
  }
}

// Extrai o caminho da imagem da URL publicada receita IA para permitir exclusão do arquivo no Supabase Storage
function extrairCaminhoImagemDoStorage(urlPublica: string): string | null {
  try {
    const match = urlPublica.match(/\/ai-recipes\/(.+)$/);
    if (!match || !match[1]) {
      console.warn("Não foi possível extrair caminho da imagem:", urlPublica);
      return null;
    }
    return match[1];
  } catch (error) {
    console.error("Erro ao extrair caminho da imagem:", error);
    return null;
  }
}

// Torna uma receita publica para que outros usuários possam ver (usado para compartilhar receita IA gerada)
export async function tornarReceitaPublica(
  receitaId: number | string,
): Promise<boolean> {
  try {
    const id =
      typeof receitaId === "string" ? parseInt(receitaId, 10) : receitaId;

    if (!id || Number.isNaN(id)) {
      console.error(
        "❌ ID de receita inválido para compartilhamento:",
        receitaId,
      );
      return false;
    }

    const { error } = await supabase
      .from("receitas")
      .update({ is_public: true })
      .eq("id", id);

    if (error) {
      console.error(`❌ Erro ao tornar receita pública ${id}:`, error.message);
      return false;
    }

    return true;
  } catch (exception) {
    console.error("❌ Exceção ao tornar receita pública:", exception);
    return false;
  }
}