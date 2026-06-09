// Mensagens padrão da aplicação
export const MESSAGES = {
    // --- Validação de Formulário de Cadastro ---
    VALIDATION_NAME: "O nome deve ter entre 3 e 50 caracteres.",
    VALIDATION_EMAIL: "Por favor, insira um e-mail válido.",
    VALIDATION_PASSWORD: "A senha não cumpre os requisitos de segurança.",
    VALIDATION_PASSWORD_MATCH: "As senhas digitadas não são iguais.",

    // --- Autenticação e Erros de Conta ---
    ERROR_CREATE_ACCOUNT: "Não foi possível criar a sua conta. Tente novamente.",
    ERROR_CONNECTION: "Erro de ligação. Verifique a sua internet.",
    ERROR_USER_NOT_IDENTIFIED: "Utilizador não identificado.",
    SUCCESS_PROFILE_SAVED: "Dados do perfil guardados com sucesso!",

    // --- Mensagens de Conexão Offline ---
    DEFAULT_OFFLINE_ACTION: "Reconecte-se à internet para usar esta função.",
    OFFLINE_CREATE_ACCOUNT: "Reconecte-se à internet para criar a sua conta.",
    OFFLINE_LOGIN: "Reconecte-se para entrar na sua conta.",
    OFFLINE_UPDATE_PROFILE: "Reconecte-se para atualizar o seu perfil.",
    OFFLINE_SAVE_PREFERENCES: "Reconecte-se para guardar as suas preferências alimentares.",
    OFFLINE_SHARE_RECIPE: "Reconecte-se para partilhar esta receita.",

    // --- Mensagens de Partilha ---
    SHARE_RECIPE_PREFIX: "Olha esta receita de",
    SHARE_RECIPE_TITLE: "Receita",
    SHARE_RECIPE_SUFFIX: "que fiz no Quase Chef! 🍳\n\nVê os ingredientes e o passo a passo completo clicando no link abaixo:",

    // --- Preferências Alimentares ---
    SUCCESS_PREFERENCES_SAVED: "Preferências alimentares atualizadas!",
    ERROR_SAVE_PREFERENCES: "Falha ao guardar preferências na base de dados.",
    ERROR_UPDATE_PROFILE: "Falha ao atualizar o perfil.",

    // --- Erros de Partilha ---
    ERROR_INVALID_RECIPE: "Receita inválida para partilha.",
    ERROR_SHARE_LINK_GENERATION: "Não foi possível gerar o link de partilha.",
    ERROR_SHARE_RECIPE: "Ocorreu um erro ao tentar partilhar a receita.",

    // --- Mensagens de Erro de IA ---
    IA_ERROR_RATE_LIMIT_TITLE: "Muita gente na cozinha! 👨‍🍳",
    IA_ERROR_RATE_LIMIT_MESSAGE: "A nossa IA está a preparar muitos pratos ao mesmo tempo. Que tal dares uma vista de olhos no nosso catálogo enquanto ela termina?",

    IA_ERROR_AUTH_TITLE: "Eita, faltou um ingrediente técnico! 🔧",
    IA_ERROR_AUTH_MESSAGE: "Tivemos um probleminha de ligação com o nosso assistente. Enquanto resolvemos isso, podes conferir as opções do catálogo.",

    IA_ERROR_SERVER_TITLE: "Servidores lotados! 🥵",
    IA_ERROR_SERVER_MESSAGE: "O nosso assistente de cozinha recebeu mais pedidos do que consegue aguentar agora. Vamos espreitar as receitas prontas do catálogo?",

    IA_ERROR_NETWORK_TITLE: "Sem sinal na cozinha? 🌐",
    IA_ERROR_NETWORK_MESSAGE: "A tua internet parece ter oscilado. Verifica a tua ligação ou aproveita para ver o catálogo.",

    IA_ERROR_GENERIC_TITLE: "A receita desandou! 🍳",
    IA_ERROR_GENERIC_MESSAGE: "Não conseguimos criar a tua receita personalizada desta vez. Enquanto limpamos a bancada, que tal escolheres uma opção do catálogo?",

    IA_ERROR_BUTTON_CATALOG: "Ver Catálogo",
    IA_ERROR_BUTTON_OK: "OK",
    IA_NO_INGREDIENTS: "Seleciona pelo menos um ingrediente!",

    // --- Mensagens de Carregamento de Receita ---
    OFFLINE_LOAD_RECIPE: "Você está sem internet. Reconecte-se para carregar esta receita.",
    ERROR_LOAD_RECIPE: "Não foi possível carregar esta receita agora. Tente novamente.",

    // --- Mensagens de Despensa (Offline) ---
    OFFLINE_ADD_INGREDIENT: "Reconecte-se para adicionar itens à despensa.",
    OFFLINE_UPDATE_INGREDIENT: "Reconecte-se para atualizar itens da despensa.",
    OFFLINE_REMOVE_INGREDIENT: "Reconecte-se para remover itens da despensa.",
    OFFLINE_EDIT_INGREDIENT: "Reconecte-se para editar a despensa.",
    OFFLINE_SAVE_INGREDIENT_STOCK: "Reconecte-se para guardar itens na despensa.",

    // --- Mensagens de Despensa (Validação) ---
    VALIDATION_INGREDIENT_EMPTY: "Preencha o nome, a quantidade atual e a meta.",
    VALIDATION_INGREDIENT_QUANTITY: "Quantidade deve ser um número entre 0 e 99999.",
    VALIDATION_INGREDIENT_FIELDS: "Nenhum campo pode ficar vazio.",
    VALIDATION_INGREDIENT_ZERO_QTY: "Você não pode selecionar itens com quantidade zero para gerar receitas.",

    // --- Mensagens de Despensa (Diálogos/Alertas) ---
    ALERT_INGREDIENT_EXHAUSTED_TITLE: "Ingrediente Esgotado",
    DIALOG_META_TITLE: "O que é a Meta?",
    DIALOG_META_MESSAGE: "É a quantidade que você sempre quer ter na despensa (ex: 5kg de Arroz). Nossa IA usará isso para gerar sua Lista de Compras automaticamente quando o estoque baixar!",

    // --- Mensagens de Despensa (Erros) ---
    ERROR_INGREDIENT_GENERIC: "Erro",
    ERROR_REMOVE_INGREDIENT: "Não foi possível remover o ingrediente.",
    ERROR_ADD_INGREDIENT: "Falha ao adicionar ingrediente.",
    ERROR_SAVE_INGREDIENT: "Falha ao salvar as edições do ingrediente.",

    // --- Genéricas ---
    ALERT_ATTENTION: "Atenção",
    BUTTON_CANCEL: "Cancelar",
    BUTTON_SAVE: "Guardar",
    LABEL_ERROR: "Erro",
    LABEL_SUCCESS: "Sucesso",

    // --- Mensagens de Lista de Compras (Validação) ---
    VALIDATION_LIST_ITEM_EMPTY: "Preencha nome e quantidade.",
    VALIDATION_LIST_QUANTITY_INVALID: "Quantidade inválida.",
    VALIDATION_LIST_QUANTITY_ZERO: "A quantidade deve ser maior que zero. Se deseja remover o item, utilize o ícone de lixeira.",
    VALIDATION_LIST_NO_ITEMS: "Nenhum item marcado como comprado para guardar.",

    // --- Mensagens de Lista de Compras (Offline) ---
    OFFLINE_EDIT_LIST: "Reconecte-se para editar sua lista de compras.",
    OFFLINE_UPDATE_LIST: "Reconecte-se para atualizar sua lista de compras.",
    OFFLINE_GENERATE_LIST: "Reconecte-se para gerar a lista a partir da despensa.",
    OFFLINE_CLEAR_LIST: "Reconecte-se para limpar sua lista de compras.",
    OFFLINE_SAVE_LIST_STOCK: "Reconecte-se para guardar os itens comprados na despensa.",

    // --- Mensagens de Lista de Compras (Diálogos) ---
    DIALOG_SAVE_STOCK_TITLE: "Guardar no Estoque",
    DIALOG_LIST_EMPTY_TITLE: "Lista vazia",
    DIALOG_LIST_EMPTY_MESSAGE: "Adicione itens antes de compartilhar.",
    DIALOG_STOCK_ALL_OK_TITLE: "Sucesso!",
    DIALOG_STOCK_PARTIAL_TITLE: "Parcialmente guardado",
    DIALOG_STOCK_ERROR_TITLE: "Ops",
    DIALOG_STOCK_ERROR_MESSAGE: "Não foi possível guardar os itens. Verifique se as unidades são compatíveis.",
    DIALOG_GENERATE_LIST_TITLE: "Tudo em dia!",
    DIALOG_GENERATE_LIST_MESSAGE: "Seu estoque está conforme as metas.",
    DIALOG_GENERATE_LIST_SUCCESS_TITLE: "Pronto!",
    DIALOG_GENERATE_LIST_SUCCESS_MESSAGE: "Sua lista foi atualizada com os itens faltantes.",

    // --- Mensagens de Lista de Compras (Erros) ---
    ERROR_ADD_LIST_ITEM: "Erro ao adicionar",
    ERROR_GENERATE_LIST: "Erro ao gerar",
    ERROR_GENERATE_LIST_FAILED: "Falha ao atualizar a lista.",
    ERROR_SHARE_LIST: "Erro ao compartilhar",

    // --- Mensagens de Lista de Compras (Info) ---
    INFO_ITEM_UPDATED: "atualizada para",
    INFO_SAVE_STOCK_SINGULAR: "item guardado",
    INFO_SAVE_STOCK_PLURAL: "itens guardados",
    INFO_SAVE_STOCK_PARTIAL_ITEM: "item",
    INFO_SAVE_STOCK_PARTIAL_ITEMS: "itens",

    // --- Mensagens de Favoritos ---
    OFFLINE_FAVORITE_RECIPE: "Reconecte-se para favoritar esta receita.",

    // --- Mensagens de Preparo de Receita ---
    OFFLINE_OPEN_RECIPE: "Reconecte-se para abrir esta receita.",

    // --- Mensagens de IA (Geração) ---
    OFFLINE_GENERATE_IA_RECIPE: "Reconecte-se para gerar uma receita com IA.",

    // --- Mensagens de Catálogo/Receitas ---
    OFFLINE_UPDATE_CATALOG: "Reconecte-se para atualizar o catálogo de receitas.",
};