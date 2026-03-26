import { StyleSheet, Platform, TextStyle } from "react-native";
import { Colors, Fonts, FontSizes, Spacing, Radius, Shadows } from "../constants/theme";

export const dispensaStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    scrollContent: {
        paddingHorizontal: Spacing.lg,
        paddingTop: Spacing.md,
        paddingBottom: Spacing.xl * 3,
    },

    // --- CARD DE ADIÇÃO (ROLA COM A LISTA) ---
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
        marginBottom: Spacing.xs,
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
    inputField: {
        flex: 1.5,
    },
    row: {
        flexDirection: "row",
        gap: Spacing.sm,
        alignItems: "center",
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

    // --- ITENS DA LISTA ---
    ingredientItem: {
        flexDirection: "row",
        paddingVertical: Spacing.sm,
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
        marginBottom: Spacing.xs / 2,
    },
    controlsRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    listInputQty: {
        width: 50,
        height: 30,
        borderRadius: Radius.md,
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
        height: 30,
        borderRadius: Radius.md,
        borderWidth: 1,
        borderColor: Colors.primary + '30',
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 4,
        paddingHorizontal: 8,
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
        bottom: 15,
        left: Spacing.lg,
        right: Spacing.lg,
        backgroundColor: Colors.primary,
        height: 50,
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
        paddingVertical: Spacing.xs / 2,
        borderRadius: Radius.full,
    },
    badgeText: {
        color: Colors.light,
        fontSize: FontSizes.small - 1,
        fontFamily: Fonts.bold,
    },
});