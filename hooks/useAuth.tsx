import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { loginUser, registerUser } from "../services/authService";
// Importe os tipos que criamos
import { UserData, AuthResponse } from "../types/auth";

interface AuthContextData {
  user: UserData | null; // Tipado corretamente
  isLoading: boolean;
  signIn: (email: string, senha: string) => Promise<AuthResponse>;
  signUp: (nome: string, email: string, senha: string) => Promise<{ success: boolean; userId?: string; error?: string }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const [id, name, email, avatar] = await Promise.all([
          AsyncStorage.getItem('@user_id'),
          AsyncStorage.getItem('@user_full_name'),
          AsyncStorage.getItem('@user_email'),
          AsyncStorage.getItem('@user_foto'),
        ]);

        if (id) {
          setUser({ id, full_name: name, email, avatar_url: avatar });
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

  const signIn = async (email: string, senha: string): Promise<AuthResponse> => {
    setIsLoading(true);
    try {
      const userData = await loginUser(email, senha);

      // Persistência
      await AsyncStorage.setItem('@user_id', userData.id);
      await AsyncStorage.setItem('@user_full_name', userData.full_name || '');
      await AsyncStorage.setItem('@user_foto', userData.avatar_url || '');
      await AsyncStorage.setItem('@user_email', userData.email || '');

      setUser(userData);
      return { success: true, user: userData };
    } catch (error: any) {
      return { success: false, error: error.message || "Erro ao realizar login" };
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      await AsyncStorage.multiRemove(['@user_id', '@user_full_name', '@user_foto', '@user_email']);
      setUser(null);
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

export const useAuth = () => useContext(AuthContext);