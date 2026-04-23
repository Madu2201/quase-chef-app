import { StyleSheet } from "react-native";
import { Colors, Fonts, FontSizes, Radius, Shadows, Spacing } from "../constants/theme";
import { ITEM_LIST_ACTIONS, ITEM_LIST_BUTTONS, ITEM_LIST_CARDS, ITEM_LIST_CHECKBOX, ITEM_LIST_CONTAINERS, ITEM_LIST_FLEX, ITEM_LIST_INPUTS, ITEM_LIST_PICKERS } from "./global_styles";

// ESTILOS ESPECÍFICOS PARA: LISTA DE COMPRAS
export const listaStyles = StyleSheet.create({
    ...ITEM_LIST_CONTAINERS,
    ...ITEM_LIST_CARDS,
    ...ITEM_LIST_INPUTS,
    ...ITEM_LIST_FLEX,
    ...ITEM_LIST_PICKERS,
    ...ITEM_LIST_BUTTONS,
    ...ITEM_LIST_CHECKBOX,
    ...ITEM_LIST_ACTIONS,
    scrollContent: {
        paddingHorizontal: Spacing.lg,
        paddingTop: Spacing.md,
        paddingBottom: Spacing.xl * 2,
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
    magicButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.primary,
        borderRadius: Radius.lg,
        paddingVertical: Spacing.md,
        paddingHorizontal: Spacing.lg,
        gap: Spacing.sm,
        marginBottom: Spacing.lg,
        ...Shadows.sm,
    },
    magicButtonText: {
        fontFamily: Fonts.bold,
        fontSize: FontSizes.small,
        color: Colors.light,
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
    sectionTitleOff: {
        fontFamily: Fonts.bold,
        fontSize: FontSizes.medium,
        color: Colors.subtext,
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