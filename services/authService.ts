import { supabase } from "@/services/supabase";

// 1. Cadastro Simples
export const registerUser = async (
  fullName: string,
  email: string,
  phone: string,
  password: string,
) => {
  // Inserimos direto na tabela sem passar pela RPC que hasha
  const { data, error } = await supabase
    .from("users")
    .insert([
      {
        full_name: fullName,
        email: email,
        phone: phone,
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
