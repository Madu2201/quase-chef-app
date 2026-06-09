import { updateUserProfile, uploadAvatar } from "@/services/authService";
import { supabase } from "@/services/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { Alert } from "react-native";

// Meus imports
import { MESSAGES } from "../constants/messages";
import { DEFAULT_TEMPORARY_MODE, MESES_PORTUGUES, PROFILE_DEFAULTS, STORAGE_KEYS } from "../constants/profile";
import { FoodPreferences, TemporaryMode, UserProfileData } from "../types/perfil";
import { useAuth } from "./useAuth";
import { useNetworkStatus } from "./useNetworkStatus";

// Hook principal para gerenciar o perfil do usuário, incluindo dados básicos e preferências alimentares
export const useProfile = (userFromAuth: any) => {
  const { user, updateUser } = useAuth();
  const { isOffline, notifyInternetRequired } = useNetworkStatus();
  const [profile, setProfile] = useState<UserProfileData>({
    id: null,
    nome: "Carregando...",
    email: "",
    fotoUrl: "",
  });
  const [preferences, setPreferences] = useState<FoodPreferences>({
    lifestyle: [],
    allergies: [],
    otherRestrictions: "",
    temporaryMode: DEFAULT_TEMPORARY_MODE,
    updatedAt: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSavingPref, setIsSavingPref] = useState(false);

  // Carregamento inicial: Auth + AsyncStorage
  useEffect(() => {
    let isMounted = true;

    const loadAllData = async () => {
      try {
        // Prioriza ID do Auth, senão busca no Storage
        const currentId =
          userFromAuth?.id || (await AsyncStorage.getItem("@user_id"));

        if (!currentId) return;

        let userData: any = null;
        if (!isOffline) {
          const { data, error } = await supabase
            .from("users")
            .select("*")
            .eq("id", currentId)
            .single();

          if (error) {
            console.error("Erro ao buscar dados do Supabase:", error);
          } else {
            userData = data;
          }
        }

        const keys = Object.values(STORAGE_KEYS);
        const stored = await AsyncStorage.multiGet(keys);
        const data = Object.fromEntries(stored);

        if (isMounted) {
          // Formata a data de criação (Membro desde...)
          let membroDesde = PROFILE_DEFAULTS.MEMBRO_RECENTE;
          if (userData?.created_at) {
            const dataCriacao = new Date(userData.created_at);
            membroDesde = `${PROFILE_DEFAULTS.MEMBRO_DESDE_PREFIX} ${MESES_PORTUGUES[dataCriacao.getMonth()]} de ${dataCriacao.getFullYear()}`;
          }

          // Atualiza Perfil
          setProfile({
            id: currentId,
            nome:
              userData?.full_name ||
              userFromAuth?.full_name ||
              (await AsyncStorage.getItem("@user_full_name")) ||
              "Usuário",
            email:
              userData?.email ||
              userFromAuth?.email ||
              (await AsyncStorage.getItem("@user_email")) ||
              "",
            fotoUrl:
              userData?.avatar_url ||
              userFromAuth?.avatar_url ||
              (await AsyncStorage.getItem("@user_foto")) ||
              "",
            membroDesde,
          });

          // Atualiza Preferências (Dá prioridade ao que vem do Supabase se o AsyncStorage estiver vazio)
          setPreferences({
            lifestyle:
              userData?.food_preferences ||
              (data[STORAGE_KEYS.lifestyle]
                ? JSON.parse(data[STORAGE_KEYS.lifestyle]!)
                : []),
            allergies:
              userData?.allergies ||
              (data[STORAGE_KEYS.allergies]
                ? JSON.parse(data[STORAGE_KEYS.allergies]!)
                : []),
            otherRestrictions:
              userData?.other_restrictions ||
              data[STORAGE_KEYS.restrictions] ||
              "",
            temporaryMode:
              (data[STORAGE_KEYS.mode] as TemporaryMode) || DEFAULT_TEMPORARY_MODE,
            updatedAt: data[STORAGE_KEYS.updated] || "",
          });
        }
      } catch (e) {
        console.error("Erro ao carregar perfil:", e);
      }
    };

    loadAllData();
    return () => {
      isMounted = false;
    };
  }, [isOffline, userFromAuth]);

  // Salva preferências alimentares (Supabase + Local Storage)
  const savePreferences = async () => {
    if (!profile.id) return Alert.alert("Erro", MESSAGES.ERROR_USER_NOT_IDENTIFIED);
    if (
      !notifyInternetRequired(
        MESSAGES.OFFLINE_SAVE_PREFERENCES,
      )
    ) {
      return false;
    }

    setIsSavingPref(true);
    const now = new Date();
    const timestamp = `hoje, ${String(now.getHours()).padStart(2, "0")}h${String(now.getMinutes()).padStart(2, "0")}`;

    try {
      // 1. Atualiza no Supabase
      await updateUserProfile(
        profile.id,
        profile.nome,
        profile.email,
        preferences.lifestyle,
        preferences.allergies,
        preferences.otherRestrictions,
      );

      // 2. Atualiza Localmente
      await AsyncStorage.multiSet([
        [STORAGE_KEYS.lifestyle, JSON.stringify(preferences.lifestyle)],
        [STORAGE_KEYS.allergies, JSON.stringify(preferences.allergies)],
        [STORAGE_KEYS.restrictions, preferences.otherRestrictions],
        [STORAGE_KEYS.mode, preferences.temporaryMode],
        [STORAGE_KEYS.updated, timestamp],
      ]);

      setPreferences((prev) => ({ ...prev, updatedAt: timestamp }));
      if (user) {
        updateUser({
          ...user,
          food_preferences: preferences.lifestyle,
          allergies: preferences.allergies,
          temporaryMode: preferences.temporaryMode,
        });
      }
      Alert.alert("Sucesso", MESSAGES.SUCCESS_PREFERENCES_SAVED);
      return true;
    } catch (e) {
      console.error("Erro ao salvar preferências:", e);
      Alert.alert("Erro", MESSAGES.ERROR_SAVE_PREFERENCES);
      return false;
    } finally {
      setIsSavingPref(false);
    }
  };

  // Salva dados básicos (Supabase + Local Storage)
  const saveBasicProfile = async () => {
    if (!profile.id) return Alert.alert("Erro", MESSAGES.ERROR_USER_NOT_IDENTIFIED);
    if (!notifyInternetRequired(MESSAGES.OFFLINE_UPDATE_PROFILE)) {
      return false;
    }

    setIsLoading(true);
    try {
      let finalFotoUrl = profile.fotoUrl;

      // Upload apenas se for uma imagem nova selecionada no dispositivo (file://)
      if (profile.fotoUrl && profile.fotoUrl.startsWith("file://")) {
        finalFotoUrl = await uploadAvatar(
          profile.id,
          profile.nome,
          profile.fotoUrl,
        );
      }

      await updateUserProfile(profile.id, profile.nome, profile.email);

      await AsyncStorage.multiSet([
        ["@user_full_name", profile.nome],
        ["@user_email", profile.email],
        ["@user_foto", finalFotoUrl],
      ]);

      setProfile((prev) => ({ ...prev, fotoUrl: finalFotoUrl }));
      if (user) {
        updateUser({
          ...user,
          full_name: profile.nome,
          email: profile.email,
          avatar_url: finalFotoUrl,
        });
      }
      Alert.alert("Sucesso", MESSAGES.SUCCESS_PROFILE_SAVED);
      return true;
    } catch (e) {
      console.error(e);
      Alert.alert("Erro", MESSAGES.ERROR_UPDATE_PROFILE);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    profile,
    setProfile,
    preferences,
    setPreferences,
    isLoading,
    isSavingPref,
    savePreferences,
    saveBasicProfile,
  };
};