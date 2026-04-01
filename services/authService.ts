import { supabase } from "@/services/supabase";

// 1. Cadastro Simples
export const registerUser = async (
  fullName: string,
  email: string,
  password: string,
) => {
  // Inserimos direto na tabela sem passar pela RPC que hasha
  const { data, error } = await supabase
    .from("users")
    .insert([
      {
        full_name: fullName,
        email: email,
        password_hash: password,
      },
    ])
    .select("id")
    .single();

  if (error) {
    console.error("Erro ao Cadastrar:", error.message);
    throw new Error("Falha ao criar conta.");
  }

  return data.id;
};

// 2. Login Simples
export const loginUser = async (email: string, senha: string) => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .eq("password_hash", senha) // Comparação direta de texto
    .maybeSingle();

  if (error || !data) {
    throw new Error("E-mail ou senha incorretos.");
  }

  return data;
};
//upload de fotos
// Adicione o parâmetro 'nome' na função
export const uploadAvatar = async (
  userId: string,
  nome: string,
  imageUri: string,
) => {
  try {
    // 1. Pega a imagem real
    const response = await fetch(imageUri);
    const blob = await response.blob();

    // 2. Descobre a extensão real do arquivo (ex: 'image/jpeg' vira 'jpeg')
    const mimeType = blob.type || "image/jpeg";
    const fileExt = mimeType.split("/") || "jpg";

    // 3. Formata o nome para evitar bugs (tira barras caso o usuário digite no nome)
    const nomeLimpo = nome.trim().replace(/\//g, "");

    // 4. Monta o caminho exato que você pediu:
    // Pasta: userId
    // Arquivo: Nome - perfil.extensao
    const filePath = `${userId}/${nomeLimpo} - perfil.${fileExt}`;

    // 5. Upload com upsert (se ele já tiver uma foto com esse nome, substitui)
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, blob, { upsert: true });

    if (uploadError) throw uploadError;

    // 6. Pega a URL pública e quebra o cache do celular
    const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
    const publicUrl = `${data.publicUrl}?t=${new Date().getTime()}`;

    // 7. Atualiza o banco
    const { error: updateError } = await supabase
      .from("users")
      .update({ avatar_url: publicUrl })
      .eq("id", userId);

    if (updateError) throw updateError;

    return publicUrl;
  } catch (error: any) {
    console.error("Erro no uploadAvatar:", error.message);
    throw error;
  }
};
//Editar Perfil
export const updateUserProfile = async (userId: string, novoNome: string, novoEmail: string) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .update({ 
        full_name: novoNome, 
        email: novoEmail 
      })
      .eq("id", userId)
      .select() // Pede pro Supabase devolver a linha atualizada
      .single();

    if (error) throw error;

    return data; // Retorna os dados novos
  } catch (error: any) {
    console.error("Erro ao atualizar perfil:", error.message);
    throw new Error("Não foi possível atualizar os dados.");
  }
};