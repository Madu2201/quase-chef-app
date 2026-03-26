import { StyleSheet } from "react-native";
import { Colors, Fonts, FontSizes, Spacing, Radius, Shadows } from "../constants/theme";

export const homeStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    scrollContent: {
        paddingHorizontal: Spacing.lg,
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

    // --- TEXTOS ---
    mainTitle: {
        fontFamily: Fonts.bold,
        fontSize: FontSizes.large,
        color: Colors.dark,
        marginTop: Spacing.sm,
        marginBottom: Spacing.sm,
    },
    mainSubtitle: {
        fontFamily: Fonts.regular,
        fontSize: FontSizes.small,
        color: Colors.subtitle,
        marginBottom: Spacing.lg,
    },

    // --- SEÇÕES ---
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

    // --- CHIPS ---
    ingredientsWrapper: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.xs,
        marginBottom: Spacing.lg,
    },
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
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
    chipTextActive: {
        fontFamily: Fonts.bold,
        fontSize: FontSizes.small - 1,
        color: Colors.light,
    },

    // --- BOTÃO GERAR ---
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
        width: 90,
        height: 90,
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
        marginBottom: Spacing.xs,
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