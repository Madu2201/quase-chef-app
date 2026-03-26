import { StyleSheet } from "react-native";
import { Colors, Fonts, FontSizes, Spacing, Radius, Shadows } from "../constants/theme";

export const favStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    // Switch de estoque
    stockToggle: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.background,
        borderRadius: Radius.full,
        paddingHorizontal: Spacing.md,
        height: 52,
        marginBottom: Spacing.md,
        borderWidth: 1.5,
        borderColor: 'rgba(0,0,0,0.05)',
    },
    stockText: {
        flex: 1,
        fontFamily: Fonts.regular,
        fontSize: FontSizes.medium,
        color: Colors.primary,
        marginLeft: Spacing.sm,
    },
    switchStyle: {
        transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
    },
    // --- FILTROS QUE QUEBRAM LINHA ---
    chipsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap', // Permite quebrar linha
        gap: Spacing.sm,
        marginTop: Spacing.xs,
    },
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: Spacing.md,
        paddingVertical: 10,
        borderRadius: Radius.full,
        backgroundColor: Colors.background,
        borderWidth: 1.5,
        borderColor: 'rgba(0,0,0,0.08)',
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
    // --- LISTA DE RECEITAS ---
    infoBar: {
        paddingHorizontal: Spacing.lg,
        marginVertical: Spacing.md,
    },
    infoText: {
        fontFamily: Fonts.bold,
        fontSize: FontSizes.small,
        color: Colors.brown,
    },
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
        borderRadius: Radius.lg,
        overflow: 'hidden',
        marginBottom: Spacing.sm,
        backgroundColor: Colors.light,
        ...Shadows.sm,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    heartIcon: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: Colors.light,
        borderRadius: Radius.full,
        padding: 6,
        ...Shadows.sm,
    },
    recipeName: {
        fontFamily: Fonts.bold,
        fontSize: FontSizes.medium - 2,
        color: Colors.dark,
        lineHeight: 20,
    },
    recipeDetail: {
        fontFamily: Fonts.regular,
        fontSize: FontSizes.small,
        color: Colors.subtitle,
        marginTop: 2,
    }
});