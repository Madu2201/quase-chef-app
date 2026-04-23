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
│   ├── despensa.tsx
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
- 📦 Controle de despensa
- 🤖 Integração com Gemini (seleção de IA)
- 💾 Sincronização local com AsyncStorage

# 🧠 Smart Pantry — Fluxo de Uso e Proposta de Valor

## 📌 O que é isso?

O Smart Pantry é um **assistente inteligente de cozinha e compras**.

Ele conecta:
- 📦 Despensa (estoque atual)
- 🍳 Receitas (consumo)
- 🛒 Lista de Compras (reposição)

> 🔥 Você não gerencia listas. Você mantém seu estoque sempre completo.

---

## 🧑 Jornada do Usuário (Ciclo Completo)

### 1. 🏁 Montando a Despensa

O usuário cadastra itens e define metas:

- Arroz → 2kg (Meta: 5kg)
- Ovos → 12 un (Meta: 60 un)
- Mel → 1 frasco (Meta: 0)

📌 Itens com meta 0 não entram na reposição automática.

---

### 2. 🍳 Uso Diário (Automático)

Ao finalizar uma receita:

```ts
quantidade_atual -= quantidade_usada
```

**Exemplo:**

```ts
ovos: 12 → 8
arroz: 2kg → 1.5kg
```

---

### 3. 🪄 Gerar Lista Inteligente

Botão:

> **"Completar Estoque"**

Cálculo:

```ts
necessario = quantidade_ideal - quantidade_atual
```

**Exemplo:**

```ts
arroz: 5 - 1.5 = 3.5kg
ovos: 60 - 8 = 52 unidades
```

Regra:

```ts
if (quantidade_ideal > 0) {
  adicionar_item_lista(necessario)
}
```

---

### 4. 🛒 No Mercado

- Marcar itens com `Check ✅`
- Adicionar extras manualmente

---

### 5. 🔄 Atualização Pós-Compra

```ts
quantidade_atual += quantidade_comprada
limpar_lista()
```

---

## 🔁 Loop do Produto

```txt
Cadastrar → Consumir → Gerar Lista → Comprar → Atualizar → Repetir
```

---

## ⚙️ Estrutura de Dados

```ts
type Item = {
  nome: string
  quantidade_atual: number
  quantidade_ideal: number
}
```

---

## 🦸‍♂️ Valor para o Usuário

### 🧠 Redução de carga mental
- Não precisa lembrar o que falta
- Não precisa montar lista

### 💰 Economia
- Evita compras duplicadas
- Reduz desperdício

### ⏱️ Tempo
- Lista pronta em 1 clique

### 📊 Controle
- Visão total do estoque
- Ajuste dinâmico de consumo

---

## 🚀 Diferencial

Isso não é:

```txt
❌ Lista de compras
```

Isso é:

```txt
✅ Sistema inteligente de reposição
```

> 🧠 Um ERP de cozinha

---

## 🎯 Ideia Central

O usuário nunca mais precisa pensar:

```txt
"O que eu tenho?"
"O que falta?"
"O que comprar?"
```

O sistema resolve tudo.

---

## 🔥 Em uma frase

> Você cozinha. O app resolve o resto.
