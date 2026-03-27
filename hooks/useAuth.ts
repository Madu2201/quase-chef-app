import { useState } from 'react';
import { registerUser } from '../services/authService';

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);

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

  return { signUp, isLoading };
};