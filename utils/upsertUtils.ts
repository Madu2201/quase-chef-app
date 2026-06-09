// Meus imports
import { Ingredient } from "../types/despensa";
import { CompraItem, UpsertDecision } from "../types/lista";
import { converterParaUnidadeBase } from "./normalization";

// Calcula a decisão de upsert inteligente para um item de compra, considerando o item comprado e o estado atual do item na despensa
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

  if (baseComprado.unidadeBase === baseAtual.unidadeBase) {
    return {
      acao: "UPDATE",
      novoValor: baseAtual.valor + baseComprado.valor,
      unidadeFinal: baseAtual.unidadeBase,
    };
  }

  // Unidades incompatíveis (ex: un e g): não consegue converter, então avisa que vai atualizar mas mantém a unidade da despensa
  return {
    acao: "UPDATE_COM_AVISO",
    novoValor: qtdAtual + qtdComprada,
    unidadeFinal: itemDespensa.unit,
  };
}
