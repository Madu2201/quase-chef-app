import { Dimensions, StyleSheet } from "react-native";
import { Colors, Fonts, FontSizes, Radius, Shadows, Spacing } from "../constants/theme";
import { FILTERS_LAYOUT, GLOBAL_CHIPS_FILTERS } from "./global_styles";
import { HEADER_STOCK_TOGGLE } from "./header.styles";

const { width } = Dimensions.get('window');
const cardWidth = (width - (Spacing.lg * 2) - Spacing.md) / 2;

// ESTILOS ESPECÍFICOS PARA: FAVORITOS
export const favStyles = StyleSheet.create({
    ...GLOBAL_CHIPS_FILTERS,
    ...FILTERS_LAYOUT,
    ...HEADER_STOCK_TOGGLE,
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    // --- FILTROS ---
    listHeaderContainer: {
        paddingTop: Spacing.md,
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