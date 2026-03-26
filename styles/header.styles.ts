import { StyleSheet, Platform, TextStyle } from "react-native";
import { Colors, Fonts, FontSizes, Spacing, Radius, Shadows } from "../constants/theme";

export const headerStyles = StyleSheet.create({
    // --- CONTAINER PRINCIPAL ---
    header: {
        backgroundColor: Colors.light,
        paddingTop: Platform.OS === 'ios' ? 60 : 40,
        zIndex: 10,
        borderBottomLeftRadius: Radius.xl,
        borderBottomRightRadius: Radius.xl,
        ...Shadows.md,
    },

    // --- LINHA SUPERIOR (TÍTULO E EXPORTAR) ---
    titleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: Spacing.lg,
        paddingBottom: Spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: Colors.dark + '08',
        marginBottom: Spacing.md,
    },
    title: {
        fontFamily: Fonts.bold,
        fontSize: FontSizes.large,
        color: Colors.dark,
        flex: 1,
    },
    titleCenter: {
        textAlign: 'center',
    },

    // --- BOTÃO DE EXPORTAÇÃO ---
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

    // --- CONTEÚDO (BUSCA E FORMULÁRIO) ---
    headerContent: {
        paddingHorizontal: Spacing.lg,
        paddingBottom: Spacing.lg,
    },
    searchContainer: {
        backgroundColor: Colors.background,
        borderRadius: Radius.full,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: Spacing.md,
        height: 52,
        borderWidth: 1.5,
        borderColor: 'transparent',
    },
    searchContainerFocused: {
        borderColor: Colors.primary,
        backgroundColor: Colors.light,
    },
    searchInput: {
        flex: 1,
        fontFamily: Fonts.regular,
        fontSize: FontSizes.medium,
        color: Colors.primary,
        marginLeft: Spacing.sm,
        height: "100%",
        // Correção de tipagem para Web/Mobile
        ...Platform.select({
            web: { outlineStyle: 'none' } as any,
            default: {},
        }),
    } as TextStyle,
});