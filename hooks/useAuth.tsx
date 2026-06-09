import { supabase } from "@/services/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, ReactNode, useContext, useEffect, useRef, useState } from "react";

// Meus imports
import { AUTH_DEFAULTS, AUTH_EVENTS, AUTH_STORAGE_KEYS } from "../constants/auth";
import { DATABASE_TABLES } from "../constants/database";
import { MESSAGES } from "../constants/messages";
import { loginUser, registerUser } from "../services/authService";
import type { AuthContextData, AuthResponse, UserData } from "../types/auth";
import { TemporaryMode } from "../types/perfil";
import { useNetworkStatus } from "./useNetworkStatus";

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

// 1. Carrega o cache local rápido para a abertura do app
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<UserData | null>(null);
  const userRef = useRef(user);
  const { notifyInternetRequired } = useNetworkStatus();

  useEffect(() => {
    userRef.current = user;
  }, [user]);

  useEffect(() => {
    const parseArrayString = (value: string | null): string[] => {
      if (!value) return [];
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed.filter(Boolean).map((item) => String(item)) : [];
      } catch {
        return [];
      }
    };

    const loadUser = async () => {
      try {
        const [id, name, email, avatar, foodPreferences, allergies, temporaryMode] = await Promise.all([
          AsyncStorage.getItem(AUTH_STORAGE_KEYS.user_id),
          AsyncStorage.getItem(AUTH_STORAGE_KEYS.user_full_name),
          AsyncStorage.getItem(AUTH_STORAGE_KEYS.user_email),
          AsyncStorage.getItem(AUTH_STORAGE_KEYS.user_foto),
          AsyncStorage.getItem(AUTH_STORAGE_KEYS.user_food_preferences),
          AsyncStorage.getItem(AUTH_STORAGE_KEYS.user_allergies),
          AsyncStorage.getItem(AUTH_STORAGE_KEYS.user_temporary_mode),
        ]);

        if (id) {
          setUser({
            id,
            full_name: name,
            email,
            avatar_url: avatar,
            food_preferences: parseArrayString(foodPreferences),
            allergies: parseArrayString(allergies),
            temporaryMode: temporaryMode as TemporaryMode | undefined,
          });
        }
      } catch (error) {
        console.error("Erro ao carregar usuário local:", error);
      }
    };

    loadUser();

    // 2. O SENTINELA: Monitora e sincroniza a sessão real do Supabase
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {

        if (event === "SIGNED_IN" || event === "INITIAL_SESSION" || event === "TOKEN_REFRESHED") {
          setIsLoading(true);
        }

        if (event === AUTH_EVENTS.USER_UPDATED) {
          const currentUser = userRef.current;
          if (session?.user?.email && currentUser && currentUser.email !== session.user.email) {
            // Atualizar apenas o email se mudou de outro dispositivo
            const updatedUser = { ...currentUser, email: session.user.email };
            setUser(updatedUser);
            await AsyncStorage.setItem(AUTH_STORAGE_KEYS.user_email, session.user.email);
          }
          return;
        }

        if (session?.user) {
          try {
            const userId = session.user.id;
            const userEmail = session.user.email || "";

            const { data: dbProfile, error: dbError } = await supabase
              .from(DATABASE_TABLES.users)
              .select("*")
              .eq("id", userId)
              .maybeSingle();

            if (dbError) throw dbError;

            const completeUser: UserData = {
              id: userId,
              email: userEmail,
              full_name: dbProfile?.full_name || session.user.user_metadata?.full_name || "",
              avatar_url: dbProfile?.avatar_url || session.user.user_metadata?.avatar_url || "",
              food_preferences: dbProfile?.food_preferences || [],
              allergies: dbProfile?.allergies || [],
            };

            setUser(completeUser);

            // Salva tudo mastigado no AsyncStorage
            await AsyncStorage.multiSet([
              [AUTH_STORAGE_KEYS.user_id, userId],
              [AUTH_STORAGE_KEYS.user_email, userEmail],
              [AUTH_STORAGE_KEYS.user_full_name, completeUser.full_name || ""],
              [AUTH_STORAGE_KEYS.user_foto, completeUser.avatar_url || ""],
              [AUTH_STORAGE_KEYS.user_food_preferences, JSON.stringify(completeUser.food_preferences)],
              [AUTH_STORAGE_KEYS.user_allergies, JSON.stringify(completeUser.allergies)],
            ]);
          } catch (error) {
            console.error("Erro no sentinela de auth:", error);
          } finally {
            setIsLoading(false);
          }
        } else if (event === AUTH_EVENTS.SIGNED_OUT) {
          setUser(null);
          await AsyncStorage.multiRemove([
            AUTH_STORAGE_KEYS.user_id,
            AUTH_STORAGE_KEYS.user_email,
            AUTH_STORAGE_KEYS.user_full_name,
            AUTH_STORAGE_KEYS.user_foto,
            AUTH_STORAGE_KEYS.user_food_preferences,
            AUTH_STORAGE_KEYS.user_allergies,
            AUTH_STORAGE_KEYS.user_temporary_mode,
          ]);
          setIsLoading(false);
        } else {
          setIsLoading(false);
        }
      },
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // 3. Funções de autenticação
  const signUp = async (
    nome: string,
    email: string,
    senha: string,
    foodPreferences: string[] = [],
    allergies: string[] = [],
    otherRestrictions: string = "",
  ) => {
    if (!notifyInternetRequired(MESSAGES.OFFLINE_CREATE_ACCOUNT)) {
      return {
        success: false,
        error: MESSAGES.OFFLINE_CREATE_ACCOUNT,
      };
    }

    setIsLoading(true);
    try {
      const userId = await registerUser(nome, email, senha, foodPreferences, allergies, otherRestrictions);
      return { success: true, userId };
    } catch (error: any) {
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, senha: string): Promise<AuthResponse> => {
    if (!notifyInternetRequired(MESSAGES.OFFLINE_LOGIN)) {
      return {
        success: false,
        error: MESSAGES.OFFLINE_LOGIN,
      };
    }

    setIsLoading(true);
    try {
      const userData = await loginUser(email, senha);
      const modoSalvo = await AsyncStorage.getItem(AUTH_STORAGE_KEYS.user_temporary_mode);

      const mergedUser: UserData = {
        ...userData,
        temporaryMode: (modoSalvo as TemporaryMode | undefined) ?? undefined,
      };

      setUser(mergedUser);
      return { success: true, user: mergedUser };
    } catch (error: any) {
      return { success: false, error: error.message || "Erro ao realizar login" };
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      // 1. Tenta encerrar a sessão no servidor do Supabase de forma educada
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Erro na API do Supabase ao sair (ignorado para forçar limpeza local):", error);
    } finally {
      // 2. OBRIGA A LIMPEZA LOCAL (mesmo se o passo 1 falhou por falta de internet)
      try {
        // Puxa o nome de absolutamente tudo que está salvo no storage do celular
        const allKeys = await AsyncStorage.getAllKeys();

        const keysToNuke = allKeys.filter(
          (key) => key.startsWith("@user_") || key.startsWith(AUTH_DEFAULTS.sb_prefix) || key.includes(AUTH_DEFAULTS.supabase_prefix)
        );

        if (keysToNuke.length > 0) {
          await AsyncStorage.multiRemove(keysToNuke);
        }
      } catch (cleanupError) {
        console.error("Erro ao varrer e limpar o AsyncStorage:", cleanupError);
      }

      // 3. Reseta o estado e manda pra tela de login
      setUser(null);
      setIsLoading(false);
    }
  };

  // 4. Funções de atualização de usuário, expostas para as telas de perfil
  const updateUser = (nextUser: UserData | null) => {
    setUser(nextUser);
    if (nextUser) {
      AsyncStorage.multiSet([
        ["@user_id", nextUser.id],
        ["@user_full_name", nextUser.full_name || ""],
        ["@user_email", nextUser.email || ""],
        ["@user_foto", nextUser.avatar_url || ""],
        ["@user_food_preferences", JSON.stringify(nextUser.food_preferences || [])],
        ["@user_allergies", JSON.stringify(nextUser.allergies || [])],
        ["@user_temporary_mode", nextUser.temporaryMode || "always_on"],
      ]).catch((error) => {
        console.error("Erro ao salvar usuário local:", error);
      });
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signUp, signOut, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);