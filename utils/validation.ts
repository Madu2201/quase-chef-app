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

/**
 * Parse seguro de números com suporte a vírgula decimal (padrão brasileiro)
 * @param valor - Valor a ser convertido (string ou number)
 * @param defaultValue - Valor padrão se inválido (default: 0)
 * @returns Número parseado ou valor padrão se inválido
 */
export const parseNumero = (
  valor: string | number | undefined | null,
  defaultValue: number = 0
): number => {
  if (valor === null || valor === undefined) return defaultValue;

  const str = String(valor).trim();
  if (str === "") return defaultValue;

  const parsed = parseFloat(str.replace(",", "."));
  return isNaN(parsed) ? defaultValue : parsed;
};

/**
 * Normaliza nome para comparação case-insensitive
 * @param nome - Nome a ser normalizado
 * @returns Nome em minúsculas, trimmed e com espaços únicos
 */
export const normalizarNome = (nome: string): string =>
  nome.trim().toLowerCase().replace(/\s+/g, " ");

/**
 * Valida quantidade com limites (não permite negativo ou muito grande)
 * @param valor - Valor a validar
 * @param max - Valor máximo permitido (default: 99999)
 * @returns Número validado ou null se inválido
 */
export const validateQuantity = (
  valor: string | number,
  max: number = 99999
): number | null => {
  const num = parseNumero(valor);

  if (num < 0) return null;
  if (num > max) return null;
  if (!Number.isFinite(num)) return null;

  return num;
};

/**
 * Valida se string é vazia ou contém apenas espaços
 * @param str - String a validar
 * @returns true se válida (não vazia), false caso contrário
 */
export const isValidString = (str: string | null | undefined): boolean => {
  return typeof str === "string" && str.trim().length > 0;
};