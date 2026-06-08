import { DeviceEventEmitter } from "react-native";

export const RECEITAS_CATALOGO_ATUALIZAR = "quasechef/receitas_catalogo_atualizar";

// Solicita uma atualização do catalogo de receitas, emitindo um evento que os componentes interessados podem escutar para atualizar seus dados
export function solicitarAtualizacaoCatalogoReceitas() {
  DeviceEventEmitter.emit(RECEITAS_CATALOGO_ATUALIZAR);
}
