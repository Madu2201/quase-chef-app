# 🍳 Quase Chef App

**Quase Chef** é um aplicativo mobile inteligente de receitas sendo desenvolvido em **React Native** com **Expo SDK 55** e **TypeScript**. 
---

## 🚀 Tecnologias

- [Expo](https://expo.dev/) (SDK 55)
- [React Native](https://reactnative.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Expo Router](https://expo.github.io/router/) (estrutura `app/`)
- [Supabase](https://supabase.com/) (backend e autenticação)
- [Lucide React Native](https://lucide.dev/) (ícones)
- [Expo Font](https://docs.expo.dev/versions/latest/sdk/font/) + Google Fonts (Plus Jakarta Sans)
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/) (animações)
- AsyncStorage para persistência local

---

## 📂 Estrutura de pastas

```bash
app/
 ├── (auth)/                # Fluxo sem navegação (pré-login)
 │    ├── loading.tsx       # Tela de carregamento
 │    ├── login.tsx         # Tela de login
 │    ├── cadastro.tsx      # Tela de cadastro
 │    ├── esqueci-senha.tsx # Tela de recuperação de senha
 │    └── _layout.tsx       # Layout simples (sem tabs)
 │
 ├── (tabs)/                # Fluxo com navegação por abas (pós-login)
 │    ├── home.tsx          # Tela principal
 │    ├── perfil.tsx        # Tela de perfil
 │    └── _layout.tsx       # Layout com Tab.Navigator
 │
 └── _layout.tsx            # Decide se mostra (auth) ou (tabs)

assets/               # Imagens e ícones
components/           # Componentes reutilizáveis
hooks/                # Hooks customizados
services/             # API, Supabase, Gemini
utils/                # Tema, constantes, helpers
styles/               # Estilos globais
```

---

## ⚙️ Instalação

```bash
# Instalar dependências
npm install

# Rodar o projeto
npx expo start

🛠️ Configuração extra
Babel: adicionar plugin do Reanimated em babel.config.js

js
plugins: ['react-native-reanimated/plugin']
TypeScript: já configurado com tsconfig.json e alias @/*.

🎨 Tema
O app usa uma paleta personalizada definida em utils/theme.ts:

Cores principais: primary, secondary, background

Fontes: Plus Jakarta Sans (Regular, Medium, Bold)

Tokens: tamanhos de fonte, espaçamentos, bordas e sombras

🧑‍💻 Comandos úteis
bash
# Limpar cache do Expo
npx expo start --clear

# Instalar nova dependência
npm install <pacote>

# Atualizar dependências
npm update

# Rodar no Android
npm run android

# Rodar no iOS (MacOS)
npm run ios

# Rodar no Web
npm run web

# Verificar tipos TypeScript
npx tsc --noEmit