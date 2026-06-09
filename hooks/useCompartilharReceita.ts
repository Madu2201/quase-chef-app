import { useCallback, useState } from "react";
import { Alert, Share } from "react-native";

// Meus imports
import { DEEPLINKS } from "../constants/deeplinks";
import { MESSAGES } from "../constants/messages";
import { tornarReceitaPublica } from "../services/receitaService";
import type { CompartilharReceitaParams } from "../types/receitas";
import { useNetworkStatus } from "./useNetworkStatus";

// Funcionalidade de compartilhar receita
export function useCompartilharReceita() {
  const [isSharing, setIsSharing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { notifyInternetRequired } = useNetworkStatus();

  const compartilhar = useCallback(
    async ({ id, titulo }: CompartilharReceitaParams) => {
      if (!id) {
        Alert.alert("Erro", MESSAGES.ERROR_INVALID_RECIPE);
        return;
      }

      if (
        !notifyInternetRequired(MESSAGES.OFFLINE_SHARE_RECIPE)
      ) {
        return;
      }

      setIsSharing(true);
      setError(null);

      try {
        const receitaPublica = await tornarReceitaPublica(id);

        if (!receitaPublica) {
          const mensagemErro =
            MESSAGES.ERROR_SHARE_LINK_GENERATION;
          setError(mensagemErro);
          Alert.alert("Erro", mensagemErro);
          return;
        }

        const deepLink = `${DEEPLINKS.recipe_detail}${id}`;

        const message =
          `${MESSAGES.SHARE_RECIPE_PREFIX} ${titulo} ${MESSAGES.SHARE_RECIPE_SUFFIX}\n` +
          `${deepLink}`;

        await Share.share({
          title: `${MESSAGES.SHARE_RECIPE_TITLE}: ${titulo}`,
          message,
        });
      } catch (exception) {
        console.error("❌ Erro ao compartilhar receita:", exception);

        const mensagemErro =
          MESSAGES.ERROR_SHARE_RECIPE;
        setError(mensagemErro);
        Alert.alert("Erro", mensagemErro);
      } finally {
        setIsSharing(false);
      }
    },
    [notifyInternetRequired],
  );

  return {
    compartilhar,
    isSharing,
    error,
  };
}