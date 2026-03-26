import { StyleSheet } from "react-native";
import { Colors, Fonts, FontSizes, Spacing, Radius, Shadows } from "../constants/theme";

export const homeStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    // Espaçamento do conteúdo rolável abaixo do Header
    scrollContent: {
        paddingHorizontal: Spacing.lg,
        paddingTop: Spacing.md,
        paddingBottom: Spacing.xl,
    },
    // Container do perfil (passado como children para o Header)
    userHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
    },
    avatarContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: Colors.light,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1.5,
        borderColor: Colors.primary,
    },
    greetingText: {
        fontFamily: Fonts.regular,
        fontSize: FontSizes.small,
        color: Colors.subtitle,
    },
    userNameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.xs,
    },
    userName: {
        fontFamily: Fonts.bold,
        fontSize: FontSizes.medium,
        color: Colors.dark,
    },
    // Títulos e Textos principais
    mainTitle: {
        fontFamily: Fonts.bold,
        fontSize: FontSizes.title,
        color: Colors.dark,
        marginTop: Spacing.md,
    },
    mainSubtitle: {
        fontFamily: Fonts.regular,
        fontSize: FontSizes.medium,
        color: Colors.subtitle,
        marginBottom: Spacing.xl,
    },
    // Cabeçalhos de seção (Ingredientes/Sugestões)
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.md,
    },
    sectionTitle: {
        fontFamily: Fonts.bold,
        fontSize: FontSizes.large,
        color: Colors.dark,
    },
    editText: {
        fontFamily: Fonts.bold,
        color: Colors.primary,
        fontSize: FontSizes.medium,
    },
    // Tags de ingredientes selecionados
    ingredientsWrapper: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.sm,
        marginBottom: Spacing.xl,
    },
    ingredientTag: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.light,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        borderRadius: Radius.full,
        gap: Spacing.xs,
        borderWidth: 1.5,
        borderColor: Colors.primary,
    },
    ingredientText: {
        fontFamily: Fonts.bold,
        fontSize: FontSizes.small,
        color: Colors.dark,
    },
    // Botão de ação principal
    generateButton: {
        backgroundColor: Colors.primary,
        flexDirection: 'row',
        height: 60,
        borderRadius: Radius.lg,
        justifyContent: 'center',
        alignItems: 'center',
        gap: Spacing.md,
        marginBottom: Spacing.xl,
        ...Shadows.md,
    },
    generateButtonText: {
        fontFamily: Fonts.bold,
        color: Colors.light,
        fontSize: FontSizes.medium,
        textAlign: 'center',
    },
    // Cards de receitas sugeridas
    recipeCard: {
        flexDirection: 'row',
        backgroundColor: Colors.light,
        borderRadius: Radius.lg,
        marginBottom: Spacing.md,
        overflow: 'hidden',
        ...Shadows.sm,
    },
    recipeImage: {
        width: 100,
        height: 100,
    },
    recipeInfo: {
        flex: 1,
        padding: Spacing.md,
        justifyContent: 'center',
    },
    recipeTime: {
        fontFamily: Fonts.bold,
        fontSize: 10,
        color: Colors.primary,
        marginBottom: 4,
    },
    recipeTitle: {
        fontFamily: Fonts.bold,
        fontSize: FontSizes.medium,
        color: Colors.dark,
    },
    recipeDesc: {
        fontFamily: Fonts.regular,
        fontSize: FontSizes.small,
        color: Colors.subtitle,
    }
});