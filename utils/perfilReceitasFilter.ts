import { ALLERGY_OPTIONS, FOOD_PREFERENCE_OPTIONS } from "../constants/OpcaoAlimentar";
import { TemporaryMode } from "../types/perfil";
import { normalizarTexto } from "./normalization";

/** Normaliza comparação de chaves e labels (underscore vs espaço). */
function squish(s: string): string {
  return normalizarTexto(s).replace(/\s+/g, "").replace(/_/g, "");
}

/**
 * Preferências de estilo (união): só aplicadas quando retorna true.
 * Alergias são SEMPRE aplicadas em separado — não usar esta função para alergias.
 *
 * - paused → não filtra por preferências (catálogo mais amplo).
 * - weekends_only → sábado/domingo: igual a pausado para preferências; dias úteis: ativo.
 * - always_on → aplica preferências.
 */
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

/**
 * Mapeia texto livre / tag da receita para chave canônica de ALLERGY_OPTIONS (sinônimos comuns).
 */
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

  const low = t.toLowerCase();
  const alias: Record<string, string> = {
    soy: "soja",
    tofu: "soja",
    edamame: "soja",
    peanut: "amendoim",
    groundnut: "amendoim",
    shrimp: "frutos_do_mar",
    camarão: "frutos_do_mar",
    camarao: "frutos_do_mar",
    gluten: "trigo",
    wheat: "trigo",
    dairy: "leite",
    milk: "leite",
    egg: "ovo",
    eggs: "ovo",
    sesame: "gergelim",
    shellfish: "frutos_do_mar",
  };
  if (alias[low]) return alias[low];

  for (const opt of ALLERGY_OPTIONS) {
    const lk = normalizarTexto(opt.label);
    if (lk.length >= 3 && (n.includes(lk) || lk.includes(n))) return opt.key;
    const kk = normalizarTexto(opt.key.replace(/_/g, " "));
    if (kk.length >= 3 && (n.includes(kk) || kk.includes(n))) return opt.key;
  }

  return null;
}

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

/**
 * Blacklist: bloqueia se qualquer alérgeno da receita (canônico) coincide com o do usuário.
 */
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

/**
 * Chaves canônicas dos alérgenos da receita que colidem com o perfil (para alertas na UI).
 */
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

 * União: a receita entra se atender pelo menos UMA preferência do usuário.
 * Se o usuário não marcou preferências, não restringe por este critério.
 */
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
