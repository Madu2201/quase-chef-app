import { Text } from "react-native";

// Meus imports
import { AUTH_LEGAL } from "../styles/global_styles";
import type { AuthLegalNoticeProps } from "../types/components";

export function AuthLegalNotice({
  prefixText = "Ao continuar, você aceita nossos",
}: AuthLegalNoticeProps) {
  return (
    <Text style={AUTH_LEGAL.legalText}>
      {prefixText} <Text style={AUTH_LEGAL.linkUnderline}>Termos de Serviço</Text> e <Text style={AUTH_LEGAL.linkUnderline}>Política de Privacidade</Text>.
    </Text>
  );
}