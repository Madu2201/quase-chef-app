/**
 * 🛠️ Lógica de Validação do Quase Chef
 */

/**
 * Valida se a senha cumpre as regras estritas:
 * 1. Exatamente 8 caracteres (nem mais, nem menos)
 * 2. Pelo menos uma letra (maiuscula ou minuscula)
 * 3. Pelo menos um símbolo especial
 */
export const getPasswordRequirements = (password: string) => {
    return {
        // Verifica se o comprimento é exatamente 8
        exactLength: password.length === 8,
        // Verifica se existe ao menos uma letra usando Regex
        hasLetter: /[a-zA-Z]/.test(password),
        // Verifica se existe ao menos um símbolo especial
        hasSymbol: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
};

/**
 * Retorna true apenas se todos os requisitos forem atendidos
 */
export const isPasswordStrong = (password: string): boolean => {
    const req = getPasswordRequirements(password);
    return req.exactLength && req.hasLetter && req.hasSymbol;
};

/**
 * Validação de E-mail padrão
 */
export const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email.trim());
};

/**
 * Validação de Nome (mínimo 3 caracteres)
 */
export const validateName = (name: string): boolean => {
    const trimmed = name.trim();
    return trimmed.length >= 3 && trimmed.length <= 50;
};

/**
 * Valida se uma quantidade é válida (número positivo)
 * Aceita string ou number, com , ou . como separador decimal
 */
export const validarQuantidade = (qtd: string | number): { valido: boolean; erro?: string; valor?: number } => {
    const numValue = Number(String(qtd).replace(',', '.'));
  
    if (isNaN(numValue)) {
      return { valido: false, erro: 'Quantidade deve ser um número válido' };
    }
    if (numValue <= 0) {
      return { valido: false, erro: 'Quantidade deve ser maior que zero' };
    }
    if (numValue > 999999) {
      return { valido: false, erro: 'Quantidade muito grande' };
    }
    return { valido: true, valor: numValue };
  };

/**
 * Valida se uma unidade é aceita
 */
export const validarUnidade = (unidade: string, unidadesAceitas: string[]): { valido: boolean; erro?: string } => {
    if (!unidade || !unidade.trim()) {
      return { valido: false, erro: 'Unidade não pode estar vazia' };
    }
    if (!unidadesAceitas.includes(unidade.trim())) {
      return { 
        valido: false, 
        erro: `Unidade deve ser uma das: ${unidadesAceitas.join(', ')}` 
      };
    }
    return { valido: true };
  };