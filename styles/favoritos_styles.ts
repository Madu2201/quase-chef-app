import { StyleSheet } from "react-native";
import { Colors, Fonts, FontSizes, Spacing, Radius, Shadows } from "../constants/theme";

export const favStyles = StyleSheet.create({
    // --- ESTRUTURA ---
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },

    // --- ESTOQUE (DENTRO DO HEADER - FIXO) ---
    stockToggle: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.background,
        borderRadius: Radius.full,
        paddingHorizontal: Spacing.md,
        height: 35,
        borderWidth: 1.5,
        borderColor: 'transparent',
    },
    stockText: {
        flex: 1,
        fontFamily: Fonts.regular,
        fontSize: FontSizes.small,
        color: Colors.primary,
        marginLeft: Spacing.sm,
    },
    switchStyle: {
        transform: [{ scaleX: 0.7 }, { scaleY: 0.7 }],
    },

    // --- FILTROS E CABEÇALHO (ROLAM COM A PÁGINA) ---
    listHeaderContainer: {
        marginTop: Spacing.md,
    },
    chipsScroll: {
        gap: Spacing.xs,
        paddingBottom: Spacing.sm,
    },
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.xs,
        borderRadius: Radius.full,
        backgroundColor: Colors.background,
        borderWidth: 1,
        borderColor: Colors.primary,
    },
    chipActive: {
        backgroundColor: Colors.secondary,
        borderColor: Colors.secondary,
    },
    chipText: {
        fontFamily: Fonts.bold,
        fontSize: FontSizes.small,
        color: Colors.primary,
    },
    chipTextActive: {
        fontFamily: Fonts.bold,
        fontSize: FontSizes.small,
        color: Colors.light,
    },

    // --- CONTADOR DE RECEITAS ---
    infoBar: {
        marginTop: Spacing.md,
        marginBottom: Spacing.sm,
    },
    infoText: {
        fontFamily: Fonts.bold,
        fontSize: FontSizes.small,
        color: Colors.brown,
    },

    // --- GRID DE RECEITAS ---
    listContent: {
        paddingHorizontal: Spacing.lg,
        paddingBottom: Spacing.xl,
    },
    columnWrapper: {
        justifyContent: 'space-between',
    },
    card: {
        width: '48%',
        marginBottom: Spacing.lg,
    },
    imageContainer: {
        width: '100%',
        aspectRatio: 0.85,
        borderRadius: Radius.lg,
        overflow: 'hidden',
        marginBottom: Spacing.xs,
        backgroundColor: Colors.light,
        ...Shadows.xs,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    heartIcon: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: Colors.light,
        borderRadius: Radius.full,
        padding: Spacing.xs,
        ...Shadows.sm,
    },
    recipeName: {
        fontFamily: Fonts.bold,
        fontSize: FontSizes.small,
        color: Colors.dark,
        lineHeight: 18,
    },
    recipeDetail: {
        fontFamily: Fonts.regular,
        fontSize: FontSizes.small,
        color: Colors.subtitle,
        marginTop: Spacing.xs,
    }
});