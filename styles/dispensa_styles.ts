import { Platform, StyleSheet, TextStyle } from "react-native";
import { Colors, Fonts, FontSizes, Radius, Shadows, Spacing } from "../constants/theme";

export const dispensaStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    scrollContent: {
        paddingHorizontal: Spacing.lg,
        paddingTop: Spacing.md,
        paddingBottom: Spacing.xl * 4,
    },

    // --- CARD DE ADIÇÃO (TOPO) ---
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

    // --- DROPDOWN DE UNIDADES (ADIÇÃO) ---
    unitPickerDropdown: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginTop: 12,
        padding: 10,
        backgroundColor: Colors.background,
        borderRadius: Radius.md,
        borderWidth: 1,
        borderColor: Colors.subtext + '20',
    },
    unitBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: Radius.md,
        backgroundColor: Colors.light,
        borderWidth: 1,
        borderColor: Colors.subtext + '30',
    },
    unitBadgeActive: {
        backgroundColor: Colors.secondary,
        borderColor: Colors.secondary,
    },
    unitBadgeText: {
        color: Colors.dark,
        fontWeight: '500',
        fontSize: 12,
    },
    unitBadgeTextActive: {
        color: Colors.light,
    },

    // --- LISTA DE INGREDIENTES ---
    sectionTitle: {
        fontFamily: Fonts.bold,
        fontSize: FontSizes.medium,
        color: Colors.dark,
        marginBottom: Spacing.md,
    },
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
        width: 24,
        height: 24,
        borderRadius: 12, // Circular
        borderWidth: 2,
        borderColor: Colors.secondary,
        justifyContent: "center",
        alignItems: "center",
    },
    checkboxActive: {
        backgroundColor: Colors.secondary,
    },
    ingredientInfo: {
        flex: 1,
        marginLeft: Spacing.md,
    },
    ingredientName: {
        fontFamily: Fonts.bold,
        fontSize: FontSizes.medium,
        color: Colors.dark,
        marginBottom: 4,
    },
    controlsRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    // Estilo Pílula (Rounded)
    listInputQtyWrap: {
        minWidth: 45,
        height: 28,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: Colors.subtext + '20',
        backgroundColor: Colors.background,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listInputQtyText: {
        fontFamily: Fonts.medium,
        fontSize: FontSizes.small,
        color: Colors.dark,
    },
    listPickerUnit: {
        minWidth: 55,
        height: 28,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: Colors.subtext + '20',
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 8,
        backgroundColor: Colors.background,
        gap: 4,
    },
    unitText: {
        fontSize: FontSizes.small - 1,
        fontFamily: Fonts.regular,
        color: Colors.dark,
    },
    deleteButton: {
        padding: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        textAlign: 'center',
        color: Colors.subtext,
        marginTop: 40,
        fontFamily: Fonts.regular,
    },

    // --- BOTÃO FLUTUANTE ---
    floatingBtn: {
        position: "absolute",
        bottom: Spacing.md,
        left: Spacing.lg,
        right: Spacing.lg,
        backgroundColor: Colors.primary,
        height: 55,
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
        backgroundColor: Colors.light + '99',
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        borderRadius: Radius.full,
        minWidth: 32,
        alignItems: 'center',
        justifyContent: 'center',
    },
    badgeText: {
        color: Colors.light,
        fontSize: FontSizes.small - 1,
        fontFamily: Fonts.bold,
    },

});