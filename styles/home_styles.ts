import { StyleSheet } from "react-native";
import { Colors, Fonts, FontSizes, Spacing, Radius, Shadows } from "../constants/theme";
import { headerStyles } from "./header.styles";

export const homeStyles = StyleSheet.create({
    //Header
    customHeader: {
        paddingTop: 0,
        paddingBottom: 0,
        marginBottom: 0,
    },
    // Container principal
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    scrollContent: {
        paddingTop: Spacing.md,
        paddingBottom: Spacing.xl,
    },
    // --- PERFIL ---
    userHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
    },
    avatarContainer: {
        width: 42,
        height: 42,
        borderRadius: Radius.full,
        backgroundColor: Colors.light,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1.5,
        borderColor: Colors.primary,
    },
    userName: {
        fontFamily: Fonts.bold,
        fontSize: FontSizes.small,
        color: Colors.dark,
    },
    greetingText: {
        fontFamily: Fonts.regular,
        fontSize: FontSizes.small - 1,
        color: Colors.subtitle,
    },
    // --- TEXTOS ---
    mainTitle: {
        fontFamily: Fonts.bold,
        fontSize: FontSizes.large,
        color: Colors.dark,
        paddingHorizontal: Spacing.lg,
        marginTop: Spacing.sm,
        marginBottom: Spacing.xs,
    },
    mainSubtitle: {
        fontFamily: Fonts.regular,
        fontSize: FontSizes.small,
        color: Colors.subtitle,
        paddingHorizontal: Spacing.lg,
        marginBottom: Spacing.xl,
    },
    // --- SEÇÕES ---
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: Spacing.lg,
        marginBottom: Spacing.sm,
    },
    sectionTitle: {
        fontFamily: Fonts.bold,
        fontSize: FontSizes.medium,
        color: Colors.dark,
    },
    editText: {
        fontFamily: Fonts.bold,
        fontSize: FontSizes.small,
        color: Colors.primary,
    },
    // --- CHIPS (CORREÇÃO DO ESPAÇAMENTO DIREITO) ---
    ingredientsScroll: {
        width: '100%',
        marginBottom: Spacing.lg,
    },
    ingredientsScrollContent: {
        paddingHorizontal: Spacing.lg,
        gap: Spacing.xs,
        flexDirection: 'row',
    },
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: Spacing.md,
        height: 38,
        borderRadius: Radius.full,
        backgroundColor: Colors.light,
        borderWidth: 1.5,
        borderColor: Colors.primary,
    },
    chipActive: {
        backgroundColor: Colors.secondary,
        borderColor: Colors.secondary,
    },
    chipText: {
        fontFamily: Fonts.bold,
        fontSize: FontSizes.small - 1,
        color: Colors.primary,
    },
    chipTextActive: { color: Colors.light },
    // --- BOTÃO GERAR ---
    btnContainer: {
        paddingHorizontal: Spacing.lg,
        marginBottom: Spacing.lg,
    },
    generateButton: {
        backgroundColor: Colors.primary,
        flexDirection: 'row',
        height: 52,
        borderRadius: Radius.full,
        justifyContent: 'center',
        alignItems: 'center',
        gap: Spacing.sm,
        ...Shadows.sm,
    },
    generateButtonText: {
        fontFamily: Fonts.bold,
        color: Colors.light,
        fontSize: FontSizes.small,
    },
    // --- CARDS ---
    recipeCard: {
        backgroundColor: Colors.light,
        borderRadius: Radius.md,
        marginBottom: Spacing.md,
        marginHorizontal: Spacing.lg,
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    recipeTouchable: {
        flexDirection: 'row',
        alignItems: 'center', // Alinha imagem e o bloco de texto/seta pelo centro vertical
        borderRadius: Radius.md,
        overflow: 'hidden',
        backgroundColor: Colors.light,
    },
    recipeImage: {
        width: 100,
        height: 100,
    },
    recipeInfo: {
        flex: 1, // Ocupa todo o espaço ao lado da imagem
        flexDirection: 'row', // --- NOVO: Separa texto da seta horizontalmente ---
        alignItems: 'center', // --- NOVO: Centraliza verticalmente a seta grande ---
        justifyContent: 'space-between', // --- NOVO: Empurra o texto para esquerda e a seta para direita ---
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        height: 100, // Mesma altura da imagem
    },
    recipeTextBlock: {
        flex: 1, // Ocupa o máximo de espaço que sobrar da seta
        flexShrink: 1, // --- CRÍTICO: Impede que textos longos empurrem a seta ---
        justifyContent: 'center', // Centraliza os textos verticalmente dentro do bloco
        marginRight: Spacing.sm, // Espaço para não grudar na seta
    },
    recipeArrowBlock: {
        // Container opcional caso queira adicionar padding específico na seta
        justifyContent: 'center',
        alignItems: 'center',
    },
    recipeTime: {
        fontFamily: Fonts.bold,
        fontSize: FontSizes.small - 3,
        color: Colors.primary,
        textTransform: 'uppercase',
        marginBottom: 2,
    },
    recipeTitle: {
        fontFamily: Fonts.bold,
        fontSize: FontSizes.small,
        color: Colors.dark,
        marginBottom: 1,
    },
    recipeDesc: {
        fontFamily: Fonts.regular,
        fontSize: FontSizes.small - 2,
        color: Colors.subtitle,
        lineHeight: 16,
    },
});