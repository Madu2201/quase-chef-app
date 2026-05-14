import { CompraItem } from "../types/lista";

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
  return name.trim().length >= 3;
};

/**
 * Transforma string com vírgula em número (ex: "1,5" -> 1.5)
 * Se for inválido, retorna o valor padrão (defaultValue).
 * * @param valor - String ou número a ser convertido
 * @param defaultValue - Valor de fallback em caso de erro (padrão: 0)
 * @returns Número parseado ou valor padrão se inválido
 */
export const parseNumero = (
  valor: string | number | undefined | null,
  defaultValue: number = 0,
): number => {
  if (valor === null || valor === undefined) return defaultValue;

  const str = String(valor).trim();
  if (str === "") return defaultValue;

  const parsed = parseFloat(str.replace(",", "."));
  return isNaN(parsed) ? defaultValue : parsed;
};

/**
 * Normaliza nome para comparação case-insensitive
 * Mantém primeira letra maiúscula conforme entrada do usuário
 * @param nome - Nome a ser normalizado
 * @returns Nome trimmed com primeira letra maiúscula e espaços únicos
 */
export const normalizarNome = (nome: string): string => {
  const trimmed = nome.trim().replace(/\s+/g, " ");
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
};

/**
 * Valida quantidade com limites (não permite negativo ou muito grande)
 * @param valor - Valor a validar
 * @param max - Valor máximo permitido (default: 99999)
 * @returns Número validado ou null se inválido
 */
export const validateQuantity = (
  valor: string | number,
  max: number = 99999,
): number | null => {
  const num = parseNumero(valor);

  if (num < 0) return null;
  if (num > max) return null;
  if (!Number.isFinite(num)) return null;

  return num;
};

// ============================================================================
// --- NOVA FUNÇÃO (FASE 1: GUARDA ESTOQUE / UPSERT) ---
// ============================================================================

/**
 * Garante que o item comprado tem os dados mínimos e válidos antes de ser enviado para a despensa.
 */
export function validarParaUpsert(item: CompraItem): boolean {
  if (!item || !item.nome || item.nome.trim() === "") return false;

  const qtd = Number(item.quantidade_comprar);
  if (isNaN(qtd) || qtd <= 0) return false;

  if (!item.unidade || item.unidade.trim() === "") return false;

  return true;
}
