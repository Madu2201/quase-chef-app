// Constantes de prompts para geração de receitas com IA
// Este arquivo centraliza os prompts grandes e complexos usados no sistema de geração de receitas

// Templates para blocos de segurança (alergias e preferências do usuário)
export const PROMPT_TEMPLATES = {
    BLOCO_ALERGIAS: (alergiasTexto: string): string => {
        return `SEGURANÇA — ALERGIAS DO USUÁRIO (BLACKLIST ABSOLUTA): ${alergiasTexto}. ` +
            `É PROIBIDO usar qualquer ingrediente ou derivado associado a estes alérgenos (incluindo óleo de amendoim, leite em pó, tofu/soja se alérgico a soja, etc.). ` +
            `O campo "alergias_presentes" no JSON deve listar apenas alérgenos que AINDA estejam presentes no prato final; se a receita for segura para o usuário, use [].`;
    },

    BLOCO_PREFERENCIAS: (preferenciasTexto: string): string => {
        return `PREFERÊNCIAS DO USUÁRIO (pelo menos UMA deve ser refletida no campo "preferencias" quando fizer sentido): ${preferenciasTexto}. ` +
            `Ex.: vegano OU sem_gluten — não é necessário atender todas simultaneamente; escolha o melhor encaixe para os ingredientes disponíveis.`;
    },

    BLOCO_ESTOQUE: (ingrediente: string, limite: number, unidade: string): string => {
        return (
            `- "${ingrediente}": DISPONÍVEL no máximo ${limite} ${unidade}. ` +
            `Na lista "ingredientes" do JSON, a "quantidade" deste item deve ser estritamente ≤ ${limite}. ` +
            `O campo "unidade" para este ingrediente deve ser exatamente "${unidade}" (mesma unidade da despensa; se o estoque está em unidades, não use gramas/ml para este item).`
        );
    },
} as const;

// Prompt principal para geração de receita com IA
// Este é um prompt altamente detalhado que define o comportamento e as regras para geração de receitas
export const PROMPT_GERAR_RECEITA_IA = (
    listaLivres: string,
    blocoPerfil: string,
    blocoEstoque: string,
): string => {
    return `Atue como um Chef de Cozinha profissional.

FONTES DE INGREDIENTES — É PROIBIDO inventar ou citar qualquer ingrediente que não esteja em uma destas duas fontes:
(1) Ingredientes selecionados pelo usuário (detalhados abaixo com estoque).
(2) Apenas nomes que existam na lista INGREDIENTES_LIVRES do sistema: ${listaLivres}.

Sobre INGREDIENTES_LIVRES:
- Trate sal, água, óleo e azeite como bases normalmente disponíveis.
- Os demais itens dessa lista (ex.: pimenta, açúcar) são OPCIONAIS: use só se combinar com a receita; não force o uso.
${blocoPerfil}
ESTOQUE DO USUÁRIO (teto máximo por item — a quantidade na receita NUNCA pode ultrapassar o disponível; pode ser menor):
${blocoEstoque}

REGRAS DE QUANTIDADE E UNIDADE:
- Para cada ingrediente da despensa, a quantidade sugerida na receita deve ser no máximo igual ao disponível e tipicamente uma parte dele (ex.: 500g de 4kg), nunca o total obrigatório nem um valor acima do estoque.
- Respeite fidelidade à unidade da despensa: se o item está em "un", use unidades na receita; não converta batatas em gramas se o estoque foi em unidades.
- Garanta que nenhuma linha de ingrediente implique falta no estoque do usuário (nada de quantidades > disponível).

REGRAS OBRIGATÓRIAS DE RESPOSTA (JSON WRAPPER COM DUAS CHAVES):

ESTRUTURA ESPERADA:
{
    "texto_da_receita": { ... campos de receita abaixo ... },
    "image_prompt": "... prompt em inglês para geração de imagem ..."
}

CAMPOS DA RECEITA (dentro de "texto_da_receita"):
1. nome_receita: Título da receita (Máximo 4 palavras).
2. tempo_preparo: Formato padrão colado (ex: "20min", "1h30min"). SEM ESPAÇOS.
3. dificuldade: Escolha entre "Fácil", "Média" ou "Difícil".
4. calorias: Estime o valor. RETORNE APENAS O NÚMERO E A SIGLA (ex: "500 kcal").
5. dica_rapida: Dica técnica curta e útil (OBRIGATÓRIO).
6. descricao_simples_preparo: Resumo TÉCNICO do preparo em 1 ou 2 frases. Evite tom de marketing.
7. pre_visualizacao_passos: Lista de strings com 3 a 5 passos NUMERADOS resumidos (OBRIGATÓRIO). Deve ser compatível com o passo a passo detalhado (visão geral).
8. ingredientes: Lista de objetos {
    "unidade": string,
    "nome_base": string (deve ser exatamente um dos ingredientes permitidos: selecionados ou da lista livre),
    "quantidade": number,
    "texto_original": string,
    "quantidade_gramas_ml": number (OBRIGATÓRIO. Este campo NUNCA deve ser nulo, vazio ou omitido. Ele é o motor de conversão do sistema. Siga estritamente estas regras:
    1. Se a receita indicar peso ou volume explícito (ex: "300g de arroz", "50ml de óleo"): preencha com o valor numérico puro em gramas ou ml (ex: 300.0, 50.0).
    2. Se a receita usar medidas caseiras ou volumes culinários (ex: "xícara", "colher", "copo"): Converta OBRIGATORIAMENTE para o peso/volume equivalente aproximado em gramas ou ml (ex: "1 xícara de arroz" vira 200.0; "2 xícaras de água" vira 480.0; "1 colher de sopa de açúcar" vira 15.0). JAMAIS use 0.0 para medidas caseiras.
    3. Se a receita pedir unidades físicas soltas ou itens a gosto (ex: "3 batatas", "1 dente de alho", "sal a gosto"): preencha ESTREITAMENTE com 0.0 para indicar que é um item contável. O valor 0.0 aqui NÃO exclui o ingrediente.
    * Formatação: JAMAIS retorne números com ponto final solto como '0.' ou '1.'. Use sempre o formato decimal completo como '0.0', '1.0' ou '250.0').
}.
9. passos_detalhados: Lista de objetos { "titulo": string, "descricao": string, "dica_do_chef": string, "tempo_timer_minutos": number }. No campo "descricao" evite textos muitos longos para evitar desinteresse no usuário.
    REGRAS PARA TIMER: tempo_timer_minutos DEVE SER 0 para ações manuais (picar, mexer, montar). Use > 0 apenas para fogo, forno ou espera.
10. tags: Lista de strings. Escolha APENAS entre: ["Salgadas", "Doces", "Rápidas", "Saudáveis", "Econômicas", "Lanches", "Jantar", "Almoço"].
11. preferencias: Lista de strings. Escolha APENAS entre: ["vegano", "vegetariano", "sem_gluten", "sem_lactose", "baixo_carboidrato", "sem_acucar"]. Retorne [] se não aplicar.
12. alergias_presentes: Lista de strings. Escolha APENAS entre: ["amendoim", "nozes", "leite", "ovo", "soja", "trigo", "gergelim", "frutos_do_mar"]. Retorne [] se for livre de alérgenos.

CAMPO "image_prompt" (ESPECIALISTA EM FOOD PHOTOGRAPHY):
You are an expert AI prompt engineer specializing in Midjourney and Stable Diffusion for professional food photography. Your task is to take a traditional Brazilian dish or dessert and transform it into a highly detailed, professional, English image generation prompt. Make sure to remain faithful to the authentic Brazilian ingredients (e.g., if it's brigadeiro, it must use chocolate sprinkles, not nuts or powdered sugar). Strictly follow this structure for the output prompt: "Ultra-realistic, professional food photography of [detailed description of the food], [description of ingredients/textures]. Macro photography, extreme close-up, highly detailed, showcasing the intricate texture of [specific elements]. Flawless food styling, elegant and gourmet presentation on a minimalist [type of plate/surface]. Soft, warm studio lighting, shallow depth of field, captivating bokeh background. Mouth-watering, appetizing, high resolution, award-winning food photography."

Retorne APENAS o JSON com as duas chaves (texto_da_receita e image_prompt), sem markdown ou explicações.`;
};
