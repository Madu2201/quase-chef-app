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

    // --- ITENS DA DISPENSA (ESTILO CARD) ---
    ingredientItem: {
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
        justifyContent: "center",
        alignItems: "center",
    },
    checkboxActive: {
        backgroundColor: Colors.secondary,
        borderColor: Colors.secondary,
    },
    ingredientInfo: {
        flex: 1,
        marginLeft: Spacing.md,
    },
    ingredientName: {
        fontFamily: Fonts.bold,
        fontSize: FontSizes.small + 1,
        color: Colors.dark,
    },
    controlsRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginTop: Spacing.xs,
    },
    // Estilo base para o input de Qtd
    listInputQty: {
        width: 50,
        height: 40,
        borderRadius: Radius.sm,
        borderWidth: 1.5,
        borderColor: Colors.subtext + '30',
        textAlign: "center",
        fontFamily: Fonts.medium,
        fontSize: FontSizes.small,
        color: Colors.dark,
        backgroundColor: Colors.background,
        ...Platform.select({
            web: { outlineStyle: 'none' } as any,
            default: {},
        }),
    } as TextStyle,
    listPickerUnit: {
        minWidth: 50,
        height: 40,
        borderRadius: Radius.sm,
        borderWidth: 1.5,
        borderColor: Colors.subtext + '30',
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 4,
        paddingHorizontal: Spacing.sm,
        backgroundColor: Colors.background,
    },
    unitText: {
        fontSize: FontSizes.small - 1,
        fontFamily: Fonts.bold,
        color: Colors.brown,
    },

    // --- BOTÃO FLUTUANTE ---
    floatingBtn: {
        position: "absolute",
        bottom: 15,
        left: Spacing.lg,
        right: Spacing.lg,
        backgroundColor: Colors.primary,
        height: 52,
        borderRadius: Radius.full,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: Spacing.lg,
        ...Shadows.lg,
    },
    floatingBtnText: {
        color: Colors.light,
        fontFamily: Fonts.bold,
        fontSize: FontSizes.small + 1,
    },
    badgeContainer: {
        backgroundColor: "rgba(255,255,255,0.2)",
        paddingHorizontal: Spacing.sm,
        paddingVertical: Spacing.xs,
        borderRadius: Radius.full,
    },
    badgeText: {
        color: Colors.light,
        fontSize: FontSizes.small - 1,
        fontFamily: Fonts.bold,
    },
});