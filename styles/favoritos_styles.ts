import { StyleSheet } from "react-native";
import { Colors, Fonts, FontSizes, Spacing, Radius, Shadows } from "../constants/theme";

export const favStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },

    // --- ESTOQUE (HEADER) ---
    stockToggle: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.background,
        borderRadius: Radius.full,
        paddingHorizontal: Spacing.md,
        height: 38,
        borderWidth: 1,
        borderColor: Colors.subtext + '20',
    },
    stockText: {
        flex: 1,
        fontFamily: Fonts.regular,
        fontSize: FontSizes.small - 1,
        color: Colors.primary,
        marginLeft: Spacing.sm,
    },
    switchStyle: {
        transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
    },

    // --- FILTROS (CHIPS COM QUEBRA) ---
    listHeaderContainer: {
        marginTop: Spacing.md,
    },
    chipsWrapper: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.xs,
        paddingBottom: Spacing.sm,
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

    // --- CONTADOR ---
    infoBar: {
        marginTop: Spacing.md,
        marginBottom: Spacing.sm,
    },
    infoText: {
        fontFamily: Fonts.bold,
        fontSize: FontSizes.small,
        color: Colors.brown,
    },

    // --- GRID E IMAGEM QUADRADA ---
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
        aspectRatio: 1, // IMAGEM QUADRADA PERFEITA
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
        marginHorizontal: Spacing.sm,
    },
    recipeDetail: {
        fontFamily: Fonts.regular,
        fontSize: FontSizes.small - 1,
        color: Colors.subtitle,
        marginTop: Spacing.xs,
        marginHorizontal: Spacing.sm,
    }
});