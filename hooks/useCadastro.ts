import { useState } from "react";

// Meus imports
import { CadastroErrors } from "../types/auth";
import {
    isPasswordStrong,
    validateEmail,
    validateName
} from "../utils/validation";
import { useAuth } from "./useAuth";

export function useCadastroForm() {
    const { signUp, isLoading } = useAuth();

    // Estados do Formulário
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");

    // Preferências e Restrições
    const [foodPreferences, setFoodPreferences] = useState<string[]>([]);
    const [allergies, setAllergies] = useState<string[]>([]);
    const [otherRestrictions, setOtherRestrictions] = useState("");

    const [errors, setErrors] = useState<CadastroErrors>({});
    const [isSuccess, setIsSuccess] = useState(false);

    const toggleSelection = (
        key: string,
        currentList: string[],
        setter: React.Dispatch<React.SetStateAction<string[]>>
    ) => {
        if (currentList.includes(key)) {
            setter(currentList.filter((item) => item !== key));
        } else {
            setter([...currentList, key]);
        }
    };

    // Função de Registro com Validação
    const handleRegister = async () => {
        let newErrors: CadastroErrors = {};

        if (!validateName(nome)) newErrors.nome = "Nome deve ter 3-50 caracteres.";
        if (!validateEmail(email)) newErrors.email = "E-mail inválido.";
        if (!isPasswordStrong(senha)) newErrors.senha = "Senha fora do padrão exigido.";
        if (senha !== confirmarSenha) newErrors.confirmarSenha = "As senhas não coincidem.";

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            try {
                const result = await signUp(nome, email, senha);

                if (result.success) {
                    setIsSuccess(true);
                    return { success: true };
                } else {
                    setErrors({ geral: result.error || "Erro ao criar conta." });
                }
            } catch {
                setErrors({ geral: "Erro de conexão com o servidor." });
            }
        }
        return { success: false };
    };

    return {
        // Estados
        nome, setNome,
        email, setEmail,
        senha, setSenha,
        confirmarSenha, setConfirmarSenha,
        foodPreferences, setFoodPreferences,
        allergies, setAllergies,
        otherRestrictions, setOtherRestrictions,
        errors, setErrors,
        isLoading, isSuccess,
        // Funções
        toggleSelection,
        handleRegister
    };
}