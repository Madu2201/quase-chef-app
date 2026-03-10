# 📱 Quase Chef - App de Receitas EM ANDAMENTO E PODE SER MUDADO

**Quase Chef** é um aplicativo mobile inteligente de receitas sendo desenvolvido em React Native com Expo.

### Principais Funcionalidades:

- ✅ **Autenticação de Usuários**
- ✅ **Feed de Receitas**
- ✅ **IA Inteligente**
- ✅ **Gerenciamento de Despensa**
- ✅ **Lista de Compras**
- ✅ **Receitas Favoritas**
- ✅ **Preparo Passo a Passo**
- ✅ **Perfil do Usuário**

## 🛠️ Tecnologias Utilizadas

- **Framework** React Native + Expo
- **Linguagem** TypeScript
- **UI/Estilização** Tailwind CSS / NativeWind, Lucide React Native (ícones)
- **Tipografia** Google Fonts (Plus Jakarta Sans)
- **Animações** React Native Reanimated 
- **Navegação** React Navigation (Bottom Tabs + Stack Navigator)
- **Autenticação & BD** Firebase Authentication + Firestore
- **Cache & Offline** AsyncStorage / MMKV 
- **APIs Externas** TheMealDB (receitas), OpenAI/Gemini (IA)


## 📱 Estrutura de Telas

### Descrição das Telas:

- **Login** - Autenticação de usuários existentes com email e senha
- **Cadastro** - Criação de novas contas de usuário
- **Início** - Feed principal com receitas pré-definidas e descoberta
- **IA** - Interface para sugestões inteligentes de receitas e substituições
- **Detalhe da Receita** - Visualização completa da receita (ingredientes, modo de preparo, dicas)
- **Preparo** - Guia passo a passo interativo para preparar a receita
- **Favoritos** - Coleção de receitas salvas pelo usuário
- **Dispensa** - Gerenciamento de ingredientes disponíveis em casa
- **Lista de Compras** - Organização e checklist de itens a comprar
- **Perfil** - Informações do usuário e configurações (logout, delete conta, etc.)

## 🗄️ Banco de Dados (Firestore)

O aplicativo utiliza **Google Cloud Firestore** para armazenar dados dos usuários e receitas:

- **Usuários**: Armazena informações sobre os usuários, como nome, email, senha, etc.
- **Receitas**: Armazena informações sobre as receitas, como nome, ingredientes, modo de preparo, etc.
- **Favoritos**: Armazena as receitas favoritas dos usuários.
- **Dispensa**: Armazena os ingredientes disponíveis em casa dos usuários.
- **Lista de Compras**: Armazena os itens a comprar dos usuários.
- **Perfil**: Armazena informações sobre o perfil do usuário, como nome, foto de perfil, etc.

## 🚀 Como Rodar

### Passo a Passo:

1. **Instale as dependências:**
   ```bash
   npm install
   ```

2. **Inicie o servidor de desenvolvimento:**
   ```bash
   npx expo start
   ```

3. **Escolha a opção de teste:**
   - Pressione **`w`** para abrir no navegador (web)
   - Pressione **`a`** para emulador Android
   - Pressione **`i`** para simulador iOS
   - Escaneie o **QR Code** com Expo Go (download grátis na App Store/Play Store) no seu celular

## ⌨️ Comandos Úteis

### Inicializar e Parar:

```bash

# Inicia e limpa o cache de bundler
npx expo start --clear

# Inicia diretamente no navegador (web)
npx expo start --web

# Para o servidor de desenvolvimento
Ctrl + C
```

## 📂 Estrutura do Projeto

```
quase-chef/
├── src/
│   ├── components/          # Componentes reutilizáveis
│   │   ├── Cabecalho.tsx
│   │   ├── CartaoReceita.tsx
│   │   ├── DicaSubstituicao.tsx
│   │   ├── ItemIngrediente.tsx
│   │   └── ItemLista.tsx
│   ├── screens/             # Telas principais
│   │   ├── LoginScreen.tsx
│   │   ├── CadastroScreen.tsx
│   │   ├── InicioScreen.tsx
│   │   ├── IAScreen.tsx
│   │   ├── DetalheReceitaScreen.tsx
│   │   ├── PreparoScreen.tsx
│   │   ├── FavoritosScreen.tsx
│   │   ├── DispensaScreen.tsx
│   │   ├── ListaComprasScreen.tsx
│   │   └── PerfilScreen.tsx
│   ├── navigation/          # Configuração de navegação
│   │   ├── NavegadorPilhas.tsx
│   │   └── AbasInferiores.tsx
│   ├── services/            # Serviços e integrações
│   │   ├── api.ts           # TheMealDB
│   │   ├── autenticacao.ts  # Firebase Auth
│   │   ├── banco.ts         # Firestore
│   │   └── ia.ts            # OpenAI/Gemini
│   ├── utils/               # Utilitários
│   │   ├── constantes.ts
│   │   ├── estilos.ts
│   │   └── hooks.ts
│   └── assets/              # Imagens, fontes, etc.
├── app.json                 # Configuração Expo
├── tsconfig.json            # Configuração TypeScript
├── tailwind.config.js       # Configuração Tailwind/NativeWind
├── package.json             # Dependências do projeto
└── README.md                # Descrição geral do projeto
```