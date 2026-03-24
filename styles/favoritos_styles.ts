import { StyleSheet, Platform } from "react-native";
import { Colors, Fonts, FontSizes, Spacing, Radius, Shadows } from "../constants/theme";

export const favStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    // Header Unificado com Sombra
    header: {
        backgroundColor: Colors.light,
        paddingTop: Platform.OS === 'ios' ? Spacing.xl * 2 : Spacing.xl,
        ...Shadows.md,
        zIndex: 10,
    },
    // Primeira linha: Embaixo do título Favoritos
    titleContainer: {
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)',
        paddingBottom: Spacing.md,
        marginBottom: Spacing.lg,
    },
    title: {
        fontFamily: Fonts.bold,
        fontSize: FontSizes.title,
        color: Colors.dark,
        textAlign: 'center',
    },
    headerContent: {
        paddingHorizontal: Spacing.lg,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.background,
        borderRadius: Radius.full,
        paddingHorizontal: Spacing.md,
        height: 52,
        marginBottom: Spacing.sm,
        borderWidth: 1.5,
        borderColor: 'transparent',
    },
    searchBarFocused: {
        borderColor: Colors.primary,
        backgroundColor: Colors.light,
    },
    searchInput: {
        flex: 1,
        marginLeft: Spacing.sm,
        fontFamily: Fonts.regular,
        fontSize: FontSizes.medium,
        color: Colors.primary,
        height: '100%',
        // @ts-ignore
        outlineStyle: 'none' as any,
    },
    stockToggle: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.background,
        borderRadius: Radius.full,
        paddingHorizontal: Spacing.md,
        height: 52,
        marginBottom: Spacing.lg,
        borderWidth: 1,
        borderColor: Colors.background,
    },
    stockText: {
        flex: 1,
        fontFamily: Fonts.regular,
        fontSize: FontSizes.medium,
        color: Colors.primary,
        marginLeft: Spacing.sm,
    },
    switchStyle: {
        // @ts-ignore
        outlineStyle: 'none' as any,
        transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
    },
    chipsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.sm,
        marginBottom: Spacing.xl,
    },
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        borderRadius: Radius.full,
        backgroundColor: Colors.background,
        borderWidth: 1,
        borderColor: Colors.background,
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
    // Segunda Linha: Alinhada embaixo das Tabs
    tabContainer: {
        flexDirection: 'row',
        gap: Spacing.xl,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)',
    },
    tabItem: {
        paddingBottom: Spacing.sm,
    },
    tabActive: {
        borderBottomWidth: 3,
        borderBottomColor: Colors.secondary,
    },
    tabText: {
        fontFamily: Fonts.bold,
        fontSize: FontSizes.medium,
        color: Colors.subtitle,
    },
    tabTextActive: {
        color: Colors.dark,
    },
    infoBar: {
        paddingHorizontal: Spacing.lg,
        marginVertical: Spacing.md,
    },
    infoText: {
        fontFamily: Fonts.regular,
        fontSize: FontSizes.small,
        color: Colors.secondary,
    },
    listContent: {
        paddingTop: Spacing.md,
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