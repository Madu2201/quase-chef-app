import { useState } from "react";
import { registerUser, loginUser } from "../services/authService";
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  //-- Função de Cadastro --//
  const signUp = async (
    nome: string,
    email: string,
    telefone: string,
    senha: string,
  ) => {
    setIsLoading(true);
    try {
      const userId = await registerUser(nome, email, telefone, senha);
      return { success: true, userId };
    } catch (error: any) {
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };
  //-- Função de Login --//
  const signIn = async (email: string, senha: string) => {
    setIsLoading(true);
    try {
      const user = await loginUser(email, senha);
      setUser(user); // Armazena o usuário logado no estado
      await AsyncStorage.setItem('@user_name', user.full_name);
      return { success: true, user };
    } catch (error: any) {
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  return { signUp, signIn, user, isLoading };
};
