// Tipos relacionados ao perfil do usuário
export type TemporaryMode = "always_on" | "paused" | "weekends_only";

// Preferências alimentares
export interface FoodPreferences {
  lifestyle: string[];
  allergies: string[];
  otherRestrictions: string;
  temporaryMode: TemporaryMode;
  updatedAt: string;
}

// Dados do perfil
export interface UserProfileData {
  id: string | null;
  nome: string;
  email: string;
  fotoUrl: string;
  membroDesde?: string;
}
