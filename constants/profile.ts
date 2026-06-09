// Chaves de armazenamento local para as preferências do perfil
export const STORAGE_KEYS = {
    lifestyle: "@perfil_food_lifestyle",
    allergies: "@perfil_food_allergies",
    restrictions: "@perfil_food_other_restrictions",
    mode: "@perfil_food_temporary_mode",
    updated: "@perfil_food_updated_at",
};

// Meses em português para formatação de datas
export const MESES_PORTUGUES = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
];

// Modo temporário padrão
export const DEFAULT_TEMPORARY_MODE = "always_on";

// Strings de texto padrão para perfil
export const PROFILE_DEFAULTS = {
    MEMBRO_RECENTE: "Recente",
    MEMBRO_DESDE_PREFIX: "Membro desde",
};

// Descrições dos modos temporários de filtro
export const TEMPORARY_MODE_DESCRIPTIONS = {
    always_on: `Modo "Ativo": preferências de estilo (união) e alergias (exclusão) filtram a lista.`,
    paused: `Modo "Pausado": as preferências de estilo deixam de filtrar a lista (mais receitas). As alergias continuam sempre ativas.`,
    weekends_only: `Modo "Final de Semana": aos sábados e domingos vale pausa só nas preferências de estilo; nos outros dias aplicam-se normalmente. Alergias continuam sempre ativas.`,
} as const;