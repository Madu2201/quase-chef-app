import { Platform, StyleSheet, TextStyle } from "react-native";
import {
    Colors,
    Fonts,
    FontSizes,
    Radius,
    Shadows,
    Spacing,
} from "../constants/theme";
import {
    GLOBAL_ACTION_BUTTONS,
    ITEM_LIST_ACTIONS,
    ITEM_LIST_BUTTONS,
    ITEM_LIST_CARDS,
    ITEM_LIST_CHECKBOX,
    ITEM_LIST_CONTAINERS,
    ITEM_LIST_FLEX,
    ITEM_LIST_INPUTS,
    ITEM_LIST_PICKERS,
} from "./global_styles";

// ESTILOS ESPECÍFICOS PARA: DISPENSA
export const dispensaStyles = StyleSheet.create({
    ...ITEM_LIST_CONTAINERS,
    ...ITEM_LIST_CARDS,
    ...ITEM_LIST_INPUTS,
    ...ITEM_LIST_FLEX,
    ...ITEM_LIST_PICKERS,
    ...ITEM_LIST_BUTTONS,
    ...ITEM_LIST_CHECKBOX,
    ...ITEM_LIST_ACTIONS,
    ...GLOBAL_ACTION_BUTTONS,
    scrollContent: {
        paddingHorizontal: Spacing.lg,
        paddingTop: Spacing.md,
        paddingBottom: Spacing.xl * 4,
    },

    // --- DROPDOWN DE UNIDADES (ADIÇÃO) ---
    ingredientItem: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: Colors.light,
        padding: Spacing.md,
        borderRadius: Radius.lg,
        marginBottom: Spacing.sm,
        ...Shadows.xs,
    },

    ingredientInfo: {
        flex: 1,
        marginLeft: Spacing.md,
    },
    ingredientName: {
        fontFamily: Fonts.bold,
        fontSize: FontSizes.medium,
        color: Colors.dark,
        marginBottom: Spacing.xs,
    },
    controlsRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    listInputQtyWrap: {
        minWidth: 45,
        height: 30,
        borderRadius: Radius.full,
        borderWidth: 1,
        borderColor: Colors.subtext + "20",
        backgroundColor: Colors.background,
        justifyContent: "center",
        alignItems: "center",
    },
    listInputQtyText: {
        fontFamily: Fonts.medium,
        fontSize: FontSizes.small - 1,
        color: Colors.dark,
    },
    listPickerUnit: {
        minWidth: 55,
        height: 30,
        borderRadius: Radius.full,
        borderWidth: 1,
        borderColor: Colors.subtext + "20",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: Spacing.sm,
        backgroundColor: Colors.background,
        gap: 4,
    },
    unitText: {
        fontSize: FontSizes.small - 1,
        fontFamily: Fonts.regular,
        color: Colors.dark,
    },

    emptyText: {
        textAlign: "center",
        color: Colors.subtext,
        marginTop: Spacing.md,
        fontFamily: Fonts.regular,
    },

    // --- BOTÃO FLUTUANTE ---
    floatingBtn: {
        ...GLOBAL_ACTION_BUTTONS.btn,
        position: "absolute",
        bottom: Spacing.md,
        left: Spacing.lg,
        right: Spacing.lg,
        height: 55,
        paddingHorizontal: Spacing.lg,
        justifyContent: "space-between",
        ...Shadows.lg,
    },
    floatingBtnText: {
        ...GLOBAL_ACTION_BUTTONS.btnText,
        fontSize: FontSizes.small + 1,
    },
    badgeContainer: {
        backgroundColor: Colors.light + "99",
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        borderRadius: Radius.full,
        minWidth: 32,
        alignItems: "center",
        justifyContent: "center",
    },
    badgeText: {
        color: Colors.light,
        fontSize: FontSizes.small - 1,
        fontFamily: Fonts.bold,
    },
    inlineInput: {
        minWidth: 45,
        height: 30,
        backgroundColor: Colors.light,
        borderRadius: Radius.full,
        borderWidth: 1.5,
        borderColor: Colors.secondary,
        textAlign: "center",
        fontFamily: Fonts.bold,
        fontSize: FontSizes.small,
        color: Colors.dark,
        paddingHorizontal: Spacing.sm,
        ...Platform.select({
            web: { outlineStyle: "none" } as any,
            default: {},
        }),
    } as TextStyle,
});
