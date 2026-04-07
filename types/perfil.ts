export type TemporaryMode = "always_on" | "paused" | "weekends_only";

export interface FoodPreferences {
    lifestyle: string[];
    allergies: string[];
    otherRestrictions: string;
    temporaryMode: TemporaryMode;
    updatedAt: string;
}

export interface UserProfileData {
    id: string | null;
    nome: string;
    email: string;
    fotoUrl: string;
}