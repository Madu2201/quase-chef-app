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
        password_hash: password, // salvando o texto puro aqui
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
export const uploadAvatar = async (userId: string, imageUri: string) => {
  try {
    // 1. Transformar a imagem em um formato que o Supabase entende (Blob)
    const response = await fetch(imageUri);
    const blob = await response.blob();

    // 2. Definir o nome do arquivo (usamos o ID do usuário para ser único)
    const fileExt = imageUri.split('.').pop(); // Pega a extensão (jpg, png, etc)
    const fileName = `${userId}.${fileExt}`;
    const filePath = `${fileName}`;

    // 3. Fazer o Upload para o bucket 'avatars'
    // O 'upsert: true' faz com que a foto antiga seja substituída se o nome for igual
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, blob, { upsert: true });

    if (uploadError) throw uploadError;

    // 4. Pegar a URL pública da foto recém enviada
    const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
    
    // Adicionado um timestamp para quebrar o cache do celular
    const publicUrl = `${data.publicUrl}?t=${new Date().getTime()}`;

    // 5. Atualizar a coluna avatar_url na tabela 'users'
    const { error: updateError } = await supabase
      .from('users')
      .update({ avatar_url: publicUrl })
      .eq('id', userId);

    if (updateError) throw updateError;

    return publicUrl;
  } catch (error: any) {
    console.error('Erro no uploadAvatar:', error.message);
    throw error;
  }
};
