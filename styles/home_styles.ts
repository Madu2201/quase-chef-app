import { StyleSheet } from "react-native";
import { Colors, Fonts, FontSizes, Spacing, Radius, Shadows } from "../constants/theme";

export const homeStyles = StyleSheet.create({
    // --- ESTRUTURA ---
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    scrollContent: {
        paddingHorizontal: Spacing.lg,
        paddingTop: Spacing.md,
        paddingBottom: Spacing.xl,
    },

    // --- PERFIL (Header Children) ---
    userHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
    },
    avatarContainer: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: Colors.light,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1.5,
        borderColor: Colors.primary,
    },
    userNameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.xs,
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

    // --- TÍTULOS E TEXTOS ---
    mainTitle: {
        fontFamily: Fonts.bold,
        fontSize: FontSizes.large,
        color: Colors.dark,
        marginTop: Spacing.sm,
    },
    mainSubtitle: {
        fontFamily: Fonts.regular,
        fontSize: FontSizes.small,
        color: Colors.subtitle,
        marginBottom: Spacing.lg,
    },

    // --- CABEÇALHOS DE SEÇÃO ---
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
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

    // --- TAGS DE INGREDIENTES ---
    ingredientsWrapper: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.xs,
        marginBottom: Spacing.lg,
    },
    ingredientTag: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.light,
        paddingHorizontal: Spacing.sm,
        paddingVertical: 6,
        borderRadius: Radius.full,
        gap: 4,
        borderWidth: 1.2,
        borderColor: Colors.primary,
    },
    ingredientText: {
        fontFamily: Fonts.bold,
        fontSize: FontSizes.small - 1,
        color: Colors.dark,
    },

    // --- BOTÃO PRINCIPAL ---
    generateButton: {
        backgroundColor: Colors.primary,
        flexDirection: 'row',
        height: 52,
        borderRadius: Radius.full,
        justifyContent: 'center',
        alignItems: 'center',
        gap: Spacing.sm,
        marginBottom: Spacing.lg,
        ...Shadows.sm,
    },
    generateButtonText: {
        fontFamily: Fonts.bold,
        color: Colors.light,
        fontSize: FontSizes.small,
    },

    // --- CARDS DE RECEITA ---
    recipeCard: {
        flexDirection: 'row',
        backgroundColor: Colors.light,
        borderRadius: Radius.md,
        marginBottom: Spacing.sm,
        overflow: 'hidden',
        ...Shadows.xs,
    },
    recipeImage: {
        width: 85,
        height: 85,
    },
    recipeInfo: {
        flex: 1,
        padding: Spacing.sm,
        justifyContent: 'center',
    },
    recipeTime: {
        fontFamily: Fonts.bold,
        fontSize: FontSizes.small - 2,
        color: Colors.primary,
        marginBottom: 2,
    },
    recipeTitle: {
        fontFamily: Fonts.bold,
        fontSize: FontSizes.small,
        color: Colors.dark,
    },
    recipeDesc: {
        fontFamily: Fonts.regular,
        fontSize: FontSizes.small - 1,
        color: Colors.subtitle,
    }
});