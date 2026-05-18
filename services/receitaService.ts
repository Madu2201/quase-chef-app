import { solicitarAtualizacaoCatalogoReceitas } from "./receitaEvents";
import { supabase } from "./supabase";

/**
 * Nota: filtros de perfil (preferências em união, alergias em blacklist, modos temporários)
 * aplicam-se no cliente via `utils/perfilReceitasFilter.ts` e `useReceitas.filtrarPorPerfil`
 * (alergias sempre; preferências conforme modo temporário).
 * As queries aqui retornam o catálogo completo; não há filtro SQL por array de preferências.
 */

// ============================================
// FUNÇÕES DE STORAGE
// ============================================

/**
 * Upload de imagem da receita para o bucket 'receitas_ia'
 */
async function uploadReceitaImagem(
  userId: string,
  titulo: string,
  base64Data: string,
) {
  try {
    // Se não for base64 (já for uma URL), retorna ela mesma
    if (!base64Data || !base64Data.startsWith("data:image")) return base64Data;

    const base64Content = base64Data.split(",")[1];
    const contentType = base64Data.split(";")[0].split(":")[1];
    const fileExt = contentType.split("/")[1] || "png";

    // Nome do arquivo: userId/timestamp-titulo.ext
    const fileName = `${userId}/${Date.now()}-${titulo.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.${fileExt}`;

    // Converte base64 para Uint8Array (compatível com o upload do Supabase)
    const binaryString = atob(base64Content);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    const { error: uploadError } = await supabase.storage
      .from("receitas_ia")
      .upload(fileName, bytes, {
        contentType,
        upsert: true,
      });

    if (uploadError) {
      console.error("❌ Erro no upload do Supabase:", uploadError.message);
      throw uploadError;
    }

    const { data } = supabase.storage
      .from("receitas_ia")
      .getPublicUrl(fileName);
    return data.publicUrl;
  } catch (error) {
    console.error("❌ Erro ao fazer upload da imagem da receita:", error);
    return base64Data; // Fallback para base64 se falhar
  }
}

/**
 * Exclui a imagem do bucket 'receitas_ia' a partir da URL pública
 */
async function excluirImagemDoBucket(url: string) {
  try {
    if (!url || !url.includes("receitas_ia")) return;

    // Extrai o caminho do arquivo da URL
    // Ex: https://.../storage/v1/object/public/receitas_ia/USER_ID/FILE_NAME.png
    const parts = url.split("receitas_ia/");
    if (parts.length < 2) return;

    const filePath = parts[1].split("?")[0]; // Remove query params se houver

    const { error } = await supabase.storage
      .from("receitas_ia")
      .remove([filePath]);

    if (error) {
      console.error("❌ Erro ao excluir imagem do bucket:", error.message);
    } else {
      console.log("✅ Imagem excluída do bucket:", filePath);
    }
  } catch (error) {
    console.error("❌ Exceção ao excluir imagem do bucket:", error);
  }
}

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
  dica_rapida?: string;
  pre_visualizacao_passos?: string[];
  preferencias?: string[];
  alergias_presentes?: string[];
}

export async function salvarReceitaIAParaFavorito(
  userId: string,
  receita: ReceitaIASalvarParams,
) {
  try {
    const ingredientes = JSON.parse(receita.rawIngredients || "[]");
    const passos = JSON.parse(receita.rawSteps || "[]");
    const titulo = receita.title.trim();

    const { data: existentes } = await supabase
      .from("receitas")
      .select("id")
      .eq("user_id", userId)
      .eq("eh_ia", true)
      .eq("nome_receita", titulo)
      .limit(1);

    let receitaId: number;

    const idExistente = existentes?.[0]?.id;
    if (idExistente != null) {
      receitaId = Number(idExistente);
    } else {
      // 1. Faz upload da imagem para o bucket do Supabase
      const publicUrl = await uploadReceitaImagem(
        userId,
        titulo,
        receita.image,
      );

      // 2. Insere a receita com a URL do bucket
      const { data, error } = await supabase
        .from("receitas")
        .insert([
          {
            nome_receita: titulo,
            tempo_preparo: receita.time,
            dificuldade: receita.difficulty,
            calorias: receita.calories,
            descricao_simples_preparo: receita.description,
            imagem_url: publicUrl,
            ingredientes,
            passos_detalhados: passos,
            dica_rapida: receita.dica_rapida,
            pre_visualizacao_passos: receita.pre_visualizacao_passos,
            tags: receita.tags || ["IA"],
            eh_ia: true,
            user_id: userId,
            preferencias: receita.preferencias || [],
            alergias_presentes: receita.alergias_presentes || [],
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

      receitaId = data.id;
    }

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
    // 1. Busca a receita para saber se é IA e pegar a URL da imagem
    const { data: receita, error: fetchError } = await supabase
      .from("receitas")
      .select("eh_ia, imagem_url, user_id")
      .eq("id", receitaId)
      .single();

    if (fetchError) {
      console.error(`❌ Erro ao buscar receita para remover favorito:`, fetchError.message);
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

    // 3. Se for uma receita gerada por IA deste usuário, exclui a imagem e o registro da receita
    if (receita && receita.eh_ia && receita.user_id === userId) {
      // Exclui a imagem do bucket
      if (receita.imagem_url) {
        await excluirImagemDoBucket(receita.imagem_url);
      }

      // Exclui o registro da receita (opcional, mas recomendado para não poluir o banco)
      const { error: deleteError } = await supabase
        .from("receitas")
        .delete()
        .eq("id", receitaId);

      if (deleteError) {
        console.error(`❌ Erro ao excluir registro de receita IA:`, deleteError.message);
      }
    }

    return true;
  } catch (exception) {
    console.error(`❌ Exceção ao remover favorito ${receitaId}:`, exception);
    return false;
  }
}
