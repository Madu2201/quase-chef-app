import { Redirect } from "expo-router";

// Serve para redirecionar o usuário para a tela de carregamento de autenticação, onde ele pode verificar se o usuário já está autenticado ou não. Se o usuário estiver autenticado, ele será redirecionado para a tela principal do aplicativo, caso contrário, ele será redirecionado para a tela de login.
export default function Index() {
  return <Redirect href="/(auth)/loading" />;
}