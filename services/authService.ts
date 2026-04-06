import { supabase } from "@/services/supabase";
import * as FileSystem from "expo-file-system/legacy";
import { File } from "expo-file-system";

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
export const uploadAvatar = async (
  userId: string,
  nome: string,
  imageUri: string,
) => {
  try {
    // 1. Cria o arquivo a partir da URI
    const file = new File(imageUri);

    // 2. Lê como base64
    const base64 = await FileSystem.readAsStringAsync(imageUri, {
      encoding: "base64",
    });

    const fileExt = imageUri.split(".").pop() || "jpg";
    const nomeLimpo = nome.trim().replace(/\//g, "");
    const filePath = `${userId}/${nomeLimpo} - perfil.${fileExt}`;

    // 3. Converte base64 → ArrayBuffer
    const arrayBuffer = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));

    // 4. Upload
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, arrayBuffer, {
        contentType: `image/${fileExt}`,
        upsert: true,
      });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
    const publicUrl = `${data.publicUrl}?t=${new Date().getTime()}`;

    await supabase
      .from("users")
      .update({ avatar_url: publicUrl })
      .eq("id", userId);

    return publicUrl;
  } catch (error: any) {
    console.error("Erro no uploadAvatar:", error.message);
    throw error;
  }
};
//Editar Perfil
export const updateUserProfile = async (
  userId: string,
  novoNome: string,
  novoEmail: string,
) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .update({
        full_name: novoNome,
        email: novoEmail,
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
