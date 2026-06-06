import { supabase } from "@/services/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { loginUser, registerUser } from "../services/authService";
import { AuthResponse, UserData } from "../types/auth";
import { TemporaryMode } from "../types/perfil";
import { useNetworkStatus } from "./useNetworkStatus";

interface AuthContextData {
  user: UserData | null;
  isLoading: boolean;
  signIn: (email: string, senha: string) => Promise<AuthResponse>;
  signUp: (
    nome: string,
    email: string,
    senha: string,
    foodPreferences?: string[],
    allergies?: string[],
    otherRestrictions?: string,
  ) => Promise<{ success: boolean; userId?: string; error?: string }>;
  signOut: () => Promise<void>;
  updateUser: (user: UserData | null) => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

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

    // 1. Carrega o cache local rápido para a abertura do app
    const loadUser = async () => {
      try {
        const [id, name, email, avatar, foodPreferences, allergies, temporaryMode] = await Promise.all([
          AsyncStorage.getItem("@user_id"),
          AsyncStorage.getItem("@user_full_name"),
          AsyncStorage.getItem("@user_email"),
          AsyncStorage.getItem("@user_foto"),
          AsyncStorage.getItem("@user_food_preferences"),
          AsyncStorage.getItem("@user_allergies"),
          AsyncStorage.getItem("@user_temporary_mode"),
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
      // Não definimos isLoading(false) aqui para esperar o Supabase confirmar a sessão real
    };

    loadUser();

    // 2. O SENTINELA: Monitora e sincroniza a sessão real do Supabase
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        // Eventos que indicam que estamos processando uma sessão
        if (event === "SIGNED_IN" || event === "INITIAL_SESSION" || event === "TOKEN_REFRESHED") {
          setIsLoading(true);
        }
        // Se for apenas uma atualização de usuário (como troca de senha), sincronizar metadata leve
        if (event === 'USER_UPDATED') {
          const currentUser = userRef.current;
          if (session?.user?.email && currentUser && currentUser.email !== session.user.email) {
            // Atualizar apenas o email se mudou de outro dispositivo
            const updatedUser = { ...currentUser, email: session.user.email };
            setUser(updatedUser);
            await AsyncStorage.setItem("@user_email", session.user.email);
          }
          return;
        }

        if (session?.user) {
          try {
            const userId = session.user.id;
            const userEmail = session.user.email || "";

            // Sempre busca o perfil completo e atualizado do banco de dados
            const { data: dbProfile, error: dbError } = await supabase
              .from("users")
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
              ["@user_id", userId],
              ["@user_email", userEmail],
              ["@user_full_name", completeUser.full_name || ""],
              ["@user_foto", completeUser.avatar_url || ""],
              ["@user_food_preferences", JSON.stringify(completeUser.food_preferences)],
              ["@user_allergies", JSON.stringify(completeUser.allergies)],
            ]);
          } catch (error) {
            console.error("Erro no sentinela de auth:", error);
          } finally {
            setIsLoading(false);
          }
        } else if (event === "SIGNED_OUT") {
          setUser(null);
          await AsyncStorage.multiRemove([
            "@user_id",
            "@user_email",
            "@user_full_name",
            "@user_foto",
            "@user_food_preferences",
            "@user_allergies",
            "@user_temporary_mode",
          ]);
          setIsLoading(false);
        } else {
          // Para outros eventos (como INITIAL_SESSION sem user)
          setIsLoading(false);
        }
      },
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const signUp = async (
    nome: string,
    email: string,
    senha: string,
    foodPreferences: string[] = [],
    allergies: string[] = [],
    otherRestrictions: string = "",
  ) => {
    if (!notifyInternetRequired("Reconecte-se para criar sua conta.")) {
      return {
        success: false,
        error: "Reconecte-se à internet para criar sua conta.",
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
    if (!notifyInternetRequired("Reconecte-se para entrar na sua conta.")) {
      return {
        success: false,
        error: "Reconecte-se à internet para entrar na sua conta.",
      };
    }

    setIsLoading(true);
    try {
      const userData = await loginUser(email, senha);
      const modoSalvo = await AsyncStorage.getItem("@user_temporary_mode");

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

        // Caça as nossas chaves @user_ E a chave secreta dinâmica do Supabase (que começa com sb-)
        const keysToNuke = allKeys.filter(
          (key) => key.startsWith("@user_") || key.startsWith("sb-") || key.includes("supabase")
        );

        // Oblítera as chaves encontradas
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
