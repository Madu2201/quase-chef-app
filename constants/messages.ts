// Mensagens padrão da aplicação
export const MESSAGES = {
    // Mensagens de conexão offline
    DEFAULT_OFFLINE_ACTION: "Reconecte-se a internet para usar esta função.",
    OFFLINE_CREATE_ACCOUNT: "Reconecte-se à internet para criar sua conta.",
    OFFLINE_LOGIN: "Reconecte-se para entrar na sua conta.",
    OFFLINE_UPDATE_PROFILE: "Reconecte-se para atualizar seu perfil.",
    OFFLINE_SAVE_PREFERENCES: "Reconecte-se para salvar suas preferências alimentares.",
    OFFLINE_SHARE_RECIPE: "Reconecte-se para compartilhar esta receita.",

    // Mensagens de compartilhamento
    SHARE_RECIPE_PREFIX: "Olha essa receita de",
    SHARE_RECIPE_TITLE: "Receita",
    SHARE_RECIPE_SUFFIX: "que fiz no Quase Chef! 🍳\n\nVeja os ingredientes e o passo a passo completo clicando no link abaixo:",

    // Feedback ao usuário
    SUCCESS_PREFERENCES_SAVED: "Preferências alimentares atualizadas!",
    SUCCESS_PROFILE_SAVED: "Dados do perfil salvos!",

    ERROR_SAVE_PREFERENCES: "Falha ao salvar preferências no banco de dados.",
    ERROR_UPDATE_PROFILE: "Falha ao atualizar perfil.",
    ERROR_USER_NOT_IDENTIFIED: "Usuário não identificado.",
    ERROR_INVALID_RECIPE: "Receita inválida para compartilhamento.",
    ERROR_SHARE_LINK_GENERATION: "Não foi possível gerar o link de compartilhamento.",
    ERROR_SHARE_RECIPE: "Ocorreu um erro ao tentar compartilhar a receita.",

    // Mensagens de erro de IA
    IA_ERROR_RATE_LIMIT_TITLE: "Muita gente na cozinha! 👨‍🍳",
    IA_ERROR_RATE_LIMIT_MESSAGE: "A nossa IA está preparando muitos pratos ao mesmo tempo. Que tal dar uma olhada no nosso catálogo de receitas enquanto ela termina?",
    
    IA_ERROR_AUTH_TITLE: "Eita, faltou um ingrediente técnico! 🔧",
    IA_ERROR_AUTH_MESSAGE: "Tivemos um probleminha de conexão com o nosso assistente. Enquanto resolvemos isso, você pode conferir as opções do catálogo.",
    
    IA_ERROR_SERVER_TITLE: "Servidores lotados! 🥵",
    IA_ERROR_SERVER_MESSAGE: "Nosso assistente de cozinha recebeu mais pedidos do que consegue aguentar agora. Bora dar uma olhada nas receitas prontas do catálogo?",
    
    IA_ERROR_NETWORK_TITLE: "Sem sinal na cozinha? 🌐",
    IA_ERROR_NETWORK_MESSAGE: "Sua internet parece ter dado uma oscilada. Verifique sua conexão ou aproveite para olhar nosso catálogo de receitas.",
    
    IA_ERROR_GENERIC_TITLE: "A receita desandou! 🍳",
    IA_ERROR_GENERIC_MESSAGE: "Não conseguimos criar sua receita personalizada dessa vez. Enquanto limpamos a bancada, que tal escolher uma opção do nosso catálogo?",

    IA_ERROR_BUTTON_CATALOG: "Ver Catálogo",
    IA_ERROR_BUTTON_OK: "OK",
    IA_NO_INGREDIENTS: "Selecione pelo menos um ingrediente!",
};