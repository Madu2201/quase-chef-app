import { StyleSheet } from "react-native";
import { Colors, Fonts, FontSizes, Spacing, Radius, Shadows } from "../constants/theme";

export const favStyles = StyleSheet.create({
    // --- ESTRUTURA ---
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },

    // --- TOGGLE DE ESTOQUE ---
    stockToggle: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.background,
        borderRadius: Radius.full,
        paddingHorizontal: Spacing.md,
        height: 48,
        marginBottom: Spacing.md,
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

    // --- FILTROS (CHIPS) ---
    chipsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.xs,
        marginTop: Spacing.xs,
    },
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.xs,
        borderRadius: Radius.full,
        backgroundColor: Colors.background,
        borderWidth: 1.5,
        borderColor: 'transparent',
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

    // --- CABEÇALHO DA LISTA ---
    infoBar: {
        paddingHorizontal: Spacing.lg,
        marginVertical: Spacing.md,
    },
    infoText: {
        fontFamily: Fonts.bold,
        fontSize: FontSizes.small,
        color: Colors.brown || Colors.primary,
    },

    // --- GRID DE RECEITAS ---
    listContent: {
        paddingBottom: Spacing.xl,
        paddingHorizontal: Spacing.lg,
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
        borderRadius: Radius.md,
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