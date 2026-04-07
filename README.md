# 🍳 Quase Chef App

Aplicativo mobile inteligente de receitas desenvolvido com **React Native** + **Expo SDK 55** + **TypeScript**.

## 🚀 Tecnologias Principais

| Tecnologia                  | Descrição                        |
| --------------------------- | -------------------------------- |
| **Expo**                    | SDK 55 - framework React Native  |
| **Supabase**                | Backend e autenticação           |
| **Expo Router**             | Navegação (file-based routing)   |
| **React Native Reanimated** | Animações e gestos               |
| **Lucide React Native**     | Ícones                           |
| **AsyncStorage**            | Persistência local               |
| **Expo Sharing & Print**    | Compartilhar e imprimir conteúdo |
| **Plus Jakarta Sans**       | Fonte personalizada              |

## 📂 Estrutura do Projeto

```
app/
├── (auth)/              # Fluxo autenticação (pré-login)
│   ├── loading.tsx
│   ├── login.tsx
│   ├── cadastro.tsx
│   ├── esqueci_senha.tsx
│   └── _layout.tsx
├── (tabs)/              # Fluxo principal (pós-login)
│   ├── home.tsx
│   ├── receitas.tsx
│   ├── favoritos.tsx
│   ├── dispensa.tsx
│   ├── lista.tsx
│   └── _layout.tsx (Home e Receitas no menu inferior)
├── perfil/              # Tela acessada via header
├── detalhe_receita.tsx
├── preparo_receita.tsx
├── selecao_ia.tsx
├── _layout.tsx          # Root layout
└── index.tsx            # Redirecionamento (auth vs tabs)

components/             # Componentes reutilizáveis
constants/              # Temas e configurações
hooks/                  # Hooks customizados
services/               # API, Supabase, Gemini
styles/                 # Estilos globais
utils/                  # Funções auxiliares
```

## 🔄 Fluxos de Navegação

### (auth) - Autenticação
- **Telas**: login, cadastro, esqueci_senha, loading
- Sem abas na parte inferior
- Redireciona para `/(tabs)/home` após sucesso

### (tabs) - Principal
- **Menu inferior**: Home e Receitas
- **Perfil**: Acessado via header (fora das abas)
- Redirecionamento: baseado em sessão do Supabase

### Telas Secundárias
- `detalhe_receita` - Detalhes da receita
- `preparo_receita` - Modo de preparo
- `selecao_ia` - Seleção de IA
- `perfil` - Perfil do usuário

## ⚙️ Instalação e Uso

```bash
# 1. Instalar as dependências do projeto
npm install

# 2. Corrigir e atualizar versões de pacotes do Expo (Recomendado)
# Digite "y" quando solicitado para confirmar as atualizações
npx expo install --check

# 3. Rodar o projeto em desenvolvimento (Gera o QR Code)
npx expo start

# 4. Rodar com túnel (Para testar no 4G ou redes diferentes)
npx expo start --tunnel

# 5. Limpar o cache e reiniciar o Metro Bundler
# Útil quando o app apresenta erros estranhos após instalar pacotes
npx expo start --clear

# 6. Rodar a versão para navegador
npx expo start --web
```

## 🎨 Tema e Estilos

- Paleta personalizada em `constants/theme.ts`
- Fonte: Plus Jakarta Sans (Regular, Medium, Bold)
- Design tokens: cores, espaçamentos, tamanhos de fonte, bordas

## 📝 Funcionalidades Principais

- 🔐 Autenticação com Supabase
- 📝 Gerenciamento de receitas
- ❤️ Sistema de favoritos
- 🛒 Lista de compras (imprimir/exportar)
- 📦 Controle de dispensa
- 🤖 Integração com Gemini (seleção de IA)
- 💾 Sincronização local com AsyncStorage
