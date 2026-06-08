// Chaves de armazenamento local para dados de autenticação
export const AUTH_STORAGE_KEYS = {
    user_id: "@user_id",
    user_full_name: "@user_full_name",
    user_email: "@user_email",
    user_foto: "@user_foto",
    user_food_preferences: "@user_food_preferences",
    user_allergies: "@user_allergies",
    user_temporary_mode: "@user_temporary_mode",
};

// Eventos de autenticação do Supabase
export const AUTH_EVENTS = {
    SIGNED_IN: "SIGNED_IN",
    INITIAL_SESSION: "INITIAL_SESSION",
    TOKEN_REFRESHED: "TOKEN_REFRESHED",
    USER_UPDATED: "USER_UPDATED",
    SIGNED_OUT: "SIGNED_OUT",
};

// Prefixos e padrões
export const AUTH_DEFAULTS = {
    sb_prefix: "sb-",
    supabase_prefix: "supabase",
};
