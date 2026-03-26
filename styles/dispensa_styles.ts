import { StyleSheet, Platform, TextStyle } from "react-native";
import { Colors, Fonts, FontSizes, Spacing, Radius, Shadows } from "../constants/theme";

export const dispensaStyles = StyleSheet.create({
    // --- ESTRUTURA ---
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    scrollContent: {
        paddingHorizontal: Spacing.lg,
        paddingTop: Spacing.xl,
        paddingBottom: Spacing.lg,
    },

    // --- FORMULÁRIO DE ADIÇÃO (Header Children) ---
    addSection: {
        marginTop: Spacing.xs,
    },
    sectionLabel: {
        fontFamily: Fonts.bold,
        fontSize: FontSizes.small + 1,
        color: Colors.dark,
        marginBottom: Spacing.xs,
    },
    inputBase: {
        backgroundColor: Colors.background,
        borderRadius: Radius.md,
        height: 40,
        paddingHorizontal: Spacing.md,
        fontFamily: Fonts.regular,
        fontSize: FontSizes.small,
        color: Colors.dark,
        borderWidth: 1.5,
        borderColor: 'transparent',
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
        marginBottom: Spacing.sm,
    },
    inputField: {
        flex: 1,
    },
    inputSmall: {
        textAlign: "center",
    },
    row: {
        flexDirection: "row",
        gap: Spacing.sm,
        alignItems: "center",
    },
    pickerMock: {
        backgroundColor: Colors.background,
        borderRadius: Radius.md,
        height: 40,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: Spacing.sm,
        flex: 1.2,
    },
    btnAdd: {
        backgroundColor: Colors.secondary,
        width: 40,
        height: 40,
        borderRadius: Radius.md,
        justifyContent: "center",
        alignItems: "center",
        ...Shadows.sm,
    },

    // --- ITENS DA LISTA ---
    ingredientItem: {
        flexDirection: "row",
        paddingVertical: Spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: Colors.light,
        alignItems: "center",
    },
    checkbox: {
        width: 22,
        height: 22,
        borderRadius: Radius.full,
        borderWidth: 2,
        borderColor: Colors.primary,
        justifyContent: "center",
        alignItems: "center",
        marginRight: Spacing.sm,
    },
    checkboxActive: {
        backgroundColor: Colors.primary,
    },
    ingredientInfo: {
        flex: 1,
    },
    ingredientName: {
        fontFamily: Fonts.bold,
        fontSize: FontSizes.small,
        color: Colors.dark,
        marginBottom: Spacing.xs,
    },

    // --- CONTROLES DE QUANTIDADE NA LISTA ---
    controlsRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    listInputQty: {
        width: 50,
        height: 28,
        borderRadius: Radius.full,
        borderWidth: 1,
        borderColor: Colors.primary + '30',
        textAlign: "center",
        fontFamily: Fonts.regular,
        fontSize: FontSizes.small,
        color: Colors.dark,
        backgroundColor: Colors.light,
    },
    listPickerUnit: {
        minWidth: 60,
        height: 28,
        borderRadius: Radius.full,
        borderWidth: 1,
        borderColor: Colors.primary + '30',
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 4,
        paddingHorizontal: Spacing.sm,
        backgroundColor: Colors.light,
    },
    unitText: {
        fontSize: FontSizes.small,
        fontFamily: Fonts.regular,
        color: Colors.dark,
    },

    // --- BOTÃO FLUTUANTE ---
    floatingBtn: {
        position: "absolute",
        bottom: 30,
        left: Spacing.lg,
        right: Spacing.lg,
        backgroundColor: Colors.primary,
        height: 52,
        borderRadius: Radius.full,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: Spacing.lg,
        ...Shadows.md,
    },
    floatingBtnText: {
        color: Colors.light,
        fontFamily: Fonts.bold,
        fontSize: FontSizes.small,
    },
    badgeContainer: {
        backgroundColor: "rgba(255,255,255,0.2)",
        paddingHorizontal: Spacing.sm,
        paddingVertical: Spacing.xs,
        borderRadius: Radius.full,
    },
    badgeText: {
        color: Colors.light,
        fontSize: FontSizes.small,
        fontFamily: Fonts.bold,
    },
});