# 🍳 Quase Chef App

Aplicativo mobile inteligente de receitas desenvolvido com **React Native** + **Expo SDK 55** + **TypeScript**.

O Quase Chef moderniza a gestão da cozinha doméstica através de um **Ciclo de Estoque Inteligente**: gerencia inventário com base em metas, gera listas de compras automáticas, atualiza estoque em tempo real e sugere receitas personalizadas com IA (Google Gemini) baseada nos ingredientes disponíveis.

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
│   ├── nova_senha.tsx
│   └── _layout.tsx
├── (tabs)/              # Fluxo principal (pós-login)
│   ├── home.tsx
│   ├── receitas.tsx
│   ├── favoritos.tsx
│   ├── despensa.tsx
│   ├── lista.tsx
│   └── _layout.tsx
├── perfil/              # Tela acessada via header no home
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

## 👥 Equipe

| Integrante                  | Papel                   | Contribuições                                                                                             |
| --------------------------- | ----------------------- | --------------------------------------------------------------------------------------------------------- |
| **Maria Eduarda Almeida**   | Coordenação + Front-End | Estrutura de pastas, telas principais (Login, Home, Favoritos, Despensa, Lista), centralização de estilos |
| **Marcus Vinicius**         | Back-End                | Supabase, autenticação, APIs (Gemini/Hugging Face), edição de perfil                                      |
| **Kauã de Almeida**         | Backend + Prototipagem  | Protótipo Figma, scraper de receitas, lógica de metas e compras inteligentes                              |
| **Maria Eduarda Rodrigues** | Front-End               | Cadastro com validação, perfil, receitas, telas de IA                                                     |

## 📝 Funcionalidades Principais

### 🍽️ Ciclo de Estoque Inteligente

- **Gerenciamento de Despensa**: Acompanha estoque em tempo real com metas personalizadas
- **Lista de Compras Automática**: Gera listas otimizadas cruzando despensa com metas
- **Reabastecimento Dinâmico**: Atualiza automaticamente saldos ao guardar compras
- **Baixa Automática**: Reduz automaticamente ingredientes ao preparar receitas

### 🤖 IA e Receitas

- **Geração com Gemini**: Receitas personalizadas baseadas em ingredientes da despensa
- **Motor de Refinamento**: Pipeline de dados (scraper → IA → estruturação)
- **Receitas Filtradas**: "Cozinhar com meu estoque" mostra receitas com ingredientes disponíveis
- **Dicas do Chef**: Sugestões de IA e substituições de ingredientes

### 👤 Autenticação e Perfil

- 🔐 Login/Cadastro com Supabase
- 📝 Gerenciamento de perfil com preferências alimentares e alergias
- 🔑 Recuperação de senha segura

### ❤️ Organização

- Favoritos de receitas
- Modo de preparo interativo com temporizador
- Exportar lista de compras em PDF
- 💾 Sincronização local com AsyncStorage
