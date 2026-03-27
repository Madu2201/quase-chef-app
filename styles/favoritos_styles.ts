import { StyleSheet, Dimensions } from "react-native";
import { Colors, Fonts, FontSizes, Spacing, Radius, Shadows } from "../constants/theme";

const { width } = Dimensions.get('window');
const cardWidth = (width - (Spacing.lg * 2) - Spacing.md) / 2;

export const favStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    // --- HEADER / TOGGLE ---
    stockToggle: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.background,
        borderRadius: Radius.full,
        paddingHorizontal: Spacing.md,
        height: 40,
        borderWidth: 1,
        borderColor: Colors.subtext + '20',
        marginTop: Spacing.xs,
    },
    stockText: {
        flex: 1,
        fontFamily: Fonts.medium,
        fontSize: FontSizes.small - 1,
        color: Colors.primary,
        marginLeft: Spacing.sm,
    },
    switchStyle: {
        transform: [{ scaleX: 0.75 }, { scaleY: 0.75 }],
    },
    // --- FILTROS ---
    listHeaderContainer: {
        paddingTop: Spacing.md,
    },
    chipsScroll: {
        marginBottom: Spacing.sm,
    },
    chipsScrollContent: {
        paddingHorizontal: Spacing.lg,
        gap: Spacing.sm,
    },
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 36,
        paddingHorizontal: Spacing.md,
        borderRadius: Radius.full,
        backgroundColor: Colors.light,
        borderWidth: 1.5,
        borderColor: Colors.primary + '30',
        gap: 6,
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
        color: Colors.light,
    },
    infoBar: {
        paddingHorizontal: Spacing.lg,
        marginVertical: Spacing.sm,
    },
    infoText: {
        fontFamily: Fonts.bold,
        fontSize: FontSizes.small,
        color: Colors.brown,
    },
    // --- GRID E CARDS ---
    listContent: {
        paddingBottom: Spacing.xl,
    },
    columnWrapper: {
        justifyContent: 'space-between',
        paddingHorizontal: Spacing.lg,
    },
    card: {
        width: cardWidth,
        backgroundColor: Colors.light,
        borderRadius: Radius.lg,
        marginBottom: Spacing.md,
        overflow: 'hidden',
        ...Shadows.sm,
    },
    imageContainer: {
        width: '100%',
        height: 120,
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    heartIcon: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: 'rgba(255,255,255,0.9)',
        padding: 4,
        borderRadius: Radius.full,
    },
    cardInfo: {
        padding: Spacing.sm,
    },
    recipeName: {
        fontFamily: Fonts.bold,
        fontSize: FontSizes.small,
        color: Colors.dark,
        marginBottom: 2,
    },
    recipeDetail: {
        fontFamily: Fonts.regular,
        fontSize: FontSizes.small - 2,
        color: Colors.primary,
    },
});