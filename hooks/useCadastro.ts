// useCadastro.ts
import { useState } from "react";

// Meus imports
import { CadastroErrors } from "../types/auth";
import { isPasswordStrong, validateEmail, validateName } from "../utils/validation";
import { useAuth } from "@/hooks/useAuth";
import { MESSAGES } from "../constants/messages";

export function useCadastroForm() {
    const { signUp, isLoading } = useAuth();

    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");

    const [foodPreferences, setFoodPreferences] = useState<string[]>([]);
    const [allergies, setAllergies] = useState<string[]>([]);
    const [otherRestrictions, setOtherRestrictions] = useState("");

    const [errors, setErrors] = useState<CadastroErrors>({});
    const [isSuccess, setIsSuccess] = useState(false);

    // Função de Toggle de Seleção para Preferências Alimentares, Alergias e Outras Restrições
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

    // Função de Registo com Validação
    const handleRegister = async () => {
        let newErrors: CadastroErrors = {};

        if (!validateName(nome)) newErrors.nome = MESSAGES.VALIDATION_NAME;
        if (!validateEmail(email)) newErrors.email = MESSAGES.VALIDATION_EMAIL;
        if (!isPasswordStrong(senha)) newErrors.senha = MESSAGES.VALIDATION_PASSWORD;
        if (senha !== confirmarSenha) newErrors.confirmarSenha = MESSAGES.VALIDATION_PASSWORD_MATCH;

        setErrors(newErrors);

        // Se não houver erros de validação, procede para o signUp
        if (Object.keys(newErrors).length === 0) {
            try {
                const result = await signUp(
                    nome,
                    email,
                    senha,
                    foodPreferences,
                    allergies,
                    otherRestrictions
                );

                if (result.success) {
                    setIsSuccess(true);
                    return { success: true };
                } else {
                    // Erro retornado pela API ou mensagem padrão de falha no cadastro
                    setErrors({ geral: result.error || MESSAGES.ERROR_CREATE_ACCOUNT });
                    return { success: false, error: result.error };
                }
            } catch (err: any) {
                // Erro de rede ou crash inesperado
                setErrors({ geral: MESSAGES.ERROR_CONNECTION });
                return { success: false, error: err.message };
            }
        }
        return { success: false };
    };

    return {
        nome, setNome,
        email, setEmail,
        senha, setSenha,
        confirmarSenha, setConfirmarSenha,
        foodPreferences, setFoodPreferences,
        allergies, setAllergies,
        otherRestrictions, setOtherRestrictions,
        errors, setErrors,
        isLoading, isSuccess,

        toggleSelection,
        handleRegister
    };
}