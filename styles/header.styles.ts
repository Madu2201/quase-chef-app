import { Platform, StyleSheet, TextStyle } from "react-native";
import { Colors, Fonts, FontSizes, Radius, Shadows, Spacing } from "../constants/theme";

// --- HEADER: STOCK TOGGLE ---
export const HEADER_STOCK_TOGGLE = StyleSheet.create({
    stockToggle: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.background,
        borderRadius: Radius.full,
        paddingHorizontal: Spacing.md,
        height: 42,
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
});

// --- HEADER: ESTILOS GERAIS PARA TELAS COM HEADER CUSTOMIZADO ---
export const headerStyles = StyleSheet.create({
    ...HEADER_STOCK_TOGGLE,
    header: {
        backgroundColor: Colors.light,
        paddingTop: Platform.OS === 'ios' ? 35 : 25,
        zIndex: 10,
        borderBottomLeftRadius: Radius.xl,
        borderBottomRightRadius: Radius.xl,
        ...Shadows.md,
    },
    titleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: Spacing.lg,
        marginBottom: 6,
        minHeight: 40,
        position: 'relative',
    },
    title: {
        fontFamily: Fonts.bold,
        fontSize: FontSizes.large,
        color: Colors.dark,
    },
    titleCenter: {
        textAlign: 'center',
        flex: 1,
    },
    exportBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.secondary + '12',
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.xs,
        borderRadius: Radius.full,
        gap: 6,
        borderWidth: 1,
        borderColor: Colors.secondary + '20',
    },
    exportText: {
        color: Colors.secondary,
        fontFamily: Fonts.bold,
        fontSize: FontSizes.small,
    },
    headerContent: {
        paddingHorizontal: Spacing.lg,
        paddingBottom: Spacing.sm,
    },
    searchContainer: {
        backgroundColor: Colors.background,
        borderRadius: Radius.full,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: Spacing.md,
        height: 44,
        borderWidth: 1.5,
        borderColor: 'transparent',
        ...Shadows.sm,
    },
    searchContainerFocused: {
        borderColor: Colors.primary,
        backgroundColor: Colors.light,
    },
    searchInput: {
        flex: 1,
        fontFamily: Fonts.regular,
        fontSize: FontSizes.small + 1,
        color: Colors.dark,
        marginLeft: Spacing.sm,
        height: "100%",
        ...Platform.select({
            web: { outlineStyle: 'none' } as any,
            default: {},
        }),
    } as TextStyle,
});