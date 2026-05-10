import { DeviceEventEmitter } from "react-native";

/** Disparado após alterações no catálogo `receitas` (ex.: salvar IA nos favoritos). */
export const RECEITAS_CATALOGO_ATUALIZAR = "quasechef/receitas_catalogo_atualizar";

export function solicitarAtualizacaoCatalogoReceitas() {
  DeviceEventEmitter.emit(RECEITAS_CATALOGO_ATUALIZAR);
}
