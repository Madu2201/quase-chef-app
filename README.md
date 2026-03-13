# 📱 Quase Chef - App de Receitas EM ANDAMENTO E PODE SER MUDADO

**Quase Chef** é um aplicativo mobile inteligente de receitas sendo desenvolvido em React Native com Expo.

## 🛠️ Tecnologias Utilizadas

- **Framework** React Native + Expo
- **Linguagem** TypeScript
- **UI/Estilização** Tailwind CSS / NativeWind, Lucide React Native (ícones)
- **Tipografia** Google Fonts (Plus Jakarta Sans)
- **Animações** React Native Reanimated 
- **Navegação** React Navigation (Bottom Tabs + Stack Navigator)
- **Autenticação & BD** Firebase Authentication + Firestore
- **APIs Externas** TheMealDB (receitas), Gemini (IA)

## 📱 Estrutura de Telas

- **Login** - Autenticação de usuários existentes com email e senha
- **Cadastro** - Criação de novas contas de usuários
- **Esqueci minha senha** - Recuperação de senha para usuários existentes
- **Perfil** - Informações do usuário
- **Início** - Feed principal com filtros, gerar receita com IA e sugestões de rápidas
- **IA** - Interface para sugestões inteligentes de receitas com os itens disponíveis em casa
- **Receitas** - Tela principal de receitas pré-definidas, com filtros e busca, também podendo buscar pelos itens disponíveis na dispensa
- **Detalhe da Receita** - Visualização completa da receita e suas informações
- **Preparo** - Guia passo a passo para preparar a receita
- **Favoritos** - Coleção de receitas salvas pelo usuário
- **Dispensa** - Gerenciamento de ingredientes disponíveis em casa
- **Lista de Compras** - Organização e checklist de itens a comprar e comprados

## 🗄️ Banco de Dados (Firestore)

O aplicativo utiliza **Google Cloud Firestore** para armazenar dados dos usuários e receitas.

**EM ANDAMENTO**

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

## 📂 Estrutura do Projeto EM ANDAMENTO PODENDO MUDAR
