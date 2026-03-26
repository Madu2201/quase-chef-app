# 🍳 Quase Chef App

Quase Chef é um aplicativo mobile inteligente de receitas desenvolvido em **React Native** com **Expo SDK 55 e TypeScript**.

## 🚀 Tecnologias

- [Expo](https://expo.dev/) (SDK 55)
- [React Native](https://reactnative.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Expo Router](https://expo.github.io/router/) (estrutura `app/`)
- [Supabase](https://supabase.com/) (backend e autenticação)
- [Lucide React Native](https://lucide.dev/) (ícones)
- [Expo Font](https://docs.expo.dev/versions/latest/sdk/font/) + Google Fonts (Plus Jakarta Sans)
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/) (animações)
- Expo Sharing para compartilhar arquivos (exportar e importar)
- Expo Print para imprimir lista de compras
- AsyncStorage para persistência local

## 📂 Estrutura de Pastas

```bash
app/
├── (auth)/                 # Fluxo de autenticação (pré-login)
│   ├── loading.tsx         # Tela de carregamento inicial
│   ├── login.tsx           # Tela de login
│   ├── cadastro.tsx        # Tela de cadastro
│   ├── esqueci-senha.tsx   # Tela de recuperação de senha
│   └── _layout.tsx         # Layout simples sem tabs
│
├── (tabs)/                 # Fluxo principal com navegação por abas (pós-login)
│   ├── home.tsx            # Tela inicial (Home)
│   ├── receitas.tsx        # Tela de receitas
│   ├── favoritos.tsx       # Tela de favoritos
│   ├── dispensa.tsx        # Tela de dispensa
│   ├── lista.tsx          # Tela de listas
│   └── _layout.tsx         # Layout com Tab.Navigator (somente Home e Receitas)
│
├── perfil/                 # Tela secundária fora das tabs
│   └── index.tsx           # Tela de perfil
│
├── _layout.tsx             # Layout raiz (envolve tudo)
└── index.tsx               # Decide se mostra (auth) ou (tabs)

assets/ # Imagens e ícones
components/ # Componentes reutilizáveis (ex: header.tsx)
constants/ # Temas e constantes
hooks/ # Hooks customizados (ex: useDispensa.ts, useFavoritos.ts etc )
services/ # API, Supabase, Gemini
styles/ # Estilos
```

## 📖 Explicação dos fluxos

### (auth) → Fluxo de autenticação (pré-login)

- Telas: **login**, **cadastro**, **esqueci-senha** e **loading**.
- Não possuem navegação por abas(na parte inferior).
- Após login/cadastro bem-sucedido, o usuário é redirecionado para `/(tabs)/home`.

### (tabs) → Fluxo principal com navegação inferior (pós-login)

- Contém apenas **Home** e **Receitas** na barra inferior.
- O **Perfil** não aparece na barra, sendo acessado apenas pelo botão no header.
- O layout é definido em `app/(tabs)/_layout.tsx` usando `Tabs`.

### perfil → Tela secundária fora das tabs

- Aberta via botão de perfil no header.
- O botão de voltar pode ser:
  - **Automático** → quando a tela é aberta com `router.push`.
  - **Customizado** → usando `router.replace("/(tabs)/home")` para garantir retorno direto à Home.

### index.tsx → Decisor de fluxo
- Localizado na raiz de `app/`.
- Verifica se o usuário está autenticado.
- Redireciona para:
  - `/(auth)/login` se não houver sessão.
  - `/(tabs)/home` se o usuário já estiver logado.

## ⚙️ Instalação

```bash
# Instalar dependências
npm install

# Rodar o projeto
npx expo start

# Rodar no Web
npm run web

# Limpar cache do Expo
npx expo start --clear

```

## 🎨 Tema

- O app usa uma paleta personalizada definida em constantes/theme.ts:

- Fontes: Plus Jakarta Sans (Regular, Medium, Bold)

- Tokens: tamanhos de fonte, espaçamentos, bordas e sombras

## ✅ Resumo

- Fluxo (auth) → login/cadastro/esqueci senha.
- Fluxo (tabs) → navegação principal com Home e Receitas.
- Fluxo (perfil) → tela secundária fora das tabs ecessada via header.

## 📝 Notas

- O fluxo fora das **tabs (perfil)** não entra na barra de navegação inferior e pode ser feito para outras telas.
- O botão de voltar pode ser automático **(router.push)** ou customizado **(router.replace("/(tabs)/home"))**.
