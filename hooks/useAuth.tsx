import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { loginUser, registerUser } from "../services/authService";

// Define o que o nosso Cérebro de Login vai guardar
interface AuthContextData {
  user: any;
  isLoading: boolean;
  signIn: (email: string, senha: string) => Promise<{ success: boolean; user?: any; error?: string }>;
  signUp: (nome: string, email: string, senha: string) => Promise<{ success: boolean; userId?: string; error?: string }>;
  signOut: () => Promise<void>;
}

// Cria o Cérebro
const AuthContext = createContext<AuthContextData>({} as AuthContextData);

// Cria o Protetor (Provider) que vai abraçar o App
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<any>(null); // O usuário logado de verdade fica AQUI

  // Quando o app abre, ele lê o celular para ver se alguém já estava logado
  useEffect(() => {
    const loadUser = async () => {
      try {
        const userId = await AsyncStorage.getItem('@user_id');
        const fullName = await AsyncStorage.getItem('@user_full_name');
        const email = await AsyncStorage.getItem('@user_email');
        const avatarUrl = await AsyncStorage.getItem('@user_foto');
        if (userId) {
          setUser({ id: userId, full_name: fullName, email, avatar_url: avatarUrl });
        }
      } catch (error) {
        console.error('Erro ao carregar usuário:', error);
      }
    };
    loadUser();
  }, []);

  const signUp = async (nome: string, email: string, senha: string) => {
    setIsLoading(true);
    try {
      const userId = await registerUser(nome, email, senha);
      return { success: true, userId };
    } catch (error: any) {
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, senha: string) => {
    setIsLoading(true);
    try {
      const user = await loginUser(email, senha);
      setUser(user); // Grava o usuário para o App inteiro ver!
      await AsyncStorage.setItem('@user_id', user.id);
      await AsyncStorage.setItem('@user_full_name', user.full_name || '');
      await AsyncStorage.setItem('@user_foto', user.avatar_url || '');
      await AsyncStorage.setItem('@user_email', user.email || '');
      return { success: true, user };
    } catch (error: any) {
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      await AsyncStorage.multiRemove(['@user_id', '@user_full_name', '@user_foto', '@user_email']);
      setUser(null); // Apaga do App inteiro
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

// O Hook que as outras telas vão usar
export const useAuth = () => useContext(AuthContext);