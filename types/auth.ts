import { LucideIcon } from "lucide-react-native";

// Tipagem para os dados do usuário
import { TemporaryMode } from "./perfil";

// Tipagem para os itens de opções
export interface OptionItem {
    key: string;
    label: string;
    icon: LucideIcon;
}

// Erros específicos para a tela de Login
export interface LoginErrors {
    email?: string | null;
    senha?: string | null;
    geral?: string | null;
}

// Erros específicos para a tela de Cadastro
export interface CadastroErrors {
    nome?: string | null;
    email?: string | null;
    senha?: string | null;
    confirmarSenha?: string | null;
    geral?: string | null;
}

export interface UserData {
    id: string;
    full_name: string | null;
    email: string | null;
    avatar_url: string | null;
    food_preferences?: string[] | null;
    allergies?: string[] | null;
    temporaryMode?: TemporaryMode;
    other_restrictions?: string | null;
}

// Tipagem para o retorno das funções do Auth
export interface AuthResponse {
    success: boolean;
    user?: UserData;
    error?: string;
}

// Tipagem para o contexto de autenticação
export interface AuthContextData {
    user: UserData | null;
    isLoading: boolean;
    signIn: (email: string, senha: string) => Promise<AuthResponse>;
    signUp: (nome: string, email: string, senha: string, foodPreferences?: string[], allergies?: string[], otherRestrictions?: string) => Promise<{ success: boolean; userId?: string; error?: string }>;
    signOut: () => Promise<void>;
    updateUser: (nextUser: UserData | null) => void;
}