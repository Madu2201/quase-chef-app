import { useCallback, useState } from "react";
import { Alert, Share } from "react-native";

import { tornarReceitaPublica } from "../services/receitaService";

interface CompartilharReceitaParams {
  id: number | string;
  titulo: string;
  imagemUrl?: string;
}

export function useCompartilharReceita() {
  const [isSharing, setIsSharing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const compartilhar = useCallback(
    async ({ id, titulo }: CompartilharReceitaParams) => {
      if (!id) {
        Alert.alert("Erro", "Receita inválida para compartilhamento.");
        return;
      }

      setIsSharing(true);
      setError(null);

      try {
        const receitaPublica = await tornarReceitaPublica(id);

        if (!receitaPublica) {
          const mensagemErro =
            "Não foi possível gerar o link de compartilhamento.";
          setError(mensagemErro);
          Alert.alert("Erro", mensagemErro);
          return;
        }

        const deepLink = `quasechef://detalhe_receita?id=${id}`;

        const message =
          `Olha essa receita de ${titulo} que fiz no Quase Chef! 🍳\n\n` +
          `Veja os ingredientes e o passo a passo completo clicando no link abaixo:\n` +
          `${deepLink}`;

        await Share.share({
          title: `Receita: ${titulo}`,
          message,
        });
      } catch (exception) {
        console.error("❌ Erro ao compartilhar receita:", exception);

        const mensagemErro =
          "Ocorreu um erro ao tentar compartilhar a receita.";
        setError(mensagemErro);
        Alert.alert("Erro", mensagemErro);
      } finally {
        setIsSharing(false);
      }
    },
    [],
  );

  return {
    compartilhar,
    isSharing,
    error,
  };
}
