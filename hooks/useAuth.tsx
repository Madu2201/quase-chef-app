import AsyncStorage from "@react-native-async-storage/async-storage";
import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";

// Meus imports de serviço e tipos
import { loginUser, registerUser } from "../services/authService";
// Importe os tipos que criamos
import { supabase } from "@/services/supabase";
import { AuthResponse, UserData } from "../types/auth";
import { TemporaryMode } from "../types/perfil";

interface AuthContextData {
  user: UserData | null; // Tipado corretamente
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
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    // 1. Mantém a sua lógica de carregar rápido do AsyncStorage (Não quebra nada que você já fez)
    const parseArrayString = (value: string | null): string[] => {
      if (!value) return [];
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed)
          ? parsed.filter(Boolean).map((item) => String(item))
          : [];
      } catch {
        return [];
      }
    };

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
        console.error("Erro ao carregar usuário:", error);
      }
    };

    loadUser();

    // 2. Escuta o Supabase! Quando o Google terminar de logar, isso aqui dispara.
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          // Pega os dados (seja do Google ou do banco)
          const userId = session.user.id;
          const userEmail = session.user.email || "";
          // O Google manda o nome e foto dentro de user_metadata
          const userName =
            session.user.user_metadata?.full_name ||
            session.user.user_metadata?.name ||
            "";
          const userAvatar =
            session.user.user_metadata?.avatar_url ||
            session.user.user_metadata?.picture ||
            "";

          // Atualiza o estado da aplicação
          setUser({
            id: userId,
            full_name: userName,
            email: userEmail,
            avatar_url: userAvatar,
          });

          // Salva no seu AsyncStorage para o seu home.tsx conseguir ler!
          await AsyncStorage.multiSet([
            ["@user_id", userId],
            ["@user_email", userEmail],
            ["@user_full_name", userName],
            ["@user_foto", userAvatar],
          ]);
        } else if (event === "SIGNED_OUT") {
          setUser(null);
          await AsyncStorage.multiRemove([
            "@user_id",
            "@user_email",
            "@user_full_name",
            "@user_foto",
          ]);
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
    setIsLoading(true);
    try {
      const userId = await registerUser(
        nome,
        email,
        senha,
        foodPreferences,
        allergies,
        otherRestrictions,
      );
      return { success: true, userId };
    } catch (error: any) {
      return { success: false, error: error.message };
    } finally {
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

  const signIn = async (
    email: string,
    senha: string,
  ): Promise<AuthResponse> => {
    setIsLoading(true);
    try {
      const userData = await loginUser(email, senha);

      // Persistência
      await AsyncStorage.multiSet([
        ["@user_id", userData.id],
        ["@user_full_name", userData.full_name || ""],
        ["@user_foto", userData.avatar_url || ""],
        ["@user_email", userData.email || ""],
        ["@user_food_preferences", JSON.stringify(userData.food_preferences || [])],
        ["@user_allergies", JSON.stringify(userData.allergies || [])],
      ]);

      setUser(userData);
      return { success: true, user: userData };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Erro ao realizar login",
      };
    } finally {
      setIsLoading(false);
    }
  };

  // import { supabase } from "@/services/supabase";

  const signOut = async () => {
    setIsLoading(true);
    try {
      // 1. Encerra a sessão real lá no Supabase (Isso mata o "fantasma")
      await supabase.auth.signOut();

      // 2. Limpa o seu armazenamento local
      await AsyncStorage.multiRemove([
        "@user_id",
        "@user_full_name",
        "@user_foto",
        "@user_email",
        "@user_food_preferences",
        "@user_allergies",
      ]);

      // 3. Limpa o estado do app
      setUser(null);
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signUp, signOut, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
