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
├── (auth)/                    # Fluxo autenticação (pré-login)
├── (tabs)/                    # Fluxo principal (pós-login)
├── index.tsx                  # Redirecionamento (auth vs tabs)
assets/
└── images/                   # Imagens estáticas
components/                   # Componentes reutilizáveis
constants/                    # Constantes centralizadas
hooks/                        # Hooks customizados
services/                     # Lógica de backend
styles/                       # Estilos por tela e global
types/                        # Tipos TypeScript centralizados
utils/                        # Funções auxiliares
```

## 👥 Equipe

| Integrante                  | Papel                   | Contribuições                                                                                                        |
| --------------------------- | ----------------------- | -------------------------------------------------------------------------------------------------------------------- |
| **Maria Eduarda Almeida**   | Coordenação + Front-End | Estrutura de pastas, telas principais (Login, Home, Favoritos, Despensa, Lista), centralização de estilos            |
| **Marcus Vinicius**         | Back-End                | Supabase, autenticação, APIs (Gemini/Pollinations.ai), edição de perfil                                              |
| **Kauã de Almeida**         | Backend + Prototipagem  | Protótipo Figma, scraper de receitas, lógica de metas e compras inteligentes                                         |
| **Maria Eduarda Rodrigues** | Front-End               | Cadastro com validação, tela de perfil e preferências alimentares, receitas, telas de IA, ajustes de rotas do perfil |

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
- Compartilhamento de receitas via link do app
- Exportar lista de compras em PDF
- 💾 Sincronização local com AsyncStorage
