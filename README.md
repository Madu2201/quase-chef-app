# 📱 Quase Chef - App de Receitas EM ANDAMENTO

**Quase Chef** é um aplicativo mobile inteligente de receitas sendo desenvolvido em React Native com Expo.

## 🛠️ Tecnologias Utilizadas

**Framework – React Native + Expo**
- Base do app, permite criar aplicações móveis multiplataforma com JavaScript/TypeScript. O Expo simplifica o desenvolvimento e fornece ferramentas prontas.

**Linguagem – TypeScript**
- Adiciona tipagem estática ao JavaScript, trazendo mais segurança e produtividade no desenvolvimento.

**UI/Estilização – Lucide React Native (ícones)**
- Biblioteca de ícones modernos e leves para compor a interface do app.

**Tipografia – Google Fonts (Plus Jakarta Sans)**
- Fonte personalizada para dar identidade visual ao aplicativo.

**Navegação – React Navigation (Bottom Tabs + Stack Navigator)** 
- Gerencia a navegação entre telas, com suporte a abas inferiores e pilhas de navegação.

**Armazenamento Local – Async Storage**
- Permite salvar dados simples no dispositivo, como favoritos ou preferências do usuário.

**APIs Externas – Gemini (IA generativa), TheMealDB (receitas)**
- Gemini fornece inteligência artificial para sugerir receitas; TheMealDB oferece um banco de dados de receitas.

**Gestos e Interações – React Native Gesture Handler** 
- Controla gestos complexos (arrastar, deslizar, toques múltiplos) com alta performance.

**Safe Area – React Native Safe Area Context**  
- Garante que o conteúdo respeite áreas seguras da tela (notch, status bar).

**Gerenciamento de Telas – React Native Screens**
- Otimiza a renderização e desempenho das telas nativas.

**Web Support – React Native Web**
- Permite rodar o app também no navegador, usando os mesmos componentes.

**Animações – React Native Reanimated**
- Permite criar animações complexas e interativas, como transições e efeitos visuais.

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

## 🗄️ Banco de Dados EM ANDAMENTO

- **Supabase** - Banco de dados PostgreSQL com autenticação, regras de segurança e funções serverless. (Conexão no arquivo `src/services/supabase.ts`)

## 🚀 Como Rodar

### Passo a Passo:

1. **Instale as dependências:**

   ```bash
   npm install
   ```

2. **Instale o Cliente do Supabase (caso ainda não tenha):**

   ```bash
   npm install @supabase/supabase-js
   ```

3. **Inicie o servidor de desenvolvimento:**

   ```bash
   npx expo start
   ```

4. **Escolha a opção de teste:**
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

## 📂 Estrutura do Projeto EM ANDAMENTO
