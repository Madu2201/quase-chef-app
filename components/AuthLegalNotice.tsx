import { Text } from "react-native";
import { AUTH_LEGAL } from "../styles/global_styles";

type AuthLegalNoticeProps = {
  prefixText?: string;
};

export function AuthLegalNotice({
  prefixText = "Ao continuar, você aceita nossos",
}: AuthLegalNoticeProps) {
  return (
    <Text style={AUTH_LEGAL.legalText}>
      {prefixText} <Text style={AUTH_LEGAL.linkUnderline}>Termos de Serviço</Text> e <Text style={AUTH_LEGAL.linkUnderline}>Política de Privacidade</Text>.
    </Text>
  );
}
