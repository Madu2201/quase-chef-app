import { StyleSheet, Platform, TextStyle } from "react-native";
import { Colors, Fonts, FontSizes, Spacing, Radius, Shadows } from "../constants/theme";

export const listaStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    scrollContent: {
        paddingHorizontal: Spacing.lg,
        paddingTop: Spacing.md,
        paddingBottom: Spacing.xl * 2,
    },

    // --- CARD DE ADIÇÃO ---
    addCard: {
        backgroundColor: Colors.light,
        borderRadius: Radius.lg,
        padding: Spacing.md,
        marginBottom: Spacing.lg,
        ...Shadows.sm,
        borderWidth: 1,
        borderColor: Colors.subtext + '15',
    },
    sectionLabel: {
        fontFamily: Fonts.bold,
        fontSize: FontSizes.small,
        color: Colors.dark,
        marginBottom: Spacing.sm,
    },
    inputBase: {
        backgroundColor: Colors.background,
        borderRadius: Radius.md,
        height: 38,
        paddingHorizontal: Spacing.md,
        fontFamily: Fonts.regular,
        fontSize: FontSizes.small,
        color: Colors.dark,
        borderWidth: 1.5,
        borderColor: Colors.subtext + '20',
        ...Platform.select({
            web: { outlineStyle: 'none' } as any,
            default: {},
        }),
    } as TextStyle,
    inputFocused: {
        borderColor: Colors.secondary,
        backgroundColor: Colors.light,
    },
    inputFull: {
        marginBottom: Spacing.xs,
    },
    row: {
        flexDirection: "row",
        gap: Spacing.sm,
        alignItems: "center",
    },
    inputField: {
        flex: 1.5,
    },
    pickerMock: {
        backgroundColor: Colors.background,
        borderRadius: Radius.md,
        height: 38,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: Spacing.md,
        flex: 1,
        borderWidth: 1.5,
        borderColor: Colors.subtext + '20',
    },
    pickerText: {
        fontFamily: Fonts.regular,
        fontSize: FontSizes.small,
        color: Colors.dark,
    },
    btnAdd: {
        backgroundColor: Colors.secondary,
        width: 38,
        height: 38,
        borderRadius: Radius.md,
        justifyContent: "center",
        alignItems: "center",
        ...Shadows.sm,
    },

    // --- AÇÕES EM MASSA ---
    btnActionBulk: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.light,
        borderWidth: 1,
        borderColor: Colors.secondary + '40',
        height: 40,
        borderRadius: Radius.md,
        gap: 8,
        marginBottom: Spacing.lg,
    },
    btnTextBulk: {
        fontFamily: Fonts.bold,
        fontSize: FontSizes.small,
        color: Colors.secondary,
    },

    // --- SEÇÕES ---
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.md,
    },
    sectionTitle: {
        fontFamily: Fonts.bold,
        fontSize: FontSizes.medium,
        color: Colors.dark,
    },
    badgeCount: {
        backgroundColor: Colors.primary + '15',
        paddingHorizontal: Spacing.sm,
        paddingVertical: Spacing.xs,
        borderRadius: Radius.full,
    },
    badgeText: {
        fontFamily: Fonts.bold,
        fontSize: FontSizes.small - 2,
        color: Colors.primary,
    },

    // --- ITENS DA LISTA ---
    itemCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.light,
        padding: Spacing.md,
        borderRadius: Radius.lg,
        marginBottom: Spacing.sm,
        ...Shadows.xs,
    },
    checkbox: {
        width: 22,
        height: 22,
        borderRadius: Radius.md,
        borderWidth: 2,
        borderColor: Colors.secondary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxActive: {
        backgroundColor: Colors.secondary,
        borderColor: Colors.secondary,
    },
    itemInfo: {
        flex: 1,
        marginLeft: Spacing.md,
    },
    itemName: {
        fontFamily: Fonts.bold,
        fontSize: FontSizes.small + 1,
        color: Colors.dark,
    },
    itemSub: {
        fontFamily: Fonts.regular,
        fontSize: FontSizes.small - 1,
        color: Colors.subtext,
    },

    // --- BOTÃO DELETAR (LIXEIRA VERMELHA) ---
    btnDelete: {
        padding: Spacing.xs,
        marginLeft: Spacing.xs,
    },

    // --- ESTADOS ESPECIAIS ---
    itemCardComprado: {
        opacity: 0.6,
        backgroundColor: Colors.background,
        elevation: 0,
        shadowOpacity: 0,
        borderWidth: 1,
        borderColor: Colors.subtext + '10',
    },
    nameComprado: {
        textDecorationLine: 'line-through',
        color: Colors.subtext,
    },
    clearText: {
        fontFamily: Fonts.bold,
        fontSize: FontSizes.small - 2,
        color: Colors.primary,
    }
});