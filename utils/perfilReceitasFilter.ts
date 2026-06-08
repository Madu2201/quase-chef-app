// Meus imports
import {
  ALLERGY_ALIASES,
  ALLERGY_OPTIONS,
  FOOD_PREFERENCE_OPTIONS,
} from "../constants/OpcaoAlimentar";
import { TemporaryMode } from "../types/perfil";
import { normalizarTexto } from "./normalization";

// Funções de filtragem de receitas com base no perfil do usuário (preferências e alergias)
function squish(s: string): string {
  return normalizarTexto(s).replace(/\s+/g, "").replace(/_/g, "");
}

/// Aplica preferências alimentares dependendo do modo de trabalho do perfil (sempre, pausado ou apenas fins de semana).
export function modoPerfilAplicaPreferencias(
  temporaryMode?: TemporaryMode | null,
): boolean {
  if (!temporaryMode || temporaryMode === "always_on") return true;
  if (temporaryMode === "paused") return false;
  if (temporaryMode === "weekends_only") {
    const d = new Date().getDay();
    const fimDeSemana = d === 0 || d === 6;
    return !fimDeSemana;
  }
  return true;
}

/** @deprecated Use modoPerfilAplicaPreferencias — nome antigo enganava (alergias são sempre aplicadas). */
export const modoPerfilAplicaFiltros = modoPerfilAplicaPreferencias;

// Normaliza e converte um valor de alergia para a chave canônica reconhecida pelo sistema (ou null se não reconhecer).
export function alergenioParaChaveCanonica(valor: string): string | null {
  const t = String(valor).trim();
  if (!t) return null;
  const n = normalizarTexto(t);
  const q = squish(t);

  for (const opt of ALLERGY_OPTIONS) {
    if (normalizarTexto(opt.key) === n) return opt.key;
    if (normalizarTexto(opt.label) === n) return opt.key;
    if (squish(opt.key) === q) return opt.key;
    if (squish(opt.label) === q) return opt.key;
  }

  // Tratamento de alguns casos comuns e sinônimos
  const low = t.toLowerCase();
  if (ALLERGY_ALIASES[low]) return ALLERGY_ALIASES[low];

  for (const opt of ALLERGY_OPTIONS) {
    const lk = normalizarTexto(opt.label);
    if (lk.length >= 3 && (n.includes(lk) || lk.includes(n))) return opt.key;
    const kk = normalizarTexto(opt.key.replace(/_/g, " "));
    if (kk.length >= 3 && (n.includes(kk) || kk.includes(n))) return opt.key;
  }

  return null;
}

// Normaliza e converte um valor de preferência alimentar para a chave canônica reconhecida pelo sistema.
function preferenciaParaChaveCanonica(valor: string): string | null {
  const t = String(valor).trim();
  if (!t) return null;
  const n = normalizarTexto(t);
  const q = squish(t);

  for (const opt of FOOD_PREFERENCE_OPTIONS) {
    if (normalizarTexto(opt.key) === n) return opt.key;
    if (normalizarTexto(opt.label) === n) return opt.key;
    if (squish(opt.key) === q) return opt.key;
    if (squish(opt.label) === q) return opt.key;
  }
  return null;
}

// Verifica se uma receita tem alergias que colidem com o perfil do usuário.
export function receitaBloqueadaPorAlergia(
  alergiasUsuario: string[],
  alergiasReceita: string[],
): boolean {
  if (!alergiasUsuario.length || !alergiasReceita.length) return false;

  const usuario = new Set<string>();
  for (const a of alergiasUsuario) {
    const c = alergenioParaChaveCanonica(a);
    if (c) usuario.add(c);
    else usuario.add(squish(a));
  }

  for (const r of alergiasReceita) {
    const c = alergenioParaChaveCanonica(r);
    if (c && usuario.has(c)) return true;
    if (!c && usuario.has(squish(r))) return true;
  }

  return false;
}

// Verifica se uma receita tem alergias que colidem com o perfil do usuário. Retorna a lista de alergias conflitantes.
export function alergiasReceitaQueColidemComUsuario(
  alergiasUsuario: string[],
  alergiasReceita: string[],
): string[] {
  if (!alergiasUsuario.length || !alergiasReceita.length) return [];

  const usuario = new Set<string>();
  for (const a of alergiasUsuario) {
    const c = alergenioParaChaveCanonica(a);
    if (c) usuario.add(c);
    else usuario.add(squish(a));
  }

  const hits: string[] = [];
  for (const r of alergiasReceita) {
    const c = alergenioParaChaveCanonica(r);
    if (c && usuario.has(c)) hits.push(c);
    else if (!c && usuario.has(squish(r))) hits.push(String(r).trim());
  }
  return [...new Set(hits)];
}

// Verifica se uma receita tem preferências alimentares que colidem com o perfil do usuário.
export function receitaPassaUniaoPreferencias(
  preferenciasUsuario: string[],
  preferenciasReceita: string[],
): boolean {
  if (!preferenciasUsuario.length) return true;
  if (!preferenciasReceita.length) return false;

  const receita = new Set<string>();
  for (const p of preferenciasReceita) {
    const c = preferenciaParaChaveCanonica(p);
    if (c) receita.add(c);
    else receita.add(squish(p));
  }

  return preferenciasUsuario.some((u) => {
    const c = preferenciaParaChaveCanonica(u);
    const token = c || squish(u);
    return receita.has(token);
  });
}
