import { Ingredient } from "../types/despensa";
import { CompraItem } from "../types/lista";
import { converterParaUnidadeBase } from "./normalization";

export type UpsertAction = "INSERT" | "UPDATE" | "UPDATE_COM_AVISO";

export interface UpsertDecision {
  acao: UpsertAction;
  novoValor: number;
  unidadeFinal: string;
}

/**
 * Lógica matemática pura e isolada que decide como um item comprado deve ser mesclado (ou criado) na despensa.
 * Sem efeitos colaterais. Retorna apenas a decisão do que deve ser feito.
 */
export function calcularUpsertDecision(
  itemComprado: CompraItem,
  itemDespensa: Ingredient | undefined,
): UpsertDecision {
  // 1. Não existe na despensa? Cria um novo.
  if (!itemDespensa) {
    return {
      acao: "INSERT",
      novoValor: Number(itemComprado.quantidade_comprar) || 0,
      unidadeFinal: itemComprado.unidade,
    };
  }

  // 2. Existe na despensa. Vamos tentar mesclar.
  const qtdComprada = Number(itemComprado.quantidade_comprar) || 0;
  const qtdAtual = Number(itemDespensa.qty) || 0;

  // Se as unidades forem idênticas (ex: un e un)
  if (
    itemComprado.unidade.toLowerCase().trim() ===
    itemDespensa.unit.toLowerCase().trim()
  ) {
    return {
      acao: "UPDATE",
      novoValor: qtdAtual + qtdComprada,
      unidadeFinal: itemDespensa.unit,
    };
  }

  // Unidades diferentes: vamos tentar converter para a base (ex: kg e g viram g)
  const baseComprado = converterParaUnidadeBase(
    qtdComprada,
    itemComprado.unidade,
  );
  const baseAtual = converterParaUnidadeBase(qtdAtual, itemDespensa.unit);

  // Se pertencem à mesma família (ambos viraram gramas ou ambos viraram ml)
  if (baseComprado.unidadeBase === baseAtual.unidadeBase) {
    return {
      acao: "UPDATE",
      novoValor: baseAtual.valor + baseComprado.valor,
      unidadeFinal: baseAtual.unidadeBase, // Salva padronizado (como 'g' ou 'ml')
    };
  }

  // Fallback: Se o usuário misturar grandezas incompatíveis (Ex: "kg" com "unidade").
  // Somamos os valores brutos e mantemos a unidade do estoque por segurança.
  return {
    acao: "UPDATE_COM_AVISO",
    novoValor: qtdAtual + qtdComprada,
    unidadeFinal: itemDespensa.unit,
  };
}
