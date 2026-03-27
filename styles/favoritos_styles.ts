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
    // --- FILTROS (SCROLL HORIZONTAL CORRIGIDO) ---
    listHeaderContainer: {
        paddingTop: Spacing.md,
    },
    chipsScroll: {
        width: '100%',
    },
    chipsScrollContent: {
        paddingHorizontal: Spacing.lg, // Espaço nas duas extremidades do scroll
        gap: Spacing.sm,
        flexDirection: 'row',
        paddingBottom: Spacing.xs,
    },
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        height: 38,
        paddingHorizontal: Spacing.md,
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
    // --- CONTADOR ---
    infoBar: {
        paddingHorizontal: Spacing.lg,
        marginTop: Spacing.md,
        marginBottom: Spacing.sm,
    },
    infoText: {
        fontFamily: Fonts.bold,
        fontSize: FontSizes.small,
        color: Colors.brown,
    },
    // --- GRID ---
    listContent: { paddingBottom: Spacing.xl },
    columnWrapper: {
        paddingHorizontal: Spacing.lg,
        justifyContent: 'space-between',
    },
    card: { width: '48%', marginBottom: Spacing.lg },
    imageContainer: {
        width: '100%',
        aspectRatio: 1, // Quadrado perfeito
        borderRadius: Radius.lg,
        overflow: 'hidden',
        marginBottom: Spacing.xs,
        backgroundColor: Colors.light,
        ...Shadows.xs,
    },
    image: { width: '100%', height: '100%' },
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
        paddingHorizontal: Spacing.xs,
    },
    recipeDetail: {
        fontFamily: Fonts.regular,
        fontSize: FontSizes.small - 1,
        color: Colors.subtitle,
        marginTop: Spacing.xs,
        paddingHorizontal: Spacing.xs,
    }
});