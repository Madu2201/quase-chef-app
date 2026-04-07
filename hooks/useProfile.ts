import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { FoodPreferences, UserProfileData, TemporaryMode } from '../types/perfil';
import { updateUserProfile, uploadAvatar } from '@/services/authService';

const STORAGE_KEYS = {
    lifestyle: "@perfil_food_lifestyle",
    allergies: "@perfil_food_allergies",
    restrictions: "@perfil_food_other_restrictions",
    mode: "@perfil_food_temporary_mode",
    updated: "@perfil_food_updated_at",
};

export const useProfile = (userFromAuth: any) => {
    const [profile, setProfile] = useState<UserProfileData>({ id: null, nome: "Carregando...", email: "", fotoUrl: "" });
    const [preferences, setPreferences] = useState<FoodPreferences>({
        lifestyle: [], allergies: [], otherRestrictions: "", temporaryMode: "always_on", updatedAt: ""
    });
    const [isLoading, setIsLoading] = useState(false); // Loading para dados básicos
    const [isSavingPref, setIsSavingPref] = useState(false); // Loading para preferências

    // Carregamento inicial: Auth + AsyncStorage
    useEffect(() => {
        let isMounted = true;

        const loadAllData = async () => {
            try {
                const keys = Object.values(STORAGE_KEYS);
                const stored = await AsyncStorage.multiGet(keys);
                const data = Object.fromEntries(stored);

                // Prioriza ID do Auth, senão busca no Storage
                const currentId = userFromAuth?.id || await AsyncStorage.getItem("@user_id");

                if (isMounted) {
                    setProfile({
                        id: currentId,
                        nome: userFromAuth?.full_name || await AsyncStorage.getItem("@user_full_name") || "Usuário",
                        email: userFromAuth?.email || await AsyncStorage.getItem("@user_email") || "",
                        fotoUrl: userFromAuth?.avatar_url || await AsyncStorage.getItem("@user_foto") || "",
                    });

                    setPreferences({
                        lifestyle: data[STORAGE_KEYS.lifestyle] ? JSON.parse(data[STORAGE_KEYS.lifestyle]!) : [],
                        allergies: data[STORAGE_KEYS.allergies] ? JSON.parse(data[STORAGE_KEYS.allergies]!) : [],
                        otherRestrictions: data[STORAGE_KEYS.restrictions] || "",
                        temporaryMode: (data[STORAGE_KEYS.mode] as TemporaryMode) || "always_on",
                        updatedAt: data[STORAGE_KEYS.updated] || ""
                    });
                }
            } catch (e) {
                console.error("Erro ao carregar perfil:", e);
            }
        };

        loadAllData();
        return () => { isMounted = false; };
    }, []); // [] garante que não resete os campos enquanto o usuário digita

    // Salva preferências alimentares (Local Only)
    const savePreferences = async () => {
        setIsSavingPref(true);
        const now = new Date();
        const timestamp = `hoje, ${String(now.getHours()).padStart(2, '0')}h${String(now.getMinutes()).padStart(2, '0')}`;

        try {
            await AsyncStorage.multiSet([
                [STORAGE_KEYS.lifestyle, JSON.stringify(preferences.lifestyle)],
                [STORAGE_KEYS.allergies, JSON.stringify(preferences.allergies)],
                [STORAGE_KEYS.restrictions, preferences.otherRestrictions],
                [STORAGE_KEYS.mode, preferences.temporaryMode],
                [STORAGE_KEYS.updated, timestamp],
            ]);
            setPreferences(prev => ({ ...prev, updatedAt: timestamp }));
            Alert.alert("Sucesso", "Preferências alimentares atualizadas!");
            return true;
        } catch (e) {
            Alert.alert("Erro", "Falha ao salvar preferências.");
            return false;
        } finally {
            setIsSavingPref(false);
        }
    };

    // Salva dados básicos (Supabase + Local Storage)
    const saveBasicProfile = async () => {
        if (!profile.id) return Alert.alert("Erro", "Usuário não identificado.");

        setIsLoading(true);
        try {
            let finalFotoUrl = profile.fotoUrl;

            // Upload apenas se for uma imagem nova selecionada no dispositivo (file://)
            if (profile.fotoUrl && profile.fotoUrl.startsWith("file://")) {
                finalFotoUrl = await uploadAvatar(profile.id, profile.nome, profile.fotoUrl);
            }

            await updateUserProfile(profile.id, profile.nome, profile.email);

            await AsyncStorage.multiSet([
                ["@user_full_name", profile.nome],
                ["@user_email", profile.email],
                ["@user_foto", finalFotoUrl],
            ]);

            setProfile(prev => ({ ...prev, fotoUrl: finalFotoUrl }));
            Alert.alert("Sucesso", "Dados do perfil salvos!");
        } catch (e) {
            console.error(e);
            Alert.alert("Erro", "Falha ao atualizar perfil.");
        } finally {
            setIsLoading(false);
        }
    };

    return {
        profile, setProfile,
        preferences, setPreferences,
        isLoading, isSavingPref,
        savePreferences, saveBasicProfile
    };
};