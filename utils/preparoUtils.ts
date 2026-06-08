// Meus imports
import type { AbatimentoResultado } from "../types/despensa";
import type { PreparoReceitaParams } from "../types/preparo_receita";
import type { Recipe } from "../types/receitas";
import { criarReceitaIA } from "./receitaIAUtils";

//Cria objeto Recipe para receitas de IA no contexto de preparo
export const criarReceitaIAParaPreparo = (
  params: PreparoReceitaParams,
): Recipe => {
  return criarReceitaIA({
    id: params.id,
    titulo: params.titulo,
    time: params.time,
    difficulty: params.difficulty,
    description: params.description,
    imagem: params.imagem,
    calories: params.calories,
    rawIngredients: params.rawIngredients,
    rawSteps: params.rawSteps || params.passosJson,
    preferences: params.preferencias,
    recipeAllergies: params.alergias,
  });
};

//Formata mensagem de abatimento com detalhes dos ingredientes abatidos e ignorados
export const formatarMensagemAbatimento = (
  resultado: AbatimentoResultado,
): string => {
  const mensagemBase = `${resultado.abatidos} ingrediente(s) abatido(s)`;

  if (!resultado.ignoradosDetalhes.length) {
    return mensagemBase;
  }

  const agrupados = resultado.ignoradosDetalhes.reduce(
    (acc, item) => {
      acc[item.motivo] = acc[item.motivo] ?? [];
      acc[item.motivo].push(item);
      return acc;
    },
    {} as Record<AbatimentoResultado['ignoradosDetalhes'][number]['motivo'], typeof resultado.ignoradosDetalhes>,
  );

  const descricoes: string[] = [];

  if (agrupados.incompativel?.length) {
    descricoes.push(
      `${agrupados.incompativel.length} com unidades incompatíveis:\n` +
        agrupados.incompativel
          .map((i) => `• ${i.nome}${i.detalhes ? ` (${i.detalhes})` : ''}`)
          .join('\n'),
    );
  }

  if (agrupados.nao_encontrado?.length) {
    descricoes.push(
      `${agrupados.nao_encontrado.length} não encontrados na despensa:\n` +
        agrupados.nao_encontrado.map((i) => `• ${i.nome}`).join('\n'),
    );
  }

  if (agrupados.baixa_confianca?.length) {
    descricoes.push(`${agrupados.baixa_confianca.length} com baixa confiança`);
  }

  if (agrupados.livre?.length) {
    descricoes.push(`${agrupados.livre.length} da lista de ingredientes livres`);
  }

  return `${mensagemBase}\n\n⚠️ Ignorados:\n${descricoes.join('\n\n')}`;
};

// Processa parâmetros da rota para o formato estruturado
export const processarParamsPreparo = (params: any): PreparoReceitaParams => {
  return {
    id: params.id as string,
    titulo: params.titulo as string,
    imagem: Array.isArray(params.imagem)
      ? params.imagem[0]
      : (params.imagem as string),
    time: params.time as string,
    difficulty: params.difficulty as string,
    calories: params.calories as string,
    description: params.description as string,
    rawIngredients: params.rawIngredients as string,
    rawSteps: (params.rawSteps as string) || (params.passosJson as string),
    passosJson: params.passosJson as string,
    preferencias: params.preferencias
      ? JSON.parse(params.preferencias as string)
      : [],
    alergias: params.alergias ? JSON.parse(params.alergias as string) : [],
    tipo: params.tipo as string,
  };
};