import { supabase } from "@/services/supabase";
import * as FileSystem from "expo-file-system/legacy";

// 1. Cadastro Seguro e Real
export const registerUser = async (
  fullName: string,
  email: string,
  password: string,
  foodPreferences: string[] = [],
  allergies: string[] = [],
  otherRestrictions: string = "",
) => {
  // A) Normaliza email e cria o usuário na autenticação oficial do Supabase
  const normalizedEmail = email.trim().toLowerCase();
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: normalizedEmail,
    password,
    options: {
      data: {
        full_name: fullName, // Salva no metadata para emergências
      }
    }
  });

if (authError) {
    // Só exibe erro no console se não for o erro de e-mail duplicado (que já tratamos)
    if (!authError.message.includes("already registered")) {
      console.error("Erro no Auth do Supabase:", authError.message);
    }
    throw new Error(authError.message);
  }

  if (!authData.user) {
    throw new Error("Não foi possível criar as credenciais de segurança.");
  }

  // B) Vincula os dados extras na sua tabela pública 'users' usando o ID oficial
  const { error: dbError } = await supabase
    .from("users")
    .insert([
      {
        id: authData.user.id, // O PULP DO GATO: Usa o ID gerado pelo sistema de autenticação real
        full_name: fullName,
        email: normalizedEmail,
        password_hash: "PROTEGIDO_PELO_SUPABASE_AUTH", // Apenas para não quebrar colunas antigas NotNull se houver
        food_preferences: foodPreferences,
        allergies: allergies,
        other_restrictions: otherRestrictions,
      },
    ]);

  if (dbError) {
    console.error("Erro ao salvar dados complementares no banco:", dbError.message);
    throw new Error("Usuário criado, mas houve um erro ao salvar o perfil.");
  }

  return authData.user.id;
};

// 2. Login Seguro e Real
export const loginUser = async (email: string, senha: string) => {
  // A) Normaliza email e faz a verificação criptografada no Supabase Auth
  const normalizedEmail = email.trim().toLowerCase();
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: normalizedEmail,
    password: senha,
  });

  if (authError) {
    console.error("Erro no Login Auth:", authError.message);
    throw new Error("E-mail ou senha incorretos.");
  }

  // B) Busca os dados customizados (dispensa, preferências) na tabela pública usando o ID autenticado
  const { data: profileData, error: dbError } = await supabase
    .from("users")
    .select("*")
    .eq("id", authData.user.id)
    .maybeSingle();

  if (dbError || !profileData) {
    // Fallback de segurança caso a tabela pública falhe: retorna o básico do Auth
    return {
      id: authData.user.id,
      email: authData.user.email,
      full_name: authData.user.user_metadata?.full_name || "",
      avatar_url: authData.user.user_metadata?.avatar_url || "",
      food_preferences: [],
      allergies: [],
      other_restrictions: ""
    };
  }

  return profileData;
};

// 3. Upload de fotos (Mantido intacto, agora funcionando perfeitamente com IDs reais)
export const uploadAvatar = async (
  userId: string,
  nome: string,
  imageUri: string,
) => {
  try {

    const base64 = await FileSystem.readAsStringAsync(imageUri, {
      encoding: "base64",
    });

    const fileExt = imageUri.split(".").pop() || "jpg";
    const nomeLimpo = nome.trim().replace(/\//g, "");
    const filePath = `${userId}/${nomeLimpo} - perfil.${fileExt}`;

    const arrayBuffer = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));

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

// 4. Editar Perfil (Mantido intacto)
export const updateUserProfile = async (
  userId: string,
  novoNome: string,
  novoEmail: string,
  foodPreferences?: string[],
  allergies?: string[],
  otherRestrictions?: string,
) => {
  try {
    const updateData: any = {
      full_name: novoNome,
      email: novoEmail,
    };

    if (foodPreferences) updateData.food_preferences = foodPreferences;
    if (allergies) updateData.allergies = allergies;
    if (otherRestrictions !== undefined)
      updateData.other_restrictions = otherRestrictions;

    const { data, error } = await supabase
      .from("users")
      .update(updateData)
      .eq("id", userId)
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (error: any) {
    console.error("Erro ao atualizar perfil:", error.message);
    throw new Error("Não foi possível atualizar os dados.");
  }
};